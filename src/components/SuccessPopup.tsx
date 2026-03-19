'use client';

import { useEffect, useState } from 'react';

interface SuccessPopupProps {
  message: string;
  icon?: string;
  duration?: number;
  onDismiss?: () => void;
}

/**
 * Retro game-style success notification popup
 * Appears in center of screen and auto-dismisses
 */
export function SuccessPopup({ message, icon = '✓', duration = 2000, onDismiss }: SuccessPopupProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDismissing(true);
      setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`success-popup ${isDismissing ? 'dismiss' : ''}`}>
      <span className="success-popup-icon">{icon}</span>
      <div className="success-popup-text">{message}</div>
    </div>
  );
}
