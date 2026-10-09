import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/authContextDef';
import { resetPasswordSchema } from '../lib/passwordSecurity';

export function ResetPasswordPage() {
  const { updatePassword, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(() => searchParams.get('email') ?? '');
  const [code, setCode] = useState(() => searchParams.get('code') ?? '');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword: confirmation });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Check your passphrase and try again.');
      return;
    }

    setBusy(true);
    const result = await updatePassword(password, email, code);
    setBusy(false);
    if (!result.success) {
      setError(result.error ?? 'Could not update your passphrase. Request a new reset code and try again.');
      return;
    }
    setComplete(true);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-md border border-border bg-surface p-8">
        <p className="taxonomy-label">ACCOUNT RECOVERY</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold">
          {complete ? 'Passphrase updated' : 'Choose a new passphrase'}
        </h1>
        {complete ? (
          <>
            <p className="mt-3 text-sm text-ink-muted">Your passphrase has been changed.</p>
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/login', { replace: true });
              }}
              className="mt-6 min-h-11 rounded bg-ink px-4 py-2 text-sm text-bone-100"
            >
              Return to sign in
            </button>
          </>
        ) : (
          <form className="mt-5 space-y-4" onSubmit={submit}>
            <p className="text-sm text-ink-muted">Use at least 12 characters. A longer phrase is easier to remember and harder to guess.</p>
            {error && <p className="text-sm text-burnt" role="alert">{error}</p>}
            <div>
              <label htmlFor="reset-email" className="mb-1 block text-sm">Account email</label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-3 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="reset-code" className="mb-1 block text-sm">One-time reset code</label>
              <input
                id="reset-code"
                type="text"
                autoComplete="one-time-code"
                value={code}
                onChange={(event) => setCode(event.target.value.trim())}
                className="w-full rounded border border-border bg-background px-3 py-3 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="new-password" className="mb-1 block text-sm">New passphrase</label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-3 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-new-password" className="mb-1 block text-sm">Confirm passphrase</label>
              <input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-3 text-sm"
                required
              />
            </div>
            <button type="submit" disabled={busy} className="min-h-11 w-full rounded bg-ink px-4 py-2 text-sm text-bone-100 disabled:opacity-50">
              {busy ? 'Updating…' : 'Update passphrase'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
