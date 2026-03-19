import { useEffect, useRef, useState } from 'react';

/**
 * Hook to animate a number counting up from 0 to a target value
 * @param targetValue - The final value to count to
 * @param duration - Duration of animation in milliseconds (default: 1000ms)
 * @param isActive - Whether to trigger the animation (default: true)
 * @returns The current animated value
 */
export function useCounterAnimation(targetValue: number, duration: number = 1000, isActive: boolean = true) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      setDisplayValue(targetValue);
      return;
    }

    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    startTimeRef.current = Date.now();

    const animate = () => {
      if (!startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth animation
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeProgress * targetValue);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = setTimeout(animate, 16); // ~60fps
      } else {
        setDisplayValue(targetValue);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [targetValue, duration, isActive]);

  return displayValue;
}

/**
 * Hook to trigger an animation pulse when a value changes
 * @param value - The value to watch for changes
 * @returns Boolean indicating if animation should be active
 */
export function useAnimateOnChange(value: any) {
  const [animate, setAnimate] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      setAnimate(true);
      prevValueRef.current = value;

      const timer = setTimeout(() => {
        setAnimate(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [value]);

  return animate;
}
