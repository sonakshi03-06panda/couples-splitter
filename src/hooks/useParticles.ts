'use client';

import { useState, useCallback } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  type: 'star' | 'square' | 'checkmark' | 'sparkle';
  color: string;
  delay: number;
  duration: number;
}

interface UseParticlesReturn {
  particles: Particle[];
  burst: (x: number, y: number, options?: ParticleOptions) => void;
  clear: () => void;
}

interface ParticleOptions {
  type?: 'star' | 'square' | 'checkmark' | 'sparkle';
  color?: string;
  count?: number;
  duration?: number;
  spread?: 'up' | 'down' | 'all' | 'random';
}

/**
 * Hook to manage particle bursts/effects
 * Creates temporary particles that animate and disappear
 */
export function useParticles(): UseParticlesReturn {
  const [particles, setParticles] = useState<Particle[]>([]);

  const burst = useCallback(
    (x: number, y: number, options: ParticleOptions = {}) => {
      const {
        type = 'sparkle',
        color = '#FFD700',
        count = 5,
        duration = 1000,
        spread = 'up',
      } = options;

      const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => ({
        id: `particle-${Date.now()}-${i}`,
        x,
        y,
        type,
        color,
        delay: i * 50,
        duration,
      }));

      setParticles((prev) => [...prev, ...newParticles]);

      // Remove particles after animation completes
      const maxDelay = newParticles[newParticles.length - 1].delay;
      const removeTimer = setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.some((np) => np.id === p.id))
        );
      }, maxDelay + duration + 100);

      return () => clearTimeout(removeTimer);
    },
    []
  );

  const clear = useCallback(() => {
    setParticles([]);
  }, []);

  return { particles, burst, clear };
}

/**
 * Hook to play optional sound effects
 */
export function useSound() {
  const playDing = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioContext.currentTime;

      // Create a simple "ding" sound using oscillators
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Two frequencies for a more musical "ding"
      osc1.frequency.value = 800;
      osc2.frequency.value = 600;
      osc1.type = 'sine';
      osc2.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } catch (e) {
      // Silently fail if audio context not available
    }
  }, []);

  const playSuccess = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioContext.currentTime;

      // Create ascending tones for success
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 chord
      const oscillators = frequencies.map((freq) => {
        const osc = audioContext.createOscillator();
        osc.frequency.value = freq;
        osc.type = 'sine';
        return osc;
      });

      const gainNode = audioContext.createGain();
      oscillators.forEach((osc) => osc.connect(gainNode));
      gainNode.connect(audioContext.destination);

      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      oscillators.forEach((osc) => {
        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch (e) {
      // Silently fail
    }
  }, []);

  return { playDing, playSuccess };
}
