'use client';

import { useState } from 'react';
import type { User } from '@/types';

interface ExpenseFormProps {
  users: User[];
  onExpenseAdded: (e?: React.MouseEvent) => void;
}

const CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Health',
  'Other',
];

export default function ExpenseForm({ users, onExpenseAdded }: ExpenseFormProps) {
  const [payerId, setPayerId] = useState<number | ''>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  /**
   * Toggle member selection for expense split
   */
  const toggleMember = (userId: number) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedMembers(newSelected);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!payerId) {
      setError('Please select who paid');
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    if (!date) {
      setError('Please select a date');
      return;
    }

    if (selectedMembers.size === 0) {
      setError('Please select at least one member to split among');
      return;
    }

    try {
      setLoading(true);

      // Calculate equal share for each member
      const expenseAmount = Number(amount);
      const sharePerMember = expenseAmount / selectedMembers.size;

      // Create members array with calculated shares
      const members = Array.from(selectedMembers).map((userId) => ({
        userId,
        share: Math.round(sharePerMember * 100) / 100, // Round to 2 decimals
      }));

      // POST to API
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: expenseAmount,
          category,
          date: new Date(date).toISOString(),
          payerId: Number(payerId),
          members,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.details
          ? errorData.details.join(', ')
          : errorData.message || 'Failed to create expense';
        throw new Error(errorMessage);
      }

      // Success
      setSuccess(true);
      setPayerId('');
      setAmount('');
      setCategory('');
      setDate('');
      setSelectedMembers(new Set());

      // Call callback with button click event
      const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLElement;
      const buttonEvent = {
        clientX: submitButton?.getBoundingClientRect().left ?? window.innerWidth / 2,
        clientY: submitButton?.getBoundingClientRect().top ?? window.innerHeight / 2,
      } as React.MouseEvent;
      
      onExpenseAdded(buttonEvent);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rpg-dialog">
      <h2 className="rpg-dialog-title">
        <span>🛒</span>
        Add Expense
      </h2>

      {error && (
        <div className="rpg-popup rpg-popup-error">
          <span className="rpg-popup-icon">⚠️</span>
          <span className="rpg-popup-text">{error}</span>
        </div>
      )}

      {success && (
        <div className="rpg-popup rpg-popup-success">
          <span className="rpg-popup-icon">✅</span>
          <span className="rpg-popup-text">Expense Added!</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Who Paid */}
        <div className="rpg-input-box">
          <label htmlFor="payer" className="rpg-input-label">
            <span className="rpg-input-icon">👤</span>
            Who Paid?
          </label>
          <select
            id="payer"
            value={payerId}
            onChange={(e) => setPayerId(e.target.value ? Number(e.target.value) : '')}
            disabled={loading}
          >
            <option value="">Select a person</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="rpg-input-box">
          <label htmlFor="amount" className="rpg-input-label">
            <span className="rpg-input-icon">💰</span>
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            disabled={loading}
          />
        </div>

        {/* Category */}
        <div className="rpg-input-box">
          <label htmlFor="category" className="rpg-input-label">
            <span className="rpg-input-icon">🏷️</span>
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="rpg-input-box">
          <label htmlFor="date" className="rpg-input-label">
            <span className="rpg-input-icon">📅</span>
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Members to Split Among */}
        <div className="rpg-checkbox-grid">
          <div className="rpg-checkbox-grid-title">
            <span>👥</span>
            Split Among
          </div>
          <div className="rpg-checkbox-list">
            {users.length === 0 ? (
              <p className="text-sm text-retro-dark-brown font-medium">No users available</p>
            ) : (
              users.map((user) => (
                <label
                  key={user.id}
                  htmlFor={`member-${user.id}`}
                  className="rpg-member-checkbox"
                >
                  <input
                    id={`member-${user.id}`}
                    type="checkbox"
                    checked={selectedMembers.has(user.id)}
                    onChange={() => toggleMember(user.id)}
                    disabled={loading}
                  />
                  <div
                    className="rpg-member-checkbox-square"
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="rpg-member-name">{user.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || users.length === 0}
          className="rpg-submit-button"
        >
          {loading ? '⏳ Processing...' : '✓ Confirm'}
        </button>
      </form>
    </div>
  );
}
