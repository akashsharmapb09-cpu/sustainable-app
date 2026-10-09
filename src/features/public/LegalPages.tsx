import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
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

export function FAQPage() {
  const questions = [
    {
      question: 'What is GreenSwap?',
      answer: 'GreenSwap is a practical guide to lower-impact everyday choices across travel, food, energy, waste and shopping. It helps you compare alternatives that fit your budget and routine.',
    },
    {
      question: 'How are environmental impacts estimated?',
      answer: 'GreenSwap uses published emission factors and documented assumptions. The Methodology page identifies the sources and units used for listed activities. Real-world results vary by region, product, distance and how an activity is performed.',
    },
    {
      question: 'Does “0.7t saved” represent my personal impact?',
      answer: 'No. The 0.7 tonne figure shown in the visual demo is an illustrative example, not a measurement of your activity or a verified personal saving. Your actual result is not calculated from that headline number.',
    },
    {
      question: 'Which data sources does GreenSwap use?',
      answer: 'The catalog references sources such as DEFRA, India’s Central Electricity Authority (CEA), and the US Environmental Protection Agency (EPA), alongside other source documents where relevant. Check the Methodology page for the source attached to each factor. A source named in the headline is not necessarily used for every individual estimate.',
    },
    {
      question: 'Are recommendations guarantees or professional carbon accounting?',
      answer: 'No. Recommendations and savings estimates are indicative decision support, not a guarantee, formal audit, or substitute for professional greenhouse-gas accounting. Use the cited assumptions to decide whether an option fits your circumstances.',
    },
    {
      question: 'Do I have to create an account?',
      answer: 'You can explore the current GreenSwap demo without signing in. Some account and cloud features are not enabled in demo mode, so do not assume your local demo data will follow you to another device.',
    },
    {
      question: 'Where are my activity logs and preferences saved?',
      answer: 'In the current field demo, activity logs, lifestyle choices and saved swaps are stored in browser storage on this device. They are not automatically synced to other devices. Clearing this site’s browser data can remove them. See the Privacy page for more detail.',
    },
    {
      question: 'How do I change what GreenSwap recommends?',
      answer: 'Open the dashboard and use the “Your everyday choices” section to adjust travel, food, energy, budget, effort and topics you care about. Save your changes on the same device to keep them in the demo.',
    },
    {
      question: 'Are the newsletter, referral rewards and Pro checkout active?',
      answer: 'Not yet. Newsletter signups in the demo are saved locally and do not send emails. Referral sharing does not currently track rewards, and the Pro page is a preview rather than an active payment checkout.',
    },
    {
      question: 'Does “No cookies” mean the site stores no data?',
      answer: 'No. The site does not use third-party advertising cookies in the current demo, but it does use browser storage for demo preferences and activity logs. Browser storage and cookies are different mechanisms. The Privacy and Cookies pages describe the current setup.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicMasthead />
      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16 md:px-12">
        <p className="taxonomy-label">FIELD GUIDE / ANSWERS</p>
        <h1 className="mt-3 max-w-3xl break-words font-serif text-5xl leading-[.98] tracking-tight sm:text-6xl">Good questions.<span className="text-burnt"> Clear answers.</span></h1>
        <p className="mt-5 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">A practical guide to estimates, data, saved preferences and what is or is not enabled in this demo.</p>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {questions.map((item, index) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-1 font-serif text-xl leading-7 marker:hidden sm:text-2xl">
                <span className="flex min-w-0 gap-4"><span className="pt-1 font-mono text-[10px] text-ink-muted">{String(index + 1).padStart(2, '0')}</span><span>{item.question}</span></span>
                <span className="grid h-7 w-7 shrink-0 place-items-center border border-border font-mono text-sm transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="ml-9 mt-3 max-w-3xl text-sm leading-7 text-ink-muted">{item.answer}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/methodology" className="inline-flex items-center bg-ink px-5 py-3 text-sm text-bone-100">Review data sources ↗</Link>
          <Link to="/privacy" className="inline-flex items-center border border-border px-5 py-3 text-sm">Read privacy details</Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
