import React from 'react';
import { cn } from '../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  taxonomyCode?: string;
  badge?: React.ReactNode;
}

export function Card({ className, taxonomyCode, badge, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded border border-border bg-surface text-foreground transition-colors duration-150',
        className
      )}
      {...props}
    >
      {(taxonomyCode || badge) && (
        <div className="flex items-center justify-between border-b border-border px-5 py-2.5 bg-surface-muted/50">
          {taxonomyCode && (
            <span className="taxonomy-label select-none">{taxonomyCode}</span>
          )}
          {badge && <div>{badge}</div>}
        </div>
      )}
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4 space-y-1', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-serif text-xl font-semibold tracking-tight text-foreground', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-ink-muted leading-relaxed font-sans', className)} {...props}>
      {children}
    </p>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-5 pt-4 border-t border-border flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}
