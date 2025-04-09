// src/pages/Transactions.jsx
import React, { useState, useMemo } from 'react';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/Modal';
import { calculateBalance, formatCurrency } from '../utils/helpers';
import '../styles/components.css'; // For buttons, forms

const Transactions = ({ transactions, addTransaction, editTransaction, deleteTransaction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');

  const runningBalance = useMemo(() => calculateBalance(transactions), [transactions]);

  const handleAddClick = () => {
    setTransactionToEdit(null); // Ensure form is for adding
    setIsModalOpen(true);
  };

  const handleEditClick = (transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    // Optional: Add confirmation dialog here
    if (window.confirm('Are you sure you want to delete this transaction?')) {
        deleteTransaction(id);
    }
  };

  const handleFormSubmit = (transactionData) => {
    if (transactionToEdit) {
      editTransaction(transactionData);
    } else {
      addTransaction(transactionData);
    }
    setIsModalOpen(false); // Close modal on successful submit
    setTransactionToEdit(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTransactionToEdit(null);
  };

  // Filtering Logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        // Date Range Filter
        const transactionDate = new Date(t.date);
        const startDate = filterDateStart ? new Date(filterDateStart) : null;
        const endDate = filterDateEnd ? new Date(filterDateEnd) : null;

        // Adjust end date to include the entire day
        if (endDate) endDate.setHours(23, 59, 59, 999);

        if (startDate && transactionDate < startDate) return false;
        if (endDate && transactionDate > endDate) return false;

        // Category Filter (Case-insensitive)
        if (filterCategory && t.category.toLowerCase() !== filterCategory.toLowerCase()) {
            return false;
        }

        // Search Term Filter (Check category, description, amount - case-insensitive)
        const lowerSearchTerm = searchTerm.toLowerCase();
        if (lowerSearchTerm &&
            !t.category.toLowerCase().includes(lowerSearchTerm) &&
            !t.description.toLowerCase().includes(lowerSearchTerm) &&
            !t.amount.toString().includes(lowerSearchTerm) // Basic amount check
           ) {
          return false;
        }

        return true; // Include if all filters pass
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
  }, [transactions, searchTerm, filterCategory, filterDateStart, filterDateEnd]);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
     const uniqueCategories = new Set(transactions.map(t => t.category));
     return ['', ...Array.from(uniqueCategories).sort()]; // Add 'All' option and sort
  }, [transactions]);


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1>Transaction Log</h1>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <span style={{fontWeight: 500, color: 'var(--subtle-text-color)'}}>Running Balance:</span>
            <span style={{fontWeight: 600, fontSize: '1.1rem', color: runningBalance >= 0 ? 'var(--secondary-color)' : 'var(--danger-color)'}}>
                {formatCurrency(runningBalance)}
            </span>
            <button onClick={handleAddClick} className="btn btn-primary">
                Add Transaction
            </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
       <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                <div>
                    <label htmlFor="search" style={{fontSize: '0.8rem', marginBottom:'0.25rem', display:'block'}}>Search</label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                 <div>
                    <label htmlFor="filterCategory" style={{fontSize: '0.8rem', marginBottom:'0.25rem', display:'block'}}>Category</label>
                    <select
                        id="filterCategory"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                     >
                       {categories.map(cat => (
                            <option key={cat} value={cat}>{cat === '' ? 'All Categories' : cat}</option>
                       ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="filterDateStart" style={{fontSize: '0.8rem', marginBottom:'0.25rem', display:'block'}}>Start Date</label>
                    <input
                        type="date"
                        id="filterDateStart"
                        value={filterDateStart}
                        onChange={(e) => setFilterDateStart(e.target.value)}
                     />
                </div>
                <div>
                    <label htmlFor="filterDateEnd" style={{fontSize: '0.8rem', marginBottom:'0.25rem', display:'block'}}>End Date</label>
                    <input
                        type="date"
                        id="filterDateEnd"
                        value={filterDateEnd}
                        onChange={(e) => setFilterDateEnd(e.target.value)}
                     />
                </div>
                {/* Optional: Clear Filters Button */}
                 <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                        setSearchTerm('');
                        setFilterCategory('');
                        setFilterDateStart('');
                        setFilterDateEnd('');
                    }}
                    style={{ justifySelf: 'start' }} // Align button if needed
                >
                    Clear Filters
                </button>
            </div>
        </div>

      <TransactionList
        transactions={filteredTransactions}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}
      >
        <TransactionForm
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          transactionToEdit={transactionToEdit}
        />
      </Modal>
    </div>
  );
};

export default Transactions;