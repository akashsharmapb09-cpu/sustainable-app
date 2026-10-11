import type { HTMLAttributes, TableHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function TableWrap({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('w-full overflow-x-auto rounded-2xl border border-line bg-white', className)} {...props} />; }
export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) { return <table className={cn('w-full border-collapse text-left text-sm', className)} {...props} />; }
export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) { return <thead className={cn('bg-paper text-[11px] uppercase tracking-[.12em] text-muted', className)} {...props} />; }
export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) { return <tbody className={cn('divide-y divide-line', className)} {...props} />; }
export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) { return <tr className={cn('transition hover:bg-paper/80', className)} {...props} />; }
export function TableCell({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) { return <td className={cn('px-4 py-4 align-middle', className)} {...props} />; }
