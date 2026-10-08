/**
 * GreenSwap Design Tokens (Editorial Botanical System)
 * 
 * Rules:
 * - 5 core colors max (Bone, Ink, Moss, Clay, Burnt Orange)
 * - Contrast AA compliant across all paired token applications
 * - Strict spacing scale (4, 8, 12, 16, 24, 32, 48, 72, 120)
 */

export const PALETTE = {
  bone: {
    bgLight: '#F8F6F0',
    cardLight: '#FCFAF6',
    borderLight: '#DFD7CA',
  },
  ink: {
    textLight: '#1B211E',
    mutedLight: '#535C55',
    faintLight: '#848E86',
    textDark: '#EDEAE1',
    mutedDark: '#9BA59C',
    faintDark: '#636D65',
    bgDark: '#131614',
    cardDark: '#1B201D',
    borderDark: '#2B332D',
  },
  moss: {
    primary: '#33593A', // Botanical green
    light: '#E1E9E1',
    dark: '#4C7D55',
  },
  clay: {
    primary: '#A35A38', // Terracotta
    light: '#F3E5DD',
    dark: '#BD6F4C',
  },
  burntOrange: {
    accent: '#C84B26', // Sharp focal highlight
    dark: '#D65C35',
  },
} as const;

export const TYPOGRAPHY = {
  headings: 'Fraunces, Georgia, serif',
  body: 'DM Sans, -apple-system, BlinkMacSystemFont, sans-serif',
  data: 'JetBrains Mono, Menlo, monospace',
} as const;

export const SPACING_SCALE = [4, 8, 12, 16, 24, 32, 48, 72, 120] as const;

export const SIGNATURE_DETAILS = {
  catalogIndexing: 'Every module bears an archival taxonomy code (e.g. SEC.01 / ACT-TRNS)',
  paperGrain: '3.5% procedural SVG fractal turbulence paper grain overlay',
  honestRanges: 'Carbon and cost metrics formatted strictly with confidence bounds [low, high]',
} as const;
