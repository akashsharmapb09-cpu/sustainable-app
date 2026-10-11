import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17241b',
        moss: '#315c3d',
        'moss-dark': '#173b29',
        paper: '#fbfaf6',
        clay: '#b95736',
        line: '#e9e8e1',
        muted: '#68736a',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(23, 36, 27, .08)',
        card: '0 4px 18px rgba(23, 36, 27, .05)',
      },
      borderRadius: { '4xl': '2rem' },
      letterSpacing: { editorial: '-.055em' },
    },
  },
  plugins: [],
};

export default config;
