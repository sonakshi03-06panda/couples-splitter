'use client';

import { useState } from 'react';
import type { Expense, User } from '@/types';

interface ExpenseListProps {
  expenses: Expense[];
  users: User[];
  onDelete: (id: number) => void;
}

/**
 * Format date to MM/DD/YYYY
 */
function formatDate(date: Date | string): string {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

/**
 * Format amount to $X.XX
 */
function formatAmount(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Get emoji for category
 */
function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    FOOD: '🍕',
    UTILITIES: '💡',
    TRANSPORT: '🚗',
    ENTERTAINMENT: '🎬',
    GROCERIES: '🛒',
    DINING: '🍽️',
    GAS: '⛽',
    SHOPPING: '🛍️',
    MOVIE: '🎬',
    TRAVEL: '✈️',
    UTILITIES_ELECTRIC: '💡',
    UTILITIES_WATER: '💧',
    UTILITIES_GAS: '🔥',
    OTHER: '💸',
  };
  return emojiMap[category] || '💰';
}

export default function ExpenseList({ expenses, users, onDelete }: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Create map for quick user lookup
  const userMap = new Map(users.map((u) => [u.id, u]));

  /**
   * Handle delete button click with confirmation
   */
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      onDelete(id);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error deleting expense');
    } finally {
      setDeletingId(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="w-full">
        <h2 className="expense-list-title">📝 EXPENSE HISTORY</h2>
        <div className="expense-empty-state">
          <div className="expense-empty-icon">🐷</div>
          <div className="expense-empty-title">NO EXPENSES YET!</div>
          <div className="expense-empty-message">Start tracking your expenses together</div>
          <button className="expense-empty-button">💰 Add Your First Expense</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="expense-list-title">📝 EXPENSE HISTORY</h2>
      <div className="expense-list-container">
        <table className="expense-table">
          {/* Header - Desktop Only */}
          <thead className="expense-table-header">
            <tr className="expense-table-header-row">
              <th className="expense-table-header-cell">📅 DATE</th>
              <th className="expense-table-header-cell">🏷️ CATEGORY</th>
              <th className="expense-table-header-cell">👤 PAID BY</th>
              <th className="expense-table-header-cell">💰 AMOUNT</th>
              <th className="expense-table-header-cell">⚙️ ACTION</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="expense-table-body">
            {expenses.map((expense) => {
              const payer = userMap.get(expense.payerId);
              const categoryEmoji = getCategoryEmoji(expense.category.toUpperCase());

              return (
                <tr key={expense.id} className="expense-row">
                  {/* Date */}
                  <td className="expense-cell">
                    <span className="expense-cell-label">📅 Date</span>
                    <span className="expense-cell-value">{formatDate(expense.date)}</span>
                  </td>

                  {/* Category */}
                  <td className="expense-cell">
                    <span className="expense-cell-label">🏷️ Category</span>
                    <span className="expense-cell-value expense-category-cell">
                      <span className="expense-category-icon">{categoryEmoji}</span>
                      {expense.category}
                    </span>
                  </td>

                  {/* Paid By */}
                  <td className="expense-cell">
                    <span className="expense-cell-label">👤 Paid By</span>
                    <span className="expense-cell-value">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {payer && (
                          <span
                            style={{
                              display: 'inline-block',
                              width: '12px',
                              height: '12px',
                              borderRadius: '2px',
                              border: '1px solid #5C4033',
                              backgroundColor: payer.color,
                            }}
                          />
                        )}
                        <span>{payer?.name || 'Unknown'}</span>
                      </div>
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="expense-cell">
                    <span className="expense-cell-label">💰 Amount</span>
                    <span className="expense-cell-value expense-amount-cell">
                      {formatAmount(expense.amount)}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="expense-cell">
                    <span className="expense-cell-label">⚙️ Action</span>
                    <span className="expense-cell-value">
                      <button
                        onClick={() => handleDelete(expense.id)}
                        disabled={deletingId === expense.id}
                        className="expense-delete-btn"
                      >
                        🗑️
                        <span>{deletingId === expense.id ? 'DELETING...' : 'DELETE'}</span>
                      </button>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
