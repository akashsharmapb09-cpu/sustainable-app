# GreenSwap · Next.js App Router

GreenSwap is a responsive sustainable-swaps discovery experience built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons.

## Run locally

- Node.js 20.9 or newer
- `npm install`
- `npm run dev`

## Build

- `npm run typecheck`
- `npm run build`

## Demo and security notes

Dashboard access uses a mock `greenswap_demo` cookie set by the demo login page. This is only a UI prototype, not production authentication. Replace it with a verified auth provider and server-side session validation before exposing private user data. Swap catalogues, activity, points, and settings are sample data/state; they are not persisted to Convex in this frontend migration. The newsletter form is a visual demo and does not subscribe an email.

The `app/(legal)/[slug]` pages are legal templates with sample copy. Have qualified counsel review them and replace all sample estimates and company details before launch.

## Deploy on Vercel

Import the repository and use the Next.js framework preset with the repository root as the project root. Configure production environment variables only after a real backend/auth implementation is connected. Do not deploy a mock cookie as the security boundary for real account data.
