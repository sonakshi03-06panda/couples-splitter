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
        <h2 className="text-2xl font-bold mb-4">Expenses</h2>
        <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-600 text-lg">No expenses yet</p>
          <p className="text-gray-500 text-sm mt-1">Add an expense to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Expenses</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b-2 border-gray-400">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Paid By</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => {
              const payer = userMap.get(expense.payerId);

              return (
                <tr
                  key={expense.id}
                  className={`border-b border-gray-300 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {/* Date */}
                  <td className="px-4 py-3 text-gray-800">
                    {formatDate(expense.date)}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-gray-800">{expense.category}</td>

                  {/* Paid By */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {payer && (
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: payer.color }}
                        />
                      )}
                      <span className="text-gray-800">{payer?.name || 'Unknown'}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    {formatAmount(expense.amount)}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      disabled={deletingId === expense.id}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-1 px-3 rounded transition-colors text-sm"
                    >
                      {deletingId === expense.id ? 'Deleting...' : 'Delete'}
                    </button>
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
