'use client';

import type { Settlement } from '@/types';
import { useState, useEffect } from 'react';

interface SettlementSuggestionsProps {
  settlements: Settlement[];
  onSettlementPaid?: (x: number, y: number) => void;
}

export default function SettlementSuggestions({ settlements, onSettlementPaid }: SettlementSuggestionsProps) {
  const [paidSettlements, setPaidSettlements] = useState<Set<number>>(new Set());
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const [confettiStars, setConfettiStars] = useState<{ id: string; left: number; delay: number }[]>([]);

  // Check if all settlements are marked as paid
  const allSettled = settlements.length > 0 && paidSettlements.size === settlements.length;

  // Mark a settlement as paid
  const handleMarkPaid = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    
    const newPaid = new Set(paidSettlements);
    newPaid.add(index);
    setPaidSettlements(newPaid);

    // Show celebration message
    setCelebrationMessage('✓ PAID!');
    setTimeout(() => setCelebrationMessage(null), 600);

    // Trigger particle effect with button position
    if (onSettlementPaid) {
      const button = e.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      onSettlementPaid(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    // Trigger confetti if all settled
    if (newPaid.size === settlements.length) {
      triggerConfetti();
    }
  };

  // Undo marking a settlement as paid
  const handleUndo = (index: number) => {
    const newPaid = new Set(paidSettlements);
    newPaid.delete(index);
    setPaidSettlements(newPaid);
  };

  // Trigger confetti animation
  const triggerConfetti = () => {
    const stars = Array.from({ length: 12 }).map((_, i) => ({
      id: `star-${Date.now()}-${i}`,
      left: Math.random() * 100,
      delay: i * 50,
    }));
    setConfettiStars(stars);

    // Clear confetti after animation
    setTimeout(() => setConfettiStars([]), 3000);
  };

  // Reset when settlements change
  useEffect(() => {
    setPaidSettlements(new Set());
  }, [settlements]);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-retro-dark-brown">🤝 Settlement Suggestions</h2>

      <div className="settlement-display-container">
        {settlements.length === 0 ? (
          <div className="balance-empty-state">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
            <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Everyone is settled!</p>
            <p style={{ fontSize: '0.875rem' }}>All expenses are balanced</p>
          </div>
        ) : allSettled ? (
          <div className="all-settled-container">
            <div className="all-settled-card">
              <div className="all-settled-message">EVERYONE SETTLED!</div>
              <div className="all-settled-subtext">Time to celebrate! 🎉</div>
            </div>
          </div>
        ) : (
          <div className="settlement-grid">
            {settlements.map((settlement, index) => {
              const isPaid = paidSettlements.has(index);

              return (
                <div
                  key={index}
                  className={`settlement-card ${isPaid ? 'settled' : ''}`}
                  style={{ pointerEvents: isPaid ? 'none' : 'auto' }}
                >
                  {/* Settlement Flow: FROM → AMOUNT → TO */}
                  <div className="settlement-flow">
                    {/* FROM Person */}
                    <div className="settlement-person">
                      <div
                        className="settlement-avatar"
                        style={{
                          backgroundColor: `hsl(${settlement.names.from.charCodeAt(0) * 3}, 70%, 80%)`,
                        }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>
                          {settlement.names.from.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="settlement-person-name">{settlement.names.from}</div>
                    </div>

                    {/* Arrow */}
                    <div className="settlement-flow-arrow">→</div>

                    {/* Amount Display */}
                    <div className="settlement-amount-display">
                      <div className="settlement-amount">${settlement.amount.toFixed(2)}</div>
                    </div>

                    {/* Arrow */}
                    <div className="settlement-flow-arrow">→</div>

                    {/* TO Person */}
                    <div className="settlement-person">
                      <div
                        className="settlement-avatar"
                        style={{
                          backgroundColor: `hsl(${settlement.names.to.charCodeAt(0) * 3}, 70%, 80%)`,
                        }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>
                          {settlement.names.to.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="settlement-person-name">{settlement.names.to}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="settlement-actions">
                    <button
                      className="settlement-btn settlement-btn-paid"
                      onClick={(e) => handleMarkPaid(index, e)}
                      disabled={isPaid}
                    >
                      ✓ Mark Paid
                    </button>
                    {isPaid && (
                      <button
                        className="settlement-btn settlement-btn-undo"
                        onClick={() => handleUndo(index)}
                      >
                        ↶ Undo
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Celebration Messages */}
      {celebrationMessage && (
        <div className="settlement-paid-celebration">{celebrationMessage}</div>
      )}

      {/* Confetti Stars */}
      {confettiStars.map((star) => (
        <div
          key={star.id}
          className="confetti-star"
          style={{
            left: `${star.left}%`,
            top: '0',
            animationDelay: `${star.delay}ms`,
          }}
        >
          ★
        </div>
      ))}
    </div>
  );
}
