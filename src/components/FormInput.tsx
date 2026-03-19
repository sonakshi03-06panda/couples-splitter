import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  helperText?: string;
}

export default function FormInput({
  label,
  error,
  icon,
  helperText,
  className = '',
  id,
  ...inputProps
}: FormInputProps) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="form-group">
      {label && <label htmlFor={inputId}>{label}</label>}

      {icon ? (
        <div className="input-with-icon">
          <span className="input-icon">{icon}</span>
          <input id={inputId} {...inputProps} />
        </div>
      ) : (
        <input id={inputId} className={className} {...inputProps} />
      )}

      {error && <div className="form-error">{error}</div>}
      {helperText && !error && <div className="form-error" style={{ color: '#8B7355' }}>{helperText}</div>}
    </div>
  );
}
