# 🌱 GreenSwap - Sustainable Living App

**Live Demo:** https://sustainable-app-qccf.vercel.app

> Most carbon calculators give you guilt. We give you arithmetic.

### About
GreenSwap helps users track and reduce their carbon footprint with real data.

### Tech Stack
- React + Vite + TypeScript
- Convex + Convex Auth
- Vercel (Deployment)

### Features
- Carbon footprint calculation
- Explainable, ranked sustainable swaps with source references and estimated impact/cost ranges
- User dashboard
- Persistent activity logging, reduction goals, self-reported challenges, and progress tracking
- No-sign-in demo access with browser-local profiles, activity logging, goals, and progress

### Local development

Requirements: Node.js 22 and pnpm 10. Visitors can use the field demo without signing in; demo profiles and activity data are stored in the current browser.

For local HTTPS on Windows, create a development certificate once from PowerShell:

```powershell
New-Item -ItemType Directory -Force .cert | Out-Null
$cert = New-SelfSignedCertificate -Type SSLServerAuthentication -DnsName localhost -CertStoreLocation Cert:\CurrentUser\My -FriendlyName "GreenSwap localhost HTTPS" -NotAfter (Get-Date).AddYears(2) -KeyExportPolicy Exportable
Export-PfxCertificate -Cert $cert -FilePath .cert\localhost.pfx -Password (New-Object System.Security.SecureString) | Out-Null
Export-Certificate -Cert $cert -FilePath .cert\localhost.cer -Force | Out-Null
```

Then run `pnpm dev:https` and open `https://localhost:5175`. The browser may show a certificate warning until you import `.cert\localhost.cer` into the current-user Trusted Root Certification Authorities store and accept Windows' trust prompt. The certificate files are local-only and ignored by Git. Keep the Convex backend running separately with `pnpm exec convex dev`.

```sh
pnpm install
Copy-Item .env.example .env.local
pnpm exec convex dev
```

For local development, set `VITE_CONVEX_URL=http://127.0.0.1:3210` and `VITE_APP_URL=https://localhost:5175` in `.env.local`; keep `pnpm exec convex dev` running while using the app. Alternatively, point `VITE_CONVEX_URL` at a real Convex Cloud deployment. Sign-in and account creation screens are disabled; protected app routes open the local field demo automatically.

```sh
pnpm dev
```

The Convex CLI deploys functions and generates local API types. Production builds require a real HTTPS Convex Cloud URL; local URLs are rejected. Convex Auth remains in the backend, but sign-in and account-creation screens are currently disabled in the app; visitors use the browser-local field demo instead.

The previous Supabase TOTP feature has been retired; Convex Auth does not provide a drop-in TOTP replacement. Administrative routes still require an authenticated user with the admin role.

### Validation

```sh
pnpm run lint
pnpm test
pnpm run build
```

The GitHub Actions CI workflow runs lint, unit tests, and build checks for pushes and pull requests.

The active backend schema and functions are under [`convex/`](./convex/). The [`supabase/`](./supabase/) directory is retained as the legacy schema and migration reference; it is no longer used by the app. Existing Supabase data is not transferred automatically: export it before switching deployments and import it into Convex using an explicit migration process.

To grant an administrator, create a `userRoles` document in the Convex dashboard with that account's `userId` (`users` document ID) and `role: "admin"`. Roles are not writable through the public client API.

Made for LPU Major Project 2026 · [GitHub](https://github.com/akashsharmapb09-cpu/sustainable-app)
