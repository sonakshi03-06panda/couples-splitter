import { InputHTMLAttributes, ReactNode } from 'react';

interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export default function FormCheckbox({
  label,
  icon,
  id,
  className = '',
  ...inputProps
}: FormCheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div>
      <label htmlFor={checkboxId} className="checkbox-label">
        <input
          id={checkboxId}
          type="checkbox"
          className={`checkbox-input ${className}`}
          {...inputProps}
        />
        <div className="checkbox-box" />
        <span className="flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {label}
        </span>
      </label>
    </div>
  );
}
