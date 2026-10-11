import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#14231b", muted: "#69756c", faint: "#87928a" },
        forest: {
          DEFAULT: "#28583d",
          50: "#eff7f1", 100: "#dcefe0", 200: "#c1e2cc", 300: "#93cda8",
          400: "#5ea878", 500: "#36794f", 600: "#28583d", 700: "#214632",
          800: "#1b3828", 900: "#162e22",
        },
        mint: "#e1f3e6",
        paper: "#f7f8f5",
        line: "#e7ebe5",
        moss: {
          50: "#F2F5F2", 100: "#E1E9E1", 200: "#C2D3C2", 300: "#9EBA9E",
          400: "#648E64", 500: "#3D6043", 600: "#324F37", 700: "#263C2B",
          800: "#1B2A1E", 900: "#111A13",
        },
        clay: {
          50: "#FAF4F1", 100: "#F3E5DD", 200: "#E4C7B7", 300: "#D2A48E",
          400: "#BD7E61", 500: "#A45B3A", 600: "#8A482C", 700: "#6E3621",
          800: "#502616", 900: "#34180D",
        },
        burnt: {
          50: "#FCF3F0", 100: "#F7E2DB", 200: "#EFC1B3", 300: "#E49984",
          400: "#D56D4E", 500: "#C84B26", 600: "#AA391A", 700: "#872B13",
          800: "#621E0C", 900: "#3F1206",
        },
        bone: {
          50: "#FCFBF8", 100: "#F8F6F0", 200: "#F0ECE1",
          300: "#E5DFCF", 400: "#D6CEBC", 500: "#C2B7A0",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        soft: "0 12px 34px rgba(20, 35, 27, 0.08)",
        lift: "0 18px 50px rgba(20, 35, 27, 0.12)",
      },
      letterSpacing: { tighter: "-0.055em" },
    },
  },
  plugins: [],
};

export default config;
