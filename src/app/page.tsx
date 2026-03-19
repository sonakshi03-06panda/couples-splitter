'use client';

import { useState, useEffect } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import BalanceDisplay from '@/components/BalanceDisplay';
import SettlementSuggestions from '@/components/SettlementSuggestions';
import ExpenseList from '@/components/ExpenseList';
import type { User, Expense, BalanceData, Settlement } from '@/types';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<BalanceData>({});
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  /**
   * Fetch all data from APIs
   */
  const refreshData = async () => {
    try {
      setError('');
      setLoading(true);

      // Fetch users
      const usersResponse = await fetch('/api/users');
      if (!usersResponse.ok) throw new Error('Failed to fetch users');
      const usersData = await usersResponse.json();
      setUsers(usersData);

      // Fetch expenses
      const expensesResponse = await fetch('/api/expenses');
      if (!expensesResponse.ok) throw new Error('Failed to fetch expenses');
      const expensesData = await expensesResponse.json();
      setExpenses(expensesData);

      // Fetch balances and settlements
      const balancesResponse = await fetch('/api/balances');
      if (!balancesResponse.ok) throw new Error('Failed to fetch balances');
      const balancesData = await balancesResponse.json();
      setBalances(balancesData.balances);
      setSettlements(balancesData.settlements);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch data on component mount
   */
  useEffect(() => {
    refreshData();
  }, []);

  /**
   * Handle expense deletion
   */
  const handleDeleteExpense = () => {
    refreshData();
  };

  /**
   * Handle expense added
   */
  const handleExpenseAdded = () => {
    refreshData();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold">💰 Couples Expense Splitter</h1>
          <p className="text-blue-100 mt-2">Split expenses fairly and track who owes whom</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">Error: {error}</p>
            <button
              onClick={refreshData}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Row: Form and Balance Display */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Expense Form */}
              <div className="lg:col-span-1">
                <ExpenseForm users={users} onExpenseAdded={handleExpenseAdded} />
              </div>

              {/* Balance Display Grid */}
              <div className="lg:col-span-2">
                <BalanceDisplay balances={balances} users={users} />
              </div>
            </div>

            {/* Settlement Suggestions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <SettlementSuggestions settlements={settlements} />
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <ExpenseList
                expenses={expenses}
                users={users}
                onDelete={handleDeleteExpense}
              />
            </div>

            {/* Refresh Button */}
            <div className="flex justify-center">
              <button
                onClick={refreshData}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors"
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 mt-12 text-center">
        <p>Made with ❤️ for couples who split expenses</p>
      </footer>
    </main>
  );
}
