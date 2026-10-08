import React from 'react';
import { cn } from '../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'moss' | 'clay' | 'burnt' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center font-mono uppercase tracking-wider rounded-sm select-none border transition-colors';

  const variants = {
    default: 'bg-surface-muted border-border text-foreground',
    moss: 'bg-moss-50 border-moss-300 text-moss-700 dark:bg-moss-900/40 dark:border-moss-700 dark:text-moss-300',
    clay: 'bg-clay-50 border-clay-300 text-clay-700 dark:bg-clay-900/40 dark:border-clay-700 dark:text-clay-300',
    burnt: 'bg-burnt-50 border-burnt-300 text-burnt-700 dark:bg-burnt-900/40 dark:border-burnt-700 dark:text-burnt-300',
    outline: 'bg-transparent border-border text-ink-muted',
    subtle: 'bg-surface-subtle border-transparent text-ink-muted',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 leading-none',
    md: 'text-xs px-2 py-0.5 leading-tight',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
