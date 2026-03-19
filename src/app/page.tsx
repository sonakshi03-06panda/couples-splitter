'use client';

import { useState, useEffect } from 'react';
import PixelArtBackground from '@/components/PixelArtBackground';
import ExpenseForm from '@/components/ExpenseForm';
import BalanceDisplay from '@/components/BalanceDisplay';
import SettlementSuggestions from '@/components/SettlementSuggestions';
import ExpenseList from '@/components/ExpenseList';
import { ParticleSystem } from '@/components/ParticleSystem';
import { useParticles, useSound } from '@/hooks/useParticles';
import { useDarkMode } from '@/hooks/useDarkMode';
import type { User, Expense, BalanceData, Settlement } from '@/types';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<BalanceData>({});
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  const { particles, burst } = useParticles();
  const { playSuccess, playDing } = useSound();
  const { isDarkMode, toggleDarkMode, isLoaded } = useDarkMode();

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
   * Handle expense added - trigger particles and sound
   */
  const handleExpenseAdded = (e?: React.MouseEvent) => {
    // Get button position for particles
    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;
    
    // Trigger gold sparkles
    burst(x, y, {
      type: 'sparkle',
      color: '#FFD700',
      count: 5,
      duration: 1000,
      spread: 'up',
    });
    
    // Play success sound
    playSuccess();
    
    refreshData();
  };

  /**
   * Handle settlement marked as paid - trigger particles and sound
   */
  const handleSettlementPaid = (x: number = window.innerWidth / 2, y: number = window.innerHeight / 2) => {
    // Trigger green checkmarks
    burst(x, y, {
      type: 'checkmark',
      color: '#A8D77B',
      count: 8,
      duration: 1500,
      spread: 'down',
    });
    
    // Play ding sound
    playDing();
  };

  return (
    <main className="min-h-screen bg-retro-cream relative">
      {/* Pixel Art Background */}
      <PixelArtBackground />

      {/* Particle System */}
      <ParticleSystem particles={particles} />

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Pixel Art Header */}
        <header className="pixel-header">
          <div className="pixel-header-content">
            {/* Left: Icon and Text */}
            <div className="pixel-header-left">
              <div className="pixel-header-icon">
                👥
              </div>
              <div className="pixel-header-text">
                <h1 className="pixel-header-title">💰 Expense Splitter</h1>
                <p className="pixel-header-subtitle">Split Expenses, Stay Friends! 💪</p>
              </div>
            </div>

            {/* Right: Settings Icon (optional) */}
            <div className="pixel-header-right">
              <button 
                onClick={toggleDarkMode}
                className="dark-mode-toggle" 
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                disabled={!isLoaded}
              >
                {isDarkMode ? '☀️ LIGHT' : '🌙 DARK'}
              </button>
              <button className="pixel-header-action" title="Settings">
                ⚙️
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-retro-soft-yellow border-2 border-retro-dark-brown text-retro-red-highlight rounded-lg font-medium">
            <p className="font-semibold">⚠️ Error: {error}</p>
            <button
              onClick={refreshData}
              className="mt-2 btn btn-primary btn-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-retro-red-highlight mb-4"></div>
            <p className="text-retro-dark-brown text-lg font-semibold">Loading...</p>
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
            <div className="bg-retro-beige rounded-lg shadow-md p-6 border-2 border-retro-dark-brown">
              <SettlementSuggestions settlements={settlements} onSettlementPaid={handleSettlementPaid} />
            </div>

            {/* Expenses Table */}
            <div className="bg-retro-beige rounded-lg shadow-md p-6 border-2 border-retro-dark-brown">
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
                className="btn btn-secondary btn-lg"
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>
        )}
        </div>

        {/* Footer */}
        <footer className="bg-retro-dark-brown text-retro-beige py-8 mt-12 text-center border-t-4 border-retro-light-brown">
          <p className="font-semibold">Made with ❤️ for couples who split expenses</p>
        </footer>
      </div>
    </main>
  );
}
