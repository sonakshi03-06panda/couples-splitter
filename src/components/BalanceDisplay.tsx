'use client';

import type { BalanceData, User } from '@/types';
import { useCounterAnimation, useAnimateOnChange } from '@/hooks/useCounterAnimation';

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
    <div className="balance-display-container">
      <h2 className="text-2xl font-bold mb-6 text-retro-dark-brown">💵 Current Balances</h2>

      {sortedUserIds.length === 0 ? (
        <div className="balance-empty-state">
          <p>No balance data available</p>
        </div>
      ) : (
        <div className="balance-grid">
          {sortedUserIds.map((userId) => {
            const balance = balances[userId];
            const user = userMap.get(userId);
            const isOwed = balance > 0;
            const absoluteBalance = Math.abs(balance);
            
            // Use counter animation for the amount
            const animatedAmount = useCounterAnimation(absoluteBalance, 1000);
            const shouldAnimate = useAnimateOnChange(balance);

            if (!user) return null;

            const formattedBalance = `$${animatedAmount.toFixed(2)}`;

            return (
              <div key={userId} className="balance-card game-card-hover">
                {/* Header: Avatar + Name */}
                <div className="balance-card-header">
                  <div
                    className="balance-card-avatar"
                    style={{ backgroundColor: user.color }}
                    title={user.name}
                  />
                  <h3 className="balance-card-name">{user.name}</h3>
                </div>

                {/* Amount - VERY LARGE with animation */}
                <div 
                  className={`balance-card-amount ${isOwed ? 'owed' : 'owes'} counter-number ${shouldAnimate ? 'animating' : ''}`}
                >
                  {formattedBalance}
                </div>

                {/* Status Label with Icon */}
                <div className="balance-card-status">
                  <span className="balance-card-status-icon">
                    {isOwed ? '✅' : '⚠️'}
                  </span>
                  <span className="balance-card-status-label">
                    {isOwed ? 'Is Owed' : 'Owes'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
