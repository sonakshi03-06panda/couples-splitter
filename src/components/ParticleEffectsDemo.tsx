'use client';

/**
 * Example component showing particle effects in action
 * This is for reference and testing purposes
 */

import { useState } from 'react';
import { useParticles, useSound } from '@/hooks/useParticles';
import { ParticleSystem } from '@/components/ParticleSystem';

export function ParticleEffectsDemo() {
  const { particles, burst } = useParticles();
  const { playSuccess, playDing } = useSound();

  const handleGoldSparkles = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
      type: 'sparkle',
      color: '#FFD700',
      count: 5,
      duration: 1000,
      spread: 'up',
    });
    playSuccess();
  };

  const handleGreenCheckmarks = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
      type: 'checkmark',
      color: '#A8D77B',
      count: 8,
      duration: 1500,
      spread: 'down',
    });
    playDing();
  };

  const handleStarBurst = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
      type: 'star',
      color: '#FFD700',
      count: 6,
      duration: 1200,
      spread: 'up',
    });
    playSuccess();
  };

  const handleSquareConfetti = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
      type: 'square',
      color: '#87CEEB',
      count: 10,
      duration: 1500,
      spread: 'down',
    });
    playDing();
  };

  return (
    <div>
      <ParticleSystem particles={particles} />
      
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>✨ Particle Effects Demo</h1>

        <section style={{ marginBottom: '2rem' }}>
          <h2>Expense Added - Gold Sparkles</h2>
          <p>When an expense is successfully added, gold sparkles float upward</p>
          <button 
            onClick={handleGoldSparkles}
            className="rpg-submit-button"
          >
            💰 Try Gold Sparkles
          </button>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2>Settlement Paid - Green Checkmarks</h2>
          <p>When a settlement is marked as paid, green checkmarks fall down</p>
          <button 
            onClick={handleGreenCheckmarks}
            className="rpg-submit-button"
          >
            ✓ Try Green Checkmarks
          </button>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2>Stars Burst Effect</h2>
          <p>Alternative particle type: golden stars</p>
          <button 
            onClick={handleStarBurst}
            className="rpg-submit-button"
          >
            ⭐ Try Star Burst
          </button>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2>Square Confetti</h2>
          <p>Alternative particle type: blue square confetti</p>
          <button 
            onClick={handleSquareConfetti}
            className="rpg-submit-button"
          >
            📦 Try Square Confetti
          </button>
        </section>
      </div>
    </div>
  );
}
