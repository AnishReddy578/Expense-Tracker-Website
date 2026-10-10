# 📦 Core System Modules: Expense Tracker 2024 (FinancePulse)

The **Expense Tracker 2024 - Personal Finance Management Web Application** is organized into **6 Core Functional Modules**. Each module handles a distinct set of operations, ensuring high modularity, easy maintenance, and scalable performance.

---

### 1. 📊 Module 1: User Dashboard & Financial Summary Module
- **Description**: Serves as the main control center of the web application, offering an instant snapshot of the user's financial status.
- **Key Features**:
  - **4 Real-time KPI Cards**: Total Income, Total Expenses, Net Savings, and Budget Health status.
  - **Savings Rate Calculation**: Automatic percentage ratio calculation (`(Net Savings / Total Income) * 100`).
  - **Theme Engine**: Light & Dark glassmorphic theme switcher with LocalStorage persistence.
- **Technical Implementation**:
  - **Frontend**: `UI.renderSummary()`, `App.toggleTheme()`
  - **Backend REST API**: `GET /api/analytics`

---

### 2. 📝 Module 2: Transaction Ledger & Record Management Module
- **Description**: Handles the complete lifecycle (CRUD) of daily financial transactions for income and expenses.
- **Key Features**:
  - **Record Creation & Editing**: Fast modal-driven forms with input validation (Amount, Category, Date, Payment Method, Description, Tags).
  - **Payment Method Tagging**: Support for Credit Card, Debit Card, Bank Transfer, Cash, PayPal, and UPI/Mobile payments.
  - **Category Auto-Assignment**: Automatic color and icon mapping per transaction category.
- **Technical Implementation**:
  - **Frontend**: `App.handleSaveTransaction()`, `App.editTransaction()`, `App.deleteTransaction()`
  - **Backend REST API**: `GET /api/transactions`, `POST /api/transactions`, `PUT /api/transactions/:id`, `DELETE /api/transactions/:id`

---

### 3. 📈 Module 3: Data Visualization & Graphical Analytics Module
- **Description**: Converts raw transaction logs into dynamic, interactive canvas visualizations powered by **Chart.js**.
- **Key Features**:
  - **Category Expense Breakdown (Doughnut Chart)**: Visual slice distribution with category color palettes and hover tooltips.
  - **Income vs Expense Comparison (Bar Chart)**: Side-by-side rounded bar chart comparing monthly inflows vs outflows.
  - **Spending Velocity Trend (Line Chart)**: Smooth tension curve displaying daily spending trends over time.
- **Technical Implementation**:
  - **Frontend**: `ChartManager.initCharts()`, `ChartManager.updateCharts()`, `ChartManager.refreshThemeColors()`
  - **Backend REST API**: Data aggregated via `GET /api/analytics`

---

### 4. 🎯 Module 4: Smart Category Budgeting & Alerts Module
- **Description**: Enforces personal budgeting discipline by setting spending caps and providing automated visual warning alerts.
- **Key Features**:
  - **Custom Category Targets**: Set monthly budget caps for individual expense categories (e.g., Food: $500, Shopping: $350).
  - **Dynamic Progress Gauges**: Animated progress bars showing exact percentage of budget consumed.
  - **Visual Alert Thresholds**:
    - 🟢 **Green (Safe)**: Spent < 80% of budget cap.
    - 🟡 **Yellow (Warning)**: Spent 80% – 100% of budget cap.
    - 🔴 **Red (Over Budget)**: Spent > 100% of budget cap with visual overspend warnings.
- **Technical Implementation**:
  - **Frontend**: `UI.renderBudgets()`, `App.populateBudgetModal()`, `App.handleSaveBudgets()`
  - **Backend REST API**: `GET /api/budgets`, `POST /api/budgets`

---

### 5. 🔍 Module 5: Advanced Search, Filtering & Sorting Module
- **Description**: Enables instant data discovery and customized ledger views across large transaction datasets.
- **Key Features**:
  - **Live Search Bar**: Real-time matching across transaction descriptions, category names, and custom `#tags`.
  - **Multi-Criteria Filters**: Simultaneous filtering by Transaction Type (Income/Expense), Category, and Date Range (Start Date – End Date).
  - **Dynamic Column Sorting**: Clickable table headers to sort records by Date or Amount in ascending or descending order.
- **Technical Implementation**:
  - **Frontend**: `App.applyFilters()`, table header click listeners
  - **Backend REST API**: Express query parameters processing (`search`, `category`, `type`, `startDate`, `endDate`, `sortBy`, `order`)

---

### 6. 💾 Module 6: Data Portability, Persistence & Import/Export Module
- **Description**: Manages backend file storage, dataset backups, data exports, and demo data initialization.
- **Key Features**:
  - **File-Backed JSON Database**: Atomic read/write operations to `data/db.json` without external database setup.
  - **CSV Export Engine**: Instant 1-click download of transaction ledger as a formatted `.csv` file for Excel or Google Sheets.
  - **JSON Backup Export**: Download complete transaction records as raw `.json`.
  - **1-Click Preset Demo Data**: Reset and populate vibrant sample financial records for quick demonstrations.
- **Technical Implementation**:
  - **Frontend**: Dropdown export handlers (`export-csv`, `export-json`), `btn-load-sample` trigger
  - **Backend REST API**: `GET /api/export?format=csv|json`, `POST /api/sample-data`, `readDB()`, `writeDB()`

---

## 📌 Module Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                           FINANCEPULSE 2024 ARCHITECTURE                           |
+-----------------------------------------------------------------------------------+
                                          |
     +------------------------------------+------------------------------------+
     |                                    |                                    |
+----+--------------------+      +--------+-----------------+      +-----------+----------------+
| Module 1: Dashboard     |      | Module 2: Transaction    |      | Module 3: Data Visuals     |
| • Summary KPI Cards     |      | • CRUD Operations        |      | • Category Doughnut Chart  |
| • Savings Rate %        |      | • Category & Tags        |      | • Income vs Expense Bar    |
| • Light/Dark Theme      |      | • Payment Methods        |      | • Spending Velocity Line   |
+-------------------------+      +--------------------------+      +----------------------------+
     |                                    |                                    |
     +------------------------------------+------------------------------------+
                                          |
     +------------------------------------+------------------------------------+
     |                                    |                                    |
+----+--------------------+      +--------+-----------------+      +-----------+----------------+
| Module 4: Budgeting     |      | Module 5: Search & Filter|      | Module 6: Data Portability |
| • Category Target Caps  |      | • Live Keyword Search    |      | • File-backed JSON DB      |
| • Progress Bars         |      | • Multi-criteria Filter  |      | • CSV & JSON Export        |
| • Color Alert System    |      | • Column Sorting         |      | • Preset Demo Generator    |
+-------------------------+      +--------------------------+      +----------------------------+
```
