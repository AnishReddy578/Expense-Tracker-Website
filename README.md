# 💰 FinancePulse 2024 - Personal Finance Management Web Application

> A vibrant, interactive, and full-stack personal finance web application designed to help users record, categorize, track daily transactions, monitor category budgets, and analyze spending patterns through rich visual charts.

---

## 📌 Project Overview

**Expense Tracker Website 2024** is a modern personal finance tool built to simplify money management. The application features a **vibrant, colourful glassmorphic interface**, real-time budget progress tracking, interactive Chart.js visualizations, and full REST API backend persistence with Node.js and Express.

---

## ✨ Features

- **🌈 Vibrant & Colourful UI**:
  - Light & Dark mode toggle with local persistence.
  - Modern Glassmorphic panel styling (`backdrop-filter: blur()`).
  - Colour-coded category badges with icons (🍔 Food, 🚗 Transport, 🛍️ Shopping, 🎬 Entertainment, ⚡ Utilities, 🏥 Healthcare, 💼 Salary, 💻 Freelance, 📈 Investments).
  - Summary KPI Cards: Total Income, Total Expenses, Net Savings, Budget Health.

- **📊 Interactive Data Visualizations (Chart.js)**:
  - **Category Expense Breakdown**: Doughnut chart with custom tooltips.
  - **Income vs Expense Comparison**: Dual bar chart comparing monthly inflows and outflows.
  - **Daily Spending Trend**: Smooth line chart tracking daily spending velocity over time.

- **🎯 Smart Budgeting & Alerts**:
  - Set monthly spending targets per expense category.
  - Animated progress bars with color alerts (Green = Safe <80%, Yellow = Warning 80-100%, Red = Over Budget >100%).
  - Budget health indicator and category over-limit notifications.

- **📝 Transaction Management**:
  - Add, edit, and delete transactions (Income & Expense).
  - Real-time search across descriptions, categories, and tags.
  - Filter transactions by Type, Category, and Date Range.
  - Click-to-sort columns (Date, Amount, Category).

- **💾 Data Portability & Persistence**:
  - Persistent JSON file database (`data/db.json`).
  - 1-click **Export to CSV** and **Export to JSON**.
  - **Preset Data Generator** button to instantly load colorful sample transactions for interactive demos.

---

## 🛠️ Tools & Technologies Used

- **Backend**: Node.js, Express.js, CORS, File System (`fs/promises`)
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 (CSS Variables, Flexbox, CSS Grid)
- **Data Visualization**: Chart.js v4
- **Icons & Fonts**: FontAwesome 6.5, Google Fonts (Plus Jakarta Sans)
- **Tooling & IDE**: Git, VS Code, npm

---

## 📁 Project Structure

```
c:/Users/admin/Desktop/project-1/
├── server.js               # Express server & REST API routes
├── package.json            # Node.js manifest & dependencies
├── README.md               # Documentation
├── data/
│   └── db.json             # File database (categories, budgets, transactions)
├── scripts/
│   └── test-api.js         # Integration test suite
└── public/                 # Static web application files
    ├── index.html          # HTML5 layout & modal templates
    ├── css/
    │   └── styles.css      # Colorful Glassmorphism stylesheet
    └── js/
        ├── api.js          # REST API client module
        ├── charts.js       # Chart.js initialization & update manager
        ├── ui.js           # UI rendering & DOM helper functions
        └── app.js          # Main SPA controller & state manager
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

1. **Clone or navigate to the project repository**:
   ```bash
   cd project-1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Express server**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/transactions` | Retrieve all transactions (supports query params: `search`, `category`, `type`, `startDate`, `endDate`, `sortBy`, `order`) |
| `POST` | `/api/transactions` | Create a new transaction |
| `PUT` | `/api/transactions/:id` | Update an existing transaction by ID |
| `DELETE` | `/api/transactions/:id` | Delete a transaction by ID |
| `GET` | `/api/categories` | Get all available categories |
| `POST` | `/api/categories` | Add a custom category |
| `GET` | `/api/budgets` | Get monthly category budget targets & current spent overview |
| `POST` | `/api/budgets` | Save/update monthly category budget targets |
| `GET` | `/api/analytics` | Get aggregate summary statistics, category breakdown, and monthly/daily trends |
| `POST` | `/api/sample-data` | Reset and populate vibrant sample transactions & budgets |
| `GET` | `/api/export` | Download transaction history as CSV (`?format=csv`) or JSON (`?format=json`) |

---

## 🧪 Running Integration Tests

To run the automated API integration tests against the live server:

```bash
npm test
```

Sample output:
```
🧪 Running Expense Tracker API Integration Tests...

  ✅ PASS: GET /api/categories returns array of categories
  ✅ PASS: GET /api/transactions returns transactions list
  ✅ PASS: POST /api/transactions creates a new transaction
  ✅ PASS: PUT /api/transactions/:id updates transaction
  ✅ PASS: GET /api/analytics returns correct summary stats
  ✅ PASS: GET /api/budgets returns category budget overview
  ✅ PASS: GET /api/export?format=csv returns CSV data
  ✅ PASS: DELETE /api/transactions/:id deletes transaction

📊 Test Results: 8 Passed, 0 Failed
```

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
