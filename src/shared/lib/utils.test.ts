import { describe, it, expect } from 'vitest';
import { cn, formatRange, formatCurrency, safeHttpsUrl } from './utils';
import { PALETTE, SPACING_SCALE } from '../config/tokens';

describe('Shared Utilities and Tokens', () => {
  it('combines classes properly using cn()', () => {
    const isPrimary = true;
    const isHidden = false;
    expect(cn('font-serif', isPrimary && 'text-ink', isHidden && 'hidden')).toBe('font-serif text-ink');
  });

  it('formats ranges honestly with confidence intervals', () => {
    expect(formatRange(12.5, 18.2, 'kg CO2e')).toBe('12.5 – 18.2 kg CO2e');
    expect(formatRange(10.0, 10.0, 'kg CO2e')).toBe('10.0 kg CO2e');
  });

  it('formats currency with locale defaults', () => {
    const formatted = formatCurrency(1250, 'INR', 'en-IN');
    expect(formatted).toContain('1,250');
  });

  it('only allows valid HTTPS URLs for external source links', () => {
    expect(safeHttpsUrl('https://example.org/source')).toBe('https://example.org/source');
    expect(safeHttpsUrl('http://example.org/source')).toBeNull();
    expect(safeHttpsUrl('javascript:alert(1)')).toBeNull();
    expect(safeHttpsUrl('not a url')).toBeNull();
    expect(safeHttpsUrl(null)).toBeNull();
  });

  it('contains valid design token palette and spacing scale', () => {
    expect(PALETTE.bone.bgLight).toBe('#F8F6F0');
    expect(PALETTE.moss.primary).toBe('#33593A');
    expect(PALETTE.burntOrange.accent).toBe('#C84B26');
    expect(SPACING_SCALE).toContain(16);
    expect(SPACING_SCALE).toContain(120);
  });
});
