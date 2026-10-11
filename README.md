# GreenSwap · Next.js App Router

GreenSwap is a responsive sustainable-swaps discovery experience built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Radix UI primitives and Lucide icons.

## Run locally

Requirements: Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

## Release checks

```sh
npm run typecheck
npm run qa:links
npm run lint
npm run build
npx playwright install chromium
npm run qa:browser
```

The GitHub Actions workflow runs these checks for changes on the Next.js feature branch and main. Browser QA opens public and dashboard routes at 320px, 393px, 768px and 1440px; it also checks that dashboard routes redirect without a demo session, that the required FAQ content renders, that loaded images are not broken, and that pages have no document-level horizontal overflow.

## Demo and security notes

Dashboard access uses a short-lived mock `greenswap_demo` cookie set by the demo login page. This is a UI prototype, not production authentication. Replace it with a verified identity provider, signed/validated sessions and server-side authorization before exposing private user data. Sample activity and points are stored in a separate demo cookie and are not persisted to a backend. The newsletter, Pro checkout, notifications and partner reward redemption are not connected.

The `app/(legal)/[slug]` pages are legal templates with sample copy. Have qualified counsel review them and replace company details and any sample estimates before commercial launch. Impact and points values are illustrative, not audited measurements.

## Deploy on Vercel

Use the Next.js framework preset and repository root as the project root. The legacy Vite app is retained in `src/` during this migration, but the Vercel project should build this App Router application using `npm run build`. Do not deploy the mock cookie as the security boundary for real account data.
