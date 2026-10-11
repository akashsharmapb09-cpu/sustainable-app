# GreenSwap

**Production site:** https://sustainable-app-qccf.vercel.app  
**Framework:** Next.js App Router · React · TypeScript · Tailwind CSS · Framer Motion · Vercel

GreenSwap is an evidence-aware field guide for practical sustainable swaps. The interface is designed to help people explore alternatives, save ideas and understand that environmental estimates depend on sources, geography and assumptions.

## Local development

Requirements: Node.js 22+ and pnpm 10.

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Quality checks

```sh
pnpm run qa:links
pnpm run lint
pnpm test
pnpm run build
pnpm exec playwright install chromium
pnpm run qa:browser
```

The GitHub Actions QA workflow runs the route/asset audit, lint, unit tests, production build and Chromium viewport checks on pushes and pull requests to `main`.

## Route map

- `/` — marketing homepage
- `/explore` and `/catalogue` — public swap discovery
- `/how-it-works`, `/about`, `/impact`, `/methodology`, `/faq`
- `/blog`, `/community`, `/sitemap-page`
- `/privacy`, `/terms`, `/cookies` — shared legal template with metadata and a table of contents
- `/dashboard/explore`, `/dashboard/catalogue`, `/dashboard/activity`, `/dashboard/account`, `/dashboard/settings`
- `/login` — mock demo-session entry

## Demo limitations

Dashboard access is protected by a mock `greenswap-session` cookie, not production identity/authentication. Swap history and saved swaps use browser storage only. The sample Green Points, impact figures and starter activity are illustrative; they are not verified personal emissions results. Newsletter signups are stored only in this browser and do not send email. Referral, checkout and community backend features are previews, not active services.

The public methodology page describes source families and caveats; review the item-level assumptions before using any factor in decisions or reports. GreenSwap is not a substitute for formal greenhouse-gas accounting.
