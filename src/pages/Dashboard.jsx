// src/pages/Dashboard.jsx
import React, { useState, useMemo } from 'react';
import ChartComponent from '../components/ChartComponent';
import SummaryTable from '../components/SummaryTable';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetProfit,
  formatCurrency,
  generateSummaryData,
  getExpenseCategoryBreakdown,
  getIncomeExpenseDataForChart
} from '../utils/helpers';
import '../styles/components.css'; // For card styles

const Dashboard = ({ transactions, theme }) => {
    const [summaryPeriod, setSummaryPeriod] = useState('monthly'); // 'monthly', 'quarterly', 'yearly'
    const currentYear = new Date().getFullYear(); // Or allow year selection

    // Memoize calculations to avoid recomputing on every render unless transactions change
    const financialStats = useMemo(() => {
        const totalIncome = calculateTotalIncome(transactions);
        const totalExpenses = calculateTotalExpenses(transactions);
        const netProfit = calculateNetProfit(transactions);
        return { totalIncome, totalExpenses, netProfit };
    }, [transactions]);

    // Memoize summary data generation
    const summaryData = useMemo(() => {
        return generateSummaryData(transactions, summaryPeriod, currentYear);
    }, [transactions, summaryPeriod, currentYear]);

    // Memoize chart data preparation
    const incomeExpenseChartData = useMemo(() => {
        const { labels, incomeData, expenseData } = getIncomeExpenseDataForChart(summaryData);
        const style = getComputedStyle(document.body); // Get theme colors

        return {
            labels: labels,
            datasets: [
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: style.getPropertyValue('--chart-income-color'),
                borderColor: style.getPropertyValue('--chart-border-income'),
                borderWidth: 1,
            },
            {
                label: 'Expenses',
                data: expenseData,
                backgroundColor: style.getPropertyValue('--chart-expense-color'),
                borderColor: style.getPropertyValue('--chart-border-expense'),
                borderWidth: 1,
            },
            ],
        };
    }, [summaryData, theme]); // Recompute if summaryData or theme changes

     // Memoize expense breakdown data
    const expenseBreakdownData = useMemo(() => {
        const breakdown = getExpenseCategoryBreakdown(transactions);
        const labels = Object.keys(breakdown);
        const data = Object.values(breakdown);

        // Define a color palette (can be expanded or made dynamic)
        const backgroundColors = [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
            'rgba(83, 102, 255, 0.6)',
             'rgba(40, 159, 64, 0.6)',
             'rgba(210, 99, 132, 0.6)'
        ];
        const borderColors = backgroundColors.map(color => color.replace('0.6', '1')); // Make border solid

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Expense Breakdown',
                    data: data,
                    backgroundColor: backgroundColors.slice(0, labels.length), // Use only needed colors
                    borderColor: borderColors.slice(0, labels.length),
                    borderWidth: 1,
                },
            ],
        };
    }, [transactions, theme]); // Recompute if transactions or theme change

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Key Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3>Total Income</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--secondary-color)' }}>
            {formatCurrency(financialStats.totalIncome)}
          </p>
        </div>
        <div className="card">
          <h3>Total Expenses</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--danger-color)' }}>
            {formatCurrency(financialStats.totalExpenses)}
          </p>
        </div>
        <div className="card">
          <h3>Net Profit / Loss</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '600', color: financialStats.netProfit >= 0 ? 'var(--secondary-color)' : 'var(--danger-color)' }}>
            {formatCurrency(financialStats.netProfit)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Financial Overview</h2>
         {/* Period Selector for Bar Chart & Table */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            <button
                className={`btn btn-sm ${summaryPeriod === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSummaryPeriod('monthly')}>Monthly
            </button>
            <button
                 className={`btn btn-sm ${summaryPeriod === 'quarterly' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSummaryPeriod('quarterly')}>Quarterly
            </button>
            <button
                 className={`btn btn-sm ${summaryPeriod === 'yearly' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSummaryPeriod('yearly')}>Yearly
            </button>
            <span style={{ marginLeft: 'auto', color: 'var(--subtle-text-color)', alignSelf: 'center' }}>
                Year: {currentYear}
            </span>
             {/* TODO: Add year selector dropdown/buttons */}
        </div>

        <ChartComponent
            type="bar"
            data={incomeExpenseChartData}
            options={{ plugins: { title: { text: `Income vs. Expenses (${summaryPeriod})` } } }}
            theme={theme}
         />
      </div>

       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card">
                <h2>Expense Breakdown (All Time)</h2>
                 <ChartComponent
                    type="pie"
                    data={expenseBreakdownData}
                    options={{ plugins: { title: { text: 'Expenses by Category' } } }}
                    theme={theme}
                />
            </div>
            <div className="card">
                 <h2>{`${summaryPeriod.charAt(0).toUpperCase() + summaryPeriod.slice(1)} Summary Table`}</h2>
                <SummaryTable data={summaryData} />
             </div>
        </div>


    </div>
  );
};

export default Dashboard;