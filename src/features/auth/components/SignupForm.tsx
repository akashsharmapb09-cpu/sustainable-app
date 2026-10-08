import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContextDef';
import { signupSchema, checkHaveIBeenPwned } from '../lib/passwordSecurity';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { UserPlus, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const { signupWithPassword } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [isPwned, setIsPwned] = useState(false);
  const [pwnedCount, setPwnedCount] = useState(0);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);

  // Debounce HaveIBeenPwned k-anonymity check
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (password.length < 8) {
        setIsPwned(false);
        setPwnedCount(0);
        return;
      }
      const res = await checkHaveIBeenPwned(password);
      setIsPwned(res.isPwned);
      setPwnedCount(res.pwnedCount);
    }, 400);

    return () => clearTimeout(timer);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parse = signupSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
      acceptTerms,
    });

    if (!parse.success) {
      setErrorMsg(parse.error.issues[0]?.message || 'Please correct form fields.');
      return;
    }

    if (isPwned) {
      setErrorMsg('This passphrase has appeared in known data breaches. Please choose a different passphrase.');
      return;
    }

    setIsSubmitting(true);
    const res = await signupWithPassword(email, password, fullName);
    setIsSubmitting(false);

    if (res.success) {
      if (res.needsVerification) {
        setVerificationPending(true);
      } else {
        onSuccess?.();
      }
    } else {
      setErrorMsg(res.error || 'Failed to complete registration.');
    }
  };

  if (verificationPending) {
    return (
      <div className="w-full max-w-md border border-border bg-surface p-8 rounded shadow-subtle text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-moss mb-4" />
        <span className="taxonomy-label">EMAIL VERIFICATION DISPATCHED</span>
        <h2 className="font-serif text-2xl font-bold text-foreground mt-2">Check Your Inbox</h2>
        <p className="text-sm text-ink-muted mt-2 font-sans leading-relaxed">
          We have dispatched a verification link to <strong className="text-foreground">{email}</strong>.
          Please click the link in your email to activate your account and start your onboarding.
        </p>
        <button
          onClick={onSwitchToLogin}
          className="mt-6 inline-flex items-center gap-2 text-xs font-mono text-burnt hover:underline"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md border border-border bg-surface p-8 rounded shadow-subtle">
      <div className="mb-6 border-b border-border pb-4">
        <span className="taxonomy-label">SEC.01 // ACCOUNT REGISTRATION</span>
        <h2 className="font-serif text-2xl font-bold text-foreground mt-1">Join GreenSwap</h2>
        <p className="text-xs text-ink-muted mt-1 font-sans">
          Evidence-based lifestyle calibration and carbon accounting.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded border border-burnt/30 bg-burnt/10 p-3 text-xs text-burnt flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signup-name" className="block text-xs font-mono text-ink-muted mb-1">
            Full Name (Optional)
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-burnt focus:outline-none focus:ring-1 focus:ring-burnt"
            placeholder="Aarav Sharma"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-xs font-mono text-ink-muted mb-1">
            Email Address
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-burnt focus:outline-none focus:ring-1 focus:ring-burnt"
            placeholder="aarav@domain.com"
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-xs font-mono text-ink-muted mb-1">
            Passphrase (Minimum 12 Characters)
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-burnt focus:outline-none focus:ring-1 focus:ring-burnt"
            placeholder="e.g. solar-cycling-garden-tea"
          />
          <PasswordStrengthMeter passphrase={password} isPwned={isPwned} pwnedCount={pwnedCount} />
        </div>

        <div>
          <label htmlFor="signup-confirm-password" className="block text-xs font-mono text-ink-muted mb-1">
            Confirm Passphrase
          </label>
          <input
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-burnt focus:outline-none focus:ring-1 focus:ring-burnt"
            placeholder="Repeat passphrase"
          />
        </div>

        <div className="flex items-start gap-2 pt-1">
          <input
            id="accept-terms"
            name="acceptTerms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            required
            className="h-4 w-4 rounded border-border text-burnt focus:ring-burnt mt-0.5"
          />
          <label htmlFor="accept-terms" className="text-xs text-ink-muted leading-relaxed font-sans">
            I accept the Privacy Policy and Terms of Service (DPDP Act & GDPR compliant).
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded bg-ink px-4 py-2.5 text-sm font-medium text-bone-100 hover:bg-ink/90 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Registering Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      {onSwitchToLogin && (
        <div className="mt-6 text-center text-xs text-ink-muted">
          Already registered?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-burnt hover:underline inline-flex items-center gap-1"
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}
