# GreenSwap

**A premium, editorial sustainable-living experience built on the Next.js App Router.**

Live site (currently prior release until this branch passes QA): https://sustainable-app-qccf.vercel.app/

## Architecture

The app is organised around Next.js route groups and a shared design system. Public marketing pages and legal pages share a polished navigation and brand footer; the dashboard runs a separate shell and intentionally omits the marketing footer.

```text
app/
├── (marketing)/
│   ├── layout.tsx
│   ├── page.tsx                 # Landing
│   ├── explore/page.tsx
│   ├── catalogue/page.tsx
│   ├── how-it-works/page.tsx
│   ├── about/page.tsx
│   ├── rewards/page.tsx
│   ├── impact/page.tsx
│   ├── faq/page.tsx
│   ├── blog/page.tsx
│   ├── community/page.tsx
│   └── methodology/page.tsx
├── (legal)/
│   ├── layout.tsx
│   └── [slug]/page.tsx          # MDX-ready legal template / TOC / SEO
├── (dashboard)/
│   └── dashboard/
│       ├── layout.tsx
│       ├── page.tsx             # Redirect to /dashboard/explore
│       ├── loading.tsx
│       ├── explore/page.tsx
│       ├── catalogue/page.tsx
│       ├── activity/page.tsx
│       ├── account/page.tsx
│       └── settings/page.tsx
├── actions.ts                   # Server actions: demo session, swaps, settings
├── login/page.tsx
├── logout/route.ts
├── loading.tsx
├── not-found.tsx
├── error.tsx
├── globals.css
└── layout.tsx                   # next/font, metadata, global shell
components/
├── layout/
│   ├── Navbar.tsx
│   ├── NavbarLinks.tsx
│   ├── AvatarDropdown.tsx
│   ├── DashboardSidebarNav.tsx
│   └── Footer.tsx
└── ui/
    ├── Button.tsx
    ├── Badge.tsx
    ├── Table.tsx
    └── Breadcrumb.tsx
lib/
├── catalogue.ts                 # Typed swap catalogue + evidence notes
└── utils.ts                     # cn() + safe parsing
public/
├── swaps/                       # Seven responsive vector illustrations
├── favicon.svg
├── icon-192.svg
├── og-image.png
├── robots.txt
└── sitemap.xml
proxy.ts                         # Next.js dashboard-route guard
next.config.ts
tailwind.config.ts
vercel.json
scripts/
├── qa-links.mjs                 # Internal routes + static asset audit
└── qa-browser.mjs               # Chromium: 21 routes × 4 viewport sizes
.github/workflows/qa.yml         # Lint, tests, build and browser gate
```

## User journey

Home → Explore → Catalogue → Record a swap → My Activity → Account → Settings.

The dashboard has a distinct sidebar, profile card, points card, active route state, mobile navigation, auto breadcrumbs and loading skeleton. The FAQ includes 10 practical answers and is linked from the public footer. Legal routes use an SEO-aware, static-parameter template with last-updated date and a sticky table of contents.

## Demo mode and product boundaries

This release intentionally uses a **mock session**, not production authentication. Entering the demo sets an HTTP-only cookie. Recorded swaps, points and preferences are held in HTTP-only browser cookies; they are not cloud-synchronised account data. Logging out clears the demo cookies.

Newsletter delivery, community posting, reward redemption and paid Pro checkout are not connected. The newsletter form does not persist an address when the provider is unavailable. Environmental copy labels the “0.7t saved” artwork as illustrative rather than a personal measurement.

Before enabling real accounts or rewards, connect and threat-model an identity provider, persistent database, email provider and payment system; review legal/privacy text for the live implementation.

## Local development

Requirements: Node.js 22+ and pnpm 10.34.6.

```sh
pnpm install
pnpm dev
```

## Release QA

```sh
pnpm run qa:links
pnpm run lint
pnpm test
pnpm run build
pnpm exec playwright install --with-deps chromium
pnpm run qa:browser
```

The browser suite checks direct-route navigation, uncaught runtime errors, images and horizontal overflow at 320px (iPhone SE), 393px (iPhone 15 Pro), 768px (iPad) and 1440px (desktop). CI reports actual results per commit; a source build is not a substitute for physical-device or Lighthouse testing.

## Deployment

Vercel is configured for the Next.js framework preset on Node.js 22. Pushes to `main` deploy production; pushes to the release branch deploy a preview. Promote the App Router branch only after the QA workflow succeeds.
