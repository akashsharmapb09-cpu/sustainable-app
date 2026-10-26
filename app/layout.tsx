import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'GreenSwap — Make a lighter footprint. Keep the good life.',
  description: 'Practical sustainable swaps backed by published environmental data. Find everyday changes that fit your budget, routine and real life.',
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* Preload hero LCP image to eliminate render chain delay */}
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80"
          fetchPriority="high"
        />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-[#F5F0E8] text-[#1B211E]">
        {/* Accessible Skip to Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#162A20] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3EAC6A]"
        >
          Skip to content
        </a>
        {/* Document Main Landmark */}
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
