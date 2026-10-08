import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic color system tied to CSS variables
        background: 'var(--color-bg)',
        foreground: 'var(--color-ink)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
          subtle: 'var(--color-surface-subtle)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        ink: {
          DEFAULT: 'var(--color-ink)',
          muted: 'var(--color-ink-muted)',
          faint: 'var(--color-ink-faint)',
        },
        moss: {
          50: '#F2F5F2',
          100: '#E1E9E1',
          200: '#C2D3C2',
          300: '#9EBA9E',
          400: '#648E64',
          500: '#3D6043', // Signature Moss
          600: '#324F37',
          700: '#263C2B',
          800: '#1B2A1E',
          900: '#111A13',
          DEFAULT: 'var(--color-moss)',
        },
        clay: {
          50: '#FAF4F1',
          100: '#F3E5DD',
          200: '#E4C7B7',
          300: '#D2A48E',
          400: '#BD7E61',
          500: '#A45B3A', // Signature Clay
          600: '#8A482C',
          700: '#6E3621',
          800: '#502616',
          900: '#34180D',
          DEFAULT: 'var(--color-clay)',
        },
        burnt: {
          50: '#FCF3F0',
          100: '#F7E2DB',
          200: '#EFC1B3',
          300: '#E49984',
          400: '#D56D4E',
          500: '#C84B26', // Signature Burnt Orange Accent
          600: '#AA391A',
          700: '#872B13',
          800: '#621E0C',
          900: '#3F1206',
          DEFAULT: 'var(--color-burnt)',
        },
        bone: {
          50: '#FCFBF8',
          100: '#F8F6F0', // Light background
          200: '#F0ECE1',
          300: '#E5DFCFC',
          400: '#D6CEBC',
          500: '#C2B7A0',
          DEFAULT: 'var(--color-bone)',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Newsreader', 'Georgia', 'serif'],
        sans: ['DM Sans', 'Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        18: '72px',
        30: '120px',
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight: '-0.02em',
        normal: '0em',
        wide: '0.03em',
        wider: '0.06em',
        widest: '0.12em',
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(28, 32, 28, 0.05)',
        card: '0 2px 4px 0 rgba(28, 32, 28, 0.06), 0 1px 2px 0 rgba(28, 32, 28, 0.04)',
        elevation: '0 8px 16px -2px rgba(28, 32, 28, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
