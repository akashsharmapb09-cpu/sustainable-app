import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContextDef';

export function AuthVerificationPage() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-lg border border-border bg-surface p-8">
        <p className="taxonomy-label">EMAIL VERIFICATION</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold">
          {isLoading ? 'Checking your link…' : isAuthenticated ? 'Your account is ready' : 'Link not verified'}
        </h1>
        {isLoading ? (
          <p className="mt-3 text-sm text-ink-muted" role="status">Please wait while we check your sign-in.</p>
        ) : isAuthenticated ? (
          <>
            <p className="mt-3 text-sm text-ink-muted">
              {user?.email_confirmed_at && user.email
                ? `${user.email} is now verified.`
                : 'Your GreenSwap account is ready.'}
            </p>
            <Link to="/onboarding" className="mt-6 inline-flex min-h-11 items-center rounded bg-ink px-4 py-2 text-sm text-bone-100">
              Continue to GreenSwap
            </Link>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-ink-muted">
              This verification link may have expired or already been used. Sign in if you have verified already, or request a new link.
            </p>
            <Link to="/login" className="mt-6 inline-flex min-h-11 items-center rounded border border-border px-4 py-2 text-sm">
              Return to sign in
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
