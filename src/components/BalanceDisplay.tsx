'use client';

import type { BalanceData, User } from '@/types';

interface BalanceDisplayProps {
  balances: BalanceData;
  users: User[];
}

export default function BalanceDisplay({ balances, users }: BalanceDisplayProps) {
  // Create a map for quick user lookup
  const userMap = new Map(users.map((u) => [u.id, u]));

  // Sort balances by user ID for consistent display order
  const sortedUserIds = Object.keys(balances)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Current Balances</h2>

      {sortedUserIds.length === 0 ? (
        <p className="text-gray-500">No balance data available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedUserIds.map((userId) => {
            const balance = balances[userId];
            const user = userMap.get(userId);

            if (!user) return null;

            const isOwed = balance > 0;
            const absoluteBalance = Math.abs(balance);
            const formattedBalance = `$${absoluteBalance.toFixed(2)}`;

            return (
              <div
                key={userId}
                className={`rounded-lg shadow-md p-4 ${
                  isOwed ? 'bg-green-100 border-2 border-green-400' : 'bg-red-100 border-2 border-red-400'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    {/* Color Dot */}
                    <span
                      className="inline-block w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: user.color }}
                    />
                    {/* User Name */}
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {user.name}
                    </h3>
                  </div>
                </div>

                {/* Balance Text */}
                <div
                  className={`text-2xl font-bold ${
                    isOwed ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {formattedBalance}
                </div>

                {/* Status Label */}
                <p
                  className={`text-sm mt-2 ${
                    isOwed ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isOwed ? '✓ Owed Money' : '✗ Owes Money'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
