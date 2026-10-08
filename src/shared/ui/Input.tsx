import React, { forwardRef } from 'react';
import { cn } from '../lib/utils';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  unitSuffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, unitSuffix, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-mono text-ink-muted">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            className={cn(
              'w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-ink-faint focus:border-burnt focus:outline-none focus:ring-1 focus:ring-burnt disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
              unitSuffix && 'pr-14',
              error && 'border-burnt focus:border-burnt focus:ring-burnt',
              className
            )}
            {...props}
          />
          {unitSuffix && (
            <span className="absolute right-3 text-xs font-mono text-ink-muted pointer-events-none select-none">
              {unitSuffix}
            </span>
          )}
        </div>
        {error ? (
          <p className="flex items-center gap-1 text-xs text-burnt font-sans" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p className="text-xs text-ink-muted font-sans">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options?: Array<{ label: string; value: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, hint, error, options, children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-mono text-ink-muted">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          aria-invalid={!!error}
          className={cn(
            'w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-burnt focus:outline-none focus:ring-1 focus:ring-burnt disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error && 'border-burnt focus:border-burnt',
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error ? (
          <p className="flex items-center gap-1 text-xs text-burnt font-sans" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p className="text-xs text-ink-muted font-sans">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
