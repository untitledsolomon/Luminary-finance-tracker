// src/components/TransactionList.jsx
import React from 'react';
import TransactionItem from './TransactionItem';
import '../styles/components.css'; // Ensure table styles are here

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  if (!transactions || transactions.length === 0) {
    return <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--subtle-text-color)' }}>No transactions found.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;