import { SelectHTMLAttributes, ReactNode } from 'react';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
  helperText?: string;
}

export default function FormSelect({
  label,
  error,
  helperText,
  className = '',
  id,
  children,
  ...selectProps
}: FormSelectProps) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="form-group">
      {label && <label htmlFor={selectId}>{label}</label>}

      <select id={selectId} className={className} {...selectProps}>
        {children}
      </select>

      {error && <div className="form-error">{error}</div>}
      {helperText && !error && <div className="form-error" style={{ color: '#8B7355' }}>{helperText}</div>}
    </div>
  );
}
