# ApexPulse — Enterprise AI Financial Analytics Dashboard

ApexPulse is a modern financial intelligence and analytics web application. Designed for business leaders, financial operations, and SaaS managers, it provides real-time financial tracking, dynamic data visualizations, multi-currency conversion, AI growth forecasting, and automated PDF report generation.

![ApexPulse Overview](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🚀 Live Demo

Explore the live application here: **[https://apexpulses.netlify.app]

---

## ✨ Key Features

- **Executive KPI Dashboard**: Instant visualization of Total Revenue, Expenses, Net Profit, and dynamic Profit Margin metrics.
- **AI Growth Forecasting Engine**: Automated predictive model projecting next-month growth trajectories based on weighted income trends.
- **Interactive Data Visualizations**: 
  - Dual-line area trend graph for Revenue vs. Expenses over time.
  - Category-level expense allocation doughnut chart.
- **Dynamic Multi-Currency Engine**: On-the-fly currency switching supporting USD ($), EUR (€), GBP (£), and NGN (₦).
- **Full Transaction Management**: Complete CRUD functionality to add, filter, search, edit, and delete income and expense records.
- **Client-Side PDF Exports**: One-click generation of print-ready landscape financial summary reports powered by `html2pdf.js`.
- **Responsive Dark/Light Mode**: Full theme customization with state persistence across sessions.
- **Persistent Local Data**: Automatic state sync with browser `localStorage`.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Modern Flexbox, CSS Grid, Custom Variables)
- **Scripting**: Modern JavaScript (ES6+, Async DOM Parsing, LocalStorage Engine)
- **Data Visualization**: Chart.js
- **PDF Rendering**: html2pdf.js
- **Icons**: FontAwesome 6.4

---

## 📁 Project Structure

```text
ApexPulse/
│
├── index.html          # Main HTML structure, KPI grid, charts, and modals
├── style.css           # Custom UI styling, themes, and responsive design system
├── app.js              # State management, financial calculations, Chart.js logic, and CRUD operations
├── README.md           # Project documentation
└── .gitignore          # System files ignore configurations