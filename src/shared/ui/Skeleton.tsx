import React from 'react';
import { cn } from '../lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-sm bg-surface-muted/80 dark:bg-surface-subtle/60',
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded border border-border bg-surface p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="pt-4 border-t border-border flex justify-between items-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="rounded border border-border bg-surface p-5 space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}
