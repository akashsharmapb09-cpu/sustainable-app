import React, { forwardRef } from 'react';
import { cn } from '../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-mono font-medium rounded transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burnt focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:translate-y-[1px] select-none';

    const variants = {
      primary:
        'bg-ink text-bone-100 hover:bg-ink/90 border border-ink shadow-subtle dark:bg-bone-100 dark:text-ink dark:hover:bg-bone-200',
      secondary:
        'bg-surface-muted text-foreground hover:bg-surface-subtle border border-border shadow-subtle',
      accent:
        'bg-burnt text-bone-100 hover:bg-burnt/90 border border-burnt shadow-subtle',
      outline:
        'bg-transparent text-foreground hover:bg-surface-muted border border-border hover:border-ink-muted',
      ghost:
        'bg-transparent text-ink-muted hover:text-foreground hover:bg-surface-muted border border-transparent',
      destructive:
        'bg-burnt text-bone-100 hover:bg-burnt/90 border border-burnt shadow-subtle',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1 gap-1.5 h-7',
      md: 'text-xs px-3.5 py-1.5 gap-2 h-9',
      lg: 'text-sm px-5 py-2.5 gap-2.5 h-11',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
