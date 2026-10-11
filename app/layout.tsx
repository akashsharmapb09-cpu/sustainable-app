import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], display: "swap", variable: "--font-fraunces" });

export const metadata: Metadata = {
  metadataBase: new URL("https://sustainable-app-qccf.vercel.app"),
  title: { default: "GreenSwap — Small swaps. Real impact.", template: "%s · GreenSwap" },
  description: "Discover thoughtful everyday swaps, track your impact, and make sustainable living feel natural.",
  applicationName: "GreenSwap",
  openGraph: {
    type: "website",
    title: "GreenSwap — Small swaps. Real impact.",
    description: "A more considered way to live lighter.",
    siteName: "GreenSwap",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "GreenSwap — a lighter footprint, one good choice at a time" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GreenSwap — Small swaps. Real impact.",
    description: "A more considered way to live lighter.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f8f5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable + " " + fraunces.variable}>
      <body>{children}</body>
    </html>
  );
}
