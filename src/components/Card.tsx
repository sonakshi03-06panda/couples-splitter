import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'info' | 'warning' | 'danger';
  size?: 'compact' | 'normal' | 'thick';
  interactive?: boolean;
  inset?: boolean;
  className?: string;
}

export default function Card({
  children,
  variant = 'default',
  size = 'normal',
  interactive = false,
  inset = false,
  className = '',
}: CardProps) {
  const baseClasses = ['card'];

  // Add variant classes
  if (variant !== 'default') {
    baseClasses.push(`card-${variant}`);
  }

  // Add size classes
  if (size === 'compact') {
    baseClasses.push('card-compact');
  } else if (size === 'thick') {
    baseClasses.push('card-thick');
  }

  // Add interactive class
  if (interactive) {
    baseClasses.push('card-interactive');
  }

  // Add inset effect
  if (inset) {
    baseClasses.push('card-inset');
  }

  const finalClassName = [baseClasses.join(' '), className].filter(Boolean).join(' ');

  return <div className={finalClassName}>{children}</div>;
}
