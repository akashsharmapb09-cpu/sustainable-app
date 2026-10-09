import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard utility for safely merging conditional Tailwind classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats an emission or cost range cleanly with honest bounds
 */
export function formatRange(low: number, high: number, unit: string): string {
  if (Math.abs(low - high) < 0.05) {
    return `${low.toFixed(1)} ${unit}`;
  }
  return `${low.toFixed(1)} – ${high.toFixed(1)} ${unit}`;
}

/**
 * Formats currency (default INR, supports USD/EUR)
 */
export function formatCurrency(
  amount: number,
  currency: 'INR' | 'USD' | 'EUR' = 'INR',
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function safeHttpsUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}
