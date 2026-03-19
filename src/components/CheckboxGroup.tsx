import { ReactNode } from 'react';

interface CheckboxGroupProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function CheckboxGroup({ title, children, className = '' }: CheckboxGroupProps) {
  return (
    <div className={`checkbox-group ${className}`}>
      {title && <div className="checkbox-group-title">{title}</div>}
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
