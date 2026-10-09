import type { ReactNode } from 'react';
import { PublicFooter, PublicMasthead } from './PublicMasthead';

function LegalLayout({ title, code, children }: { title: string; code: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicMasthead />
      <main className="mx-auto max-w-3xl px-6 py-16 md:px-12 space-y-4">
        <p className="taxonomy-label">{code}</p>
        <h1 className="font-serif text-4xl font-semibold">{title}</h1>
        <div className="text-sm text-ink-muted leading-relaxed space-y-3">{children}</div>
      </main>
      <PublicFooter />
    </div>
  );
}

export function PrivacyPage() {
  return (
    <LegalLayout title="Privacy (DPDP)" code="LEGAL // PRIVACY">
      <p>
        We store the email you use to sign in, profile and onboarding answers, activity logs, preference
        choices, recommendations, and account-related records needed to operate the service. Data is used
        to calculate estimates and personalize recommendations. Account data is isolated using database
        access policies; local browser storage is used only for the explicitly labeled demo session.
      </p>
      <p>
        Passwords are handled by the identity provider. HaveIBeenPwned checks use k-anonymity (first 5
        SHA-1 characters only). Essential browser storage holds authentication state; we do not use
        third-party advertising cookies or claim analytics tracking is enabled.
      </p>
      <p>
        Use Settings to download a JSON copy of account data or request permanent account deletion.
        Security audit records may contain the IP address and browser user-agent supplied with an
        authenticated request. There is currently no application-level time-based expiry for account
        records. They remain until account deletion; backup copies may persist until the hosting
        provider's configured backup-retention period expires.
      </p>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout title="Terms of use" code="LEGAL // TERMS">
      <p>
        GreenSwap provides estimated ranges, not professional carbon accounting. Emission factors are
        cited on the methodology page and may change as source datasets update.
      </p>
    </LegalLayout>
  );
}

export function CookiesPage() {
  return (
    <LegalLayout title="Cookies" code="LEGAL // COOKIES">
      <p>
        Essential storage is used for session tokens and local activity fallbacks. We do not run
        third-party advertising cookies.
      </p>
    </LegalLayout>
  );
}

export function NotFoundPage() {
  return (
    <LegalLayout title="Page not found" code="404">
      <p>This route is not in the field guide. Use the masthead to return to the catalog or home.</p>
    </LegalLayout>
  );
}
