import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-muted', className)}>{children}</span>;
}
