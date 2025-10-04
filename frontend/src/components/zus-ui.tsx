import React from 'react';

export interface ZusCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'featured';
  className?: string;
  hoverable?: boolean;
}

export const ZusCard: React.FC<ZusCardProps> = ({ 
  children, 
  variant = 'default', 
  className = '', 
  hoverable = true 
}) => {
  const baseClasses = `zus-card ${hoverable ? '' : 'hover:transform-none hover:shadow-none'}`;
  const variantClasses = variant !== 'default' ? `zus-card-${variant}` : '';
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={{
        backgroundColor: `rgb(var(--color-card))`,
        color: `rgb(var(--color-text))`
      }}
    >
      {children}
    </div>
  );
};

export interface ZusCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ZusCardHeader: React.FC<ZusCardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`zus-card-header ${className}`}
      style={{
        color: `rgb(var(--color-text))`
      }}
    >
      {children}
    </div>
  );
};

export interface ZusCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ZusCardBody: React.FC<ZusCardBodyProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`zus-card-body ${className}`}
      style={{
        color: `rgb(var(--color-text))`
      }}
    >
      {children}
    </div>
  );
};

export interface ZusCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ZusCardFooter: React.FC<ZusCardFooterProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`zus-card-footer ${className}`}
      style={{
        color: `rgb(var(--color-text))`
      }}
    >
      {children}
    </div>
  );
};

export interface ZusButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'error';
  size?: 'small' | 'default' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const ZusButton: React.FC<ZusButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'default',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'zus-btn';
  const variantClasses = `zus-btn-${variant}`;
  const sizeClasses = size !== 'default' ? `zus-btn-${size}` : '';
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  
  // Scale-aware icon size
  const iconSize = size === 'small' ? '0.875rem' : '1rem';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
    >
      {loading && (
        <svg 
          className="animate-spin" 
          fill="none" 
          viewBox="0 0 24 24"
          style={{
            width: `calc(${iconSize} * var(--font-scale))`,
            height: `calc(${iconSize} * var(--font-scale))`
          }}
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      )}
      {children}
    </button>
  );
};

export interface ZusBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

export const ZusBadge: React.FC<ZusBadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  const baseClasses = 'zus-badge';
  const variantClasses = `zus-badge-${variant}`;
  
  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

export interface ZusAlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  className?: string;
}

export const ZusAlert: React.FC<ZusAlertProps> = ({ children, variant = 'info', title, className = '' }) => {
  const baseClasses = 'zus-alert';
  const variantClasses = `zus-alert-${variant}`;
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={{
        backgroundColor: `rgb(var(--color-card))`,
        color: `rgb(var(--color-text))`,
        borderColor: `rgb(var(--color-accent))`
      }}
    >
      {title && (
        <div 
          className="zus-alert-title"
          style={{
            color: `rgb(var(--color-text))`
          }}
        >
          {title}
        </div>
      )}
      <div style={{ color: `rgb(var(--color-text))` }}>
        {children}
      </div>
    </div>
  );
};

export interface ZusInputProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  hintAction?: { label: string; onClick?: (e: React.MouseEvent) => void; href?: string };
}

export const ZusInput: React.FC<ZusInputProps> = ({ 
  id,
  label, 
  placeholder, 
  value, 
  min,
  max,
  step,
  onChange, 
  onKeyDown,
  type = 'text',
  required = false,
  disabled = false,
  error,
  className = '',
  hintAction
}) => {
  return (
    <div className={`${className}`}>
      {label && (
        <label 
          htmlFor={id}
          className="zus-label"
          style={{
            color: `rgb(var(--color-text))`
          }}
        >
          {label}
          {required && (
            <span 
              className="ml-1"
              style={{ color: `rgb(var(--color-error, 240 94 94))` }}
            >
              *
            </span>
          )}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={onKeyDown}
        required={required}
        disabled={disabled}
        className={`zus-input ${error ? 'border-error' : ''}`}
        style={{
          backgroundColor: `rgb(var(--color-card))`,
          color: `rgb(var(--color-text))`,
          borderColor: error ? `rgb(var(--color-error, 240 94 94))` : `rgb(var(--color-accent))`
        }}
      />
      {hintAction && (
        <a
          href={hintAction.href ?? "#"}
          className="block mt-1 text-sm"
          style={{ 
            color: `rgb(var(--color-accent))`,
            fontSize: `calc(0.8125rem * var(--font-scale))`
          }}
          onClick={(e) => {
            if (!hintAction.href) e.preventDefault();
            hintAction.onClick?.(e);
          }}
        >
          {hintAction.label}
        </a>
      )}
      {error && (
        <p 
          className="zus-text-small mt-1"
          style={{ 
            color: `rgb(var(--color-error, 240 94 94))`
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export interface ZusSelectProps {
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const ZusSelect: React.FC<ZusSelectProps> = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder,
  required = false,
  disabled = false,
  error,
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      {label && (
        <label 
          className="zus-label"
          style={{
            color: `rgb(var(--color-text))`
          }}
        >
          {label}
          {required && (
            <span 
              className="ml-1"
              style={{ color: `rgb(var(--color-error, 240 94 94))` }}
            >
              *
            </span>
          )}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        className={`zus-select ${error ? 'border-error' : ''}`}
        style={{
          backgroundColor: `rgb(var(--color-card))`,
          color: `rgb(var(--color-text))`,
          borderColor: error ? `rgb(var(--color-error, 240 94 94))` : `rgb(var(--color-accent))`
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p 
          className="zus-text-small mt-1"
          style={{ 
            color: `rgb(var(--color-error, 240 94 94))`
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};


// Typography Components
export interface ZusHeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
}

export const ZusHeading: React.FC<ZusHeadingProps> = ({ children, level = 1, className = '' }) => {
  const classes = `zus-text-h${level} ${className}`;
  const headingStyle = {
    color: `rgb(var(--color-text))`
  };
  
  switch (level) {
    case 1:
      return <h1 className={classes} style={headingStyle}>{children}</h1>;
    case 2:
      return <h2 className={classes} style={headingStyle}>{children}</h2>;
    case 3:
      return <h3 className={classes} style={headingStyle}>{children}</h3>;
    case 4:
      return <h4 className={classes} style={headingStyle}>{children}</h4>;
    default:
      return <h1 className={classes} style={headingStyle}>{children}</h1>;
  }
};

export interface ZusTextProps {
  children: React.ReactNode;
  variant?: 'display' | 'body' | 'body-large' | 'small' | 'caption' | 'lead';
  className?: string;
}

export const ZusText: React.FC<ZusTextProps> = ({ children, variant = 'body', className = '' }) => {
  const classes = `zus-text-${variant} ${className}`;
  const textStyle = {
    color: `rgb(var(--color-text))`
  };
  
  return <p className={classes} style={textStyle}>{children}</p>;
};
