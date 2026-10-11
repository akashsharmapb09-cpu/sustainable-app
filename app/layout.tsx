import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://sustainablelifestyle.com'),
  title: { default: 'GreenSwap — Make a lighter footprint. Keep the good life.', template: '%s | GreenSwap' },
  description: 'Practical sustainable swaps for travel, food, energy, waste and shopping. Make a lighter footprint and keep the good life.',
  applicationName: 'GreenSwap',
  openGraph: {
    type: 'website', siteName: 'GreenSwap',
    title: 'Make a lighter footprint. Keep the good life.',
    description: 'Practical swaps backed by DEFRA, CEA, EPA data.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GreenSwap — 0.7t saved, illustrative example, not a personal result' }],
  },
  twitter: { card: 'summary_large_image', title: 'Make a lighter footprint. Keep the good life.', description: 'Practical swaps backed by DEFRA, CEA, EPA data.', images: ['/og-image.png'] },
  icons: { icon: '/favicon.svg', apple: '/icon-192.svg' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#fbfaf6' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={geist.variable + ' ' + geistMono.variable}><body className="min-h-screen bg-paper font-sans text-ink antialiased">{children}</body></html>;
}
