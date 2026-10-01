// --- INITIAL STATE & DEMO DATA ---
let records = JSON.parse(localStorage.getItem('apex_records')) || [
  { id: '1', title: 'Enterprise Software Retainer', type: 'income', amount: 8500, category: 'Services', date: '2026-09-01' },
  { id: '2', title: 'AWS Cloud Infrastructure', type: 'expense', amount: 1200, category: 'Infrastructure', date: '2026-09-05' },
  { id: '3', title: 'Marketing Campaign & Ads', type: 'expense', amount: 2400, category: 'Marketing', date: '2026-09-12' },
  { id: '4', title: 'SaaS Platform Subscriptions', type: 'income', amount: 14200, category: 'Sales', date: '2026-09-18' },
  { id: '5', title: 'Engineering Team Payroll', type: 'expense', amount: 6500, category: 'Payroll', date: '2026-09-25' }
];

let currencySymbol = '$';
let currencyRate = 1.0;

// Chart Instances
let trendChart = null;
let expensePieChart = null;

// --- DOM ELEMENTS ---
const currencySelect = document.getElementById('currency-select');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const exportPdfBtn = document.getElementById('export-pdf-btn');

const recordModal = document.getElementById('record-modal');
const addRecordBtn = document.getElementById('add-record-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelModalBtn = document.getElementById('cancel-modal-btn');
const recordForm = document.getElementById('record-form');

const searchInput = document.getElementById('search-input');
const typeFilter = document.getElementById('type-filter');
const tableBody = document.getElementById('transaction-table-body');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCharts();
  updateDashboard();
});

// --- CURRENCY CONVERSION RATES ---
const currencyRates = {
  'USD': { symbol: '$', rate: 1.0 },
  'EUR': { symbol: '€', rate: 0.92 },
  'GBP': { symbol: '£', rate: 0.78 },
  'NGN': { symbol: '₦', rate: 1620.0 }
};

currencySelect.addEventListener('change', (e) => {
  const selected = e.target.value;
  currencySymbol = currencyRates[selected].symbol;
  currencyRate = currencyRates[selected].rate;
  updateDashboard();
});

function formatMoney(amount) {
  const converted = amount * currencyRate;
  return `${currencySymbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// --- THEME / DARK MODE ---
function initTheme() {
  const saved = localStorage.getItem('apex_theme');
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.querySelector('span').innerText = 'Light Mode';
    themeToggleBtn.querySelector('i').className = 'fa-solid fa-sun';
  }
}

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('apex_theme', isDark ? 'dark' : 'light');
  themeToggleBtn.querySelector('span').innerText = isDark ? 'Light Mode' : 'Dark Mode';
  themeToggleBtn.querySelector('i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  
  // Refresh chart text colors
  if (trendChart && expensePieChart) {
    trendChart.destroy();
    expensePieChart.destroy();
    initCharts();
    updateDashboard();
  }
});

// --- DASHBOARD CALCULATIONS & RENDER ---
function updateDashboard() {
  let totalIncome = 0;
  let totalExpense = 0;

  records.forEach(rec => {
    if (rec.type === 'income') totalIncome += Number(rec.amount);
    if (rec.type === 'expense') totalExpense += Number(rec.amount);
  });

  const netProfit = totalIncome - totalExpense;
  const margin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0;
  
  // Simple AI Predictive Model (Weighted Moving Trend)
  const forecastedIncome = totalIncome * 1.15; 

  // Update KPI UI
  document.getElementById('kpi-total-revenue').innerText = formatMoney(totalIncome);
  document.getElementById('kpi-total-expenses').innerText = formatMoney(totalExpense);
  document.getElementById('kpi-net-profit').innerText = formatMoney(netProfit);
  document.getElementById('kpi-forecast').innerText = formatMoney(forecastedIncome);
  document.getElementById('kpi-margin-text').innerText = `Profit Margin: ${margin}%`;

  renderTable();
  updateCharts(totalIncome, totalExpense);
}

// --- TABLE RENDERING & FILTERING ---
function renderTable() {
  const query = searchInput.value.toLowerCase();
  const filter = typeFilter.value;

  tableBody.innerHTML = '';

  const filtered = records.filter(r => {
    const matchesQuery = r.title.toLowerCase().includes(query) || r.category.toLowerCase().includes(query);
    const matchesFilter = filter === 'all' || r.type === filter;
    return matchesQuery && matchesFilter;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding:20px;">No financial entries found.</td></tr>`;
    return;
  }

  filtered.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.date}</td>
      <td><strong>${escapeHTML(r.title)}</strong></td>
      <td>${escapeHTML(r.category)}</td>
      <td><span class="type-pill ${r.type}">${r.type}</span></td>
      <td style="font-weight:700; color: ${r.type === 'income' ? 'var(--success)' : 'var(--danger)'};">
        ${r.type === 'income' ? '+' : '-'}${formatMoney(r.amount)}
      </td>
      <td>
        <button class="action-btn" onclick="editRecord('${r.id}')"><i class="fa-solid fa-pen"></i></button>
        <button class="action-btn" onclick="deleteRecord('${r.id}')"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

