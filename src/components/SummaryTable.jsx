// src/components/SummaryTable.jsx
import React from 'react';
import { formatCurrency } from '../utils/helpers';
import '../styles/components.css';

const SummaryTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No summary data available for this period.</p>;
  }

  // Calculate totals for the footer
  const totals = data.reduce((acc, item) => {
    acc.income += item.income;
    acc.expenses += item.expenses;
    acc.net += item.net;
    return acc;
  }, { income: 0, expenses: 0, net: 0 });


  return (
     <div className="table-wrapper">
        <table className="table">
            <thead>
                <tr>
                    <th>Period</th>
                    <th>Total Income</th>
                    <th>Total Expenses</th>
                    <th>Net Profit/Loss</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.periodLabel}>
                        <td>{item.periodLabel}</td>
                        <td className="amount-income">{formatCurrency(item.income)}</td>
                        <td className="amount-expense">{formatCurrency(item.expenses)}</td>
                        <td className={item.net >= 0 ? 'amount-income' : 'amount-expense'}>
                            {formatCurrency(item.net)}
                        </td>
                    </tr>
                ))}
            </tbody>
             <tfoot>
                <tr style={{ fontWeight: 'bold', backgroundColor: 'var(--background-color)'}}>
                    <td>Total</td>
                    <td className="amount-income">{formatCurrency(totals.income)}</td>
                    <td className="amount-expense">{formatCurrency(totals.expenses)}</td>
                    <td className={totals.net >= 0 ? 'amount-income' : 'amount-expense'}>
                        {formatCurrency(totals.net)}
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
  );
};

export default SummaryTable;