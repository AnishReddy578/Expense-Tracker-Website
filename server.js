const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read DB
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { categories: [], budgets: {}, transactions: [] };
  }
}

// Helper to write DB
async function writeDB(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

// --- API ENDPOINTS ---

// GET /api/categories
app.get('/api/categories', async (req, res) => {
  const db = await readDB();
  res.json(db.categories || []);
});

// POST /api/categories
app.post('/api/categories', async (req, res) => {
  const { name, color, icon, type } = req.body;
  if (!name || !color) {
    return res.status(400).json({ error: 'Name and color are required' });
  }

  const db = await readDB();
  const id = 'cat_' + Date.now();
  const newCat = { id, name, color, icon: icon || '📌', type: type || 'expense' };
  db.categories.push(newCat);
  await writeDB(db);

  res.status(201).json(newCat);
});

// GET /api/transactions with filtering & sorting
app.get('/api/transactions', async (req, res) => {
  const db = await readDB();
  let list = [...(db.transactions || [])];

  const { search, category, type, startDate, endDate, sortBy = 'date', order = 'desc' } = req.query;

  // Filtering
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(t => 
      t.description.toLowerCase().includes(s) || 
      t.category.toLowerCase().includes(s) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(s)))
    );
  }

  if (category && category !== 'all') {
    list = list.filter(t => t.category === category || t.categoryId === category);
  }

  if (type && type !== 'all') {
    list = list.filter(t => t.type === type);
  }

  if (startDate) {
    list = list.filter(t => t.date >= startDate);
  }

  if (endDate) {
    list = list.filter(t => t.date <= endDate);
  }

  // Sorting
  list.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'amount') {
      valA = Number(valA);
      valB = Number(valB);
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  res.json(list);
});

// POST /api/transactions
app.post('/api/transactions', async (req, res) => {
  const { type, amount, category, categoryId, date, paymentMethod, description, tags } = req.body;

  if (!type || !amount || !category || !date) {
    return res.status(400).json({ error: 'Type, amount, category, and date are required.' });
  }

  const db = await readDB();
  const id = 'tx_' + Date.now();
  const parsedAmount = Math.abs(parseFloat(amount));

  const newTx = {
    id,
    type,
    amount: parsedAmount,
    category,
    categoryId: categoryId || (db.categories.find(c => c.name === category)?.id || ''),
    date,
    paymentMethod: paymentMethod || 'Cash',
    description: description || category,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [])
  };

  db.transactions.unshift(newTx);
  await writeDB(db);

  res.status(201).json(newTx);
});

// PUT /api/transactions/:id
app.put('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const db = await readDB();
  const index = db.transactions.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const existing = db.transactions[index];
  const { type, amount, category, categoryId, date, paymentMethod, description, tags } = req.body;

  const updatedTx = {
    ...existing,
    type: type || existing.type,
    amount: amount !== undefined ? Math.abs(parseFloat(amount)) : existing.amount,
    category: category || existing.category,
    categoryId: categoryId || existing.categoryId,
    date: date || existing.date,
    paymentMethod: paymentMethod || existing.paymentMethod,
    description: description !== undefined ? description : existing.description,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : existing.tags)
  };

  db.transactions[index] = updatedTx;
  await writeDB(db);

  res.json(updatedTx);
});

// DELETE /api/transactions/:id
app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const db = await readDB();
  const initialLen = db.transactions.length;
  db.transactions = db.transactions.filter(t => t.id !== id);

  if (db.transactions.length === initialLen) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  await writeDB(db);
  res.json({ message: 'Transaction deleted successfully', id });
});

// GET /api/budgets
app.get('/api/budgets', async (req, res) => {
  const db = await readDB();
  const budgets = db.budgets || {};
  const categories = db.categories || [];

  // Calculate current spent per category for current month or overall
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const categorySpent = {};
  (db.transactions || []).forEach(tx => {
    if (tx.type === 'expense' && tx.date.startsWith(currentMonthStr)) {
      const key = tx.categoryId || tx.category;
      categorySpent[key] = (categorySpent[key] || 0) + tx.amount;
    }
  });

  const budgetOverview = categories
    .filter(c => c.type === 'expense' || !c.type)
    .map(cat => {
      const limit = budgets[cat.id] || budgets[cat.name] || 0;
      const spent = categorySpent[cat.id] || categorySpent[cat.name] || 0;
      const remaining = limit - spent;
      const percentage = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        color: cat.color,
        icon: cat.icon,
        limit,
        spent,
        remaining,
        percentage,
        isOverBudget: limit > 0 && spent > limit
      };
    });

  res.json({
    budgets,
    overview: budgetOverview
  });
});

// POST /api/budgets
app.post('/api/budgets', async (req, res) => {
  const { budgets } = req.body;
  if (!budgets || typeof budgets !== 'object') {
    return res.status(400).json({ error: 'Invalid budgets object' });
  }

  const db = await readDB();
  db.budgets = { ...db.budgets, ...budgets };
  await writeDB(db);

  res.json({ message: 'Budgets updated successfully', budgets: db.budgets });
});

// GET /api/analytics
app.get('/api/analytics', async (req, res) => {
  const db = await readDB();
  const transactions = db.transactions || [];
  const categories = db.categories || [];

  let totalIncome = 0;
  let totalExpense = 0;

  const categoryTotals = {};
  const monthlyData = {}; // e.g. { '2026-08': { income: X, expense: Y } }
  const dailyTrends = {}; // e.g. { '2026-08-01': expenseAmount }

  transactions.forEach(t => {
    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      totalIncome += amt;
    } else {
      totalExpense += amt;
      const catKey = t.category;
      categoryTotals[catKey] = (categoryTotals[catKey] || 0) + amt;

      const dateKey = t.date;
      dailyTrends[dateKey] = (dailyTrends[dateKey] || 0) + amt;
    }

    const monthKey = t.date.substring(0, 7);
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      monthlyData[monthKey].income += amt;
    } else {
      monthlyData[monthKey].expense += amt;
    }
  });

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

  // Format category breakdown with colors
  const categoryBreakdown = Object.keys(categoryTotals).map(catName => {
    const catObj = categories.find(c => c.name === catName);
    return {
      category: catName,
      amount: categoryTotals[catName],
      color: catObj ? catObj.color : '#FF6B6B',
      icon: catObj ? catObj.icon : '💸',
      percentage: totalExpense > 0 ? Math.round((categoryTotals[catName] / totalExpense) * 100) : 0
    };
  }).sort((a, b) => b.amount - a.amount);

  res.json({
    summary: {
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      transactionCount: transactions.length
    },
    categoryBreakdown,
    monthlyData,
    dailyTrends
  });
});

// POST /api/sample-data (Reset to vibrant demo dataset)
app.post('/api/sample-data', async (req, res) => {
  const initialData = require('./data/db.json');
  await writeDB(initialData);
  res.json({ message: 'Sample dataset loaded successfully' });
});

// GET /api/export (Export CSV or JSON)
app.get('/api/export', async (req, res) => {
  const format = req.query.format || 'csv';
  const db = await readDB();

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions_export.json"');
    return res.json(db.transactions);
  }

  // CSV output
  const headers = ['ID', 'Type', 'Amount', 'Category', 'Date', 'PaymentMethod', 'Description', 'Tags'];
  const rows = (db.transactions || []).map(t => [
    t.id,
    t.type,
    t.amount,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    t.date,
    `"${(t.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    `"${(t.tags || []).join(';')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="transactions_export.csv"');
  res.send(csvContent);
});

app.listen(PORT, () => {
  console.log(`🚀 Expense Tracker App server running at http://localhost:${PORT}`);
});