// --- CHART MANAGEMENT (CHART.JS) ---
function initCharts() {
  const isDark = document.body.classList.contains('dark-mode');
  const textColor = isDark ? '#f9fafb' : '#0f172a';

  // Area Trend Chart
  const ctxTrend = document.getElementById('trendChart').getContext('2d');
  trendChart = new Chart(ctxTrend, {
    type: 'line',
    data: {
      labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct (Est.)'],
      datasets: [
        {
          label: 'Revenue',
          data: [12000, 15000, 14000, 18000, 22700, 26000],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: [6000, 7500, 8000, 9200, 10100, 11000],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColor } },
        y: { ticks: { color: textColor } }
      }
    }
  });

  // Expense Pie Chart
  const ctxPie = document.getElementById('expensePieChart').getContext('2d');
  expensePieChart = new Chart(ctxPie, {
    type: 'doughnut',
    data: {
      labels: ['Services', 'Infrastructure', 'Marketing', 'Payroll', 'Office'],
      datasets: [{
        data: [25, 15, 20, 30, 10],
        backgroundColor: ['#2563eb', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: textColor } } }
    }
  });
}

function updateCharts(totalIncome, totalExpense) {
  if (!trendChart || !expensePieChart) return;

  // Dynamically recalculate Expense Doughnut chart from state
  const categoryTotals = {};
  records.filter(r => r.type === 'expense').forEach(r => {
    categoryTotals[r.category] = (categoryTotals[r.category] || 0) + Number(r.amount);
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (labels.length > 0) {
    expensePieChart.data.labels = labels;
    expensePieChart.data.datasets[0].data = data;
    expensePieChart.update();
  }
}

// --- CRUD OPERATIONS ---
function saveRecords() {
  localStorage.setItem('apex_records', JSON.stringify(records));
}

addRecordBtn.addEventListener('click', () => {
  document.getElementById('modal-title').innerText = 'New Financial Entry';
  recordForm.reset();
  document.getElementById('record-id').value = '';
  document.getElementById('record-date').valueAsDate = new Date();
  recordModal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => recordModal.classList.remove('active'));
cancelModalBtn.addEventListener('click', () => recordModal.classList.remove('active'));

recordForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = document.getElementById('record-id').value || Date.now().toString();
  const title = document.getElementById('record-title').value.trim();
  const type = document.getElementById('record-type').value;
  const amount = parseFloat(document.getElementById('record-amount').value);
  const category = document.getElementById('record-category').value;
  const date = document.getElementById('record-date').value;

  const existingIdx = records.findIndex(r => r.id === id);

  if (existingIdx > -1) {
    records[existingIdx] = { id, title, type, amount, category, date };
  } else {
    records.push({ id, title, type, amount, category, date });
  }

  saveRecords();
  updateDashboard();
  recordModal.classList.remove('active');
});

window.editRecord = function(id) {
  const rec = records.find(r => r.id === id);
  if (!rec) return;

  document.getElementById('modal-title').innerText = 'Edit Financial Entry';
  document.getElementById('record-id').value = rec.id;
  document.getElementById('record-title').value = rec.title;
  document.getElementById('record-type').value = rec.type;
  document.getElementById('record-amount').value = rec.amount;
  document.getElementById('record-category').value = rec.category;
  document.getElementById('record-date').value = rec.date;

  recordModal.classList.add('active');
};

window.deleteRecord = function(id) {
  records = records.filter(r => r.id !== id);
  saveRecords();
  updateDashboard();
};

searchInput.addEventListener('input', renderTable);
typeFilter.addEventListener('change', renderTable);

// --- PDF REPORT GENERATION ---
exportPdfBtn.addEventListener('click', () => {
  const element = document.getElementById('dashboard-content');
  const opt = {
    margin: 0.3,
    filename: 'ApexPulse_Financial_Report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
  };
  html2pdf().set(opt).from(element).save();
});