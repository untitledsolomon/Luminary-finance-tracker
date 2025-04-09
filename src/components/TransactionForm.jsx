// src/components/TransactionForm.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import '../styles/components.css';

const TransactionForm = ({ onSubmit, onCancel, transactionToEdit }) => {
  const initialFormState = {
    type: 'expense',
    date: format(new Date(), 'yyyy-MM-dd'), // Default to today
    category: '',
    amount: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transactionToEdit) {
      // Pre-fill form if editing
      setFormData({
        type: transactionToEdit.type,
        date: transactionToEdit.date,
        category: transactionToEdit.category,
        amount: transactionToEdit.amount.toString(), // Amount needs to be string for input
        description: transactionToEdit.description,
      });
    } else {
      // Reset form if adding new
      setFormData(initialFormState);
    }
    setErrors({}); // Clear errors when form opens or changes mode
  }, [transactionToEdit]); // Rerun effect when transactionToEdit changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Enter a valid positive amount';
    }
    // Description is optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount), // Convert amount back to number
        id: transactionToEdit ? transactionToEdit.id : crypto.randomUUID(), // Assign new ID or keep existing one
      });
      setFormData(initialFormState); // Reset form after successful submit
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Type</label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleChange}
              style={{ width: 'auto', marginRight: '0.5rem' }}
            /> Income
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleChange}
              style={{ width: 'auto', marginRight: '0.5rem' }}
            /> Expense
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        {errors.date && <p style={{ color: 'var(--danger-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.date}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g., Salary, Groceries, Software"
          required
        />
         {errors.category && <p style={{ color: 'var(--danger-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.category}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          required
        />
         {errors.amount && <p style={{ color: 'var(--danger-color)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.amount}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description (Optional)</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="e.g., Client Project A payment"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {transactionToEdit ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;