import React, { useState } from 'react';
import { useAuth } from '../context/authContextDef';
import { loginSchema } from '../lib/passwordSecurity';
import { KeyRound, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPasswordClick?: () => void;
  onSwitchToSignup?: () => void;
}

export function LoginForm({ onSuccess, onForgotPasswordClick, onSwitchToSignup }: LoginFormProps) {
  const { loginWithPassword, loginWithMagicLink, loginWithOAuth } = useAuth();

  const [authMode, setAuthMode] = useState<'password' | 'magic_link'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);

    if (authMode === 'password') {
      const parse = loginSchema.safeParse({ email, password });
      if (!parse.success) {
        setErrorMsg(parse.error.issues[0]?.message || 'Please check your inputs.');
        return;
      }

      setIsSubmitting(true);
      const res = await loginWithPassword(email, password);
      setIsSubmitting(false);

      if (res.success) {
        onSuccess?.();
      } else {
        setErrorMsg(res.error || 'Invalid email or password');
      }
    } else {
      // Magic Link mode
      if (!email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }

      setIsSubmitting(true);
      const res = await loginWithMagicLink(email);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessNotice('A single-use magic login link has been sent to your email.');
      } else {
        setErrorMsg(res.error || 'Failed to send magic link.');
      }
    }
  };

  return (
    <div className="w-full max-w-md border border-border bg-surface p-8 rounded shadow-subtle">
      {/* Editorial Header */}
      <div className="mb-6 border-b border-border pb-4">
        <span className="taxonomy-label">SEC.00 // AUTHENTICATION</span>
        <h2 className="font-serif text-2xl font-bold text-foreground mt-1">Sign In to GreenSwap</h2>
        <p className="text-xs text-ink-muted mt-1 font-sans">
          Access your recorded lifestyle footprint and personalized recommendations.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex border border-border rounded-sm mb-6 bg-surface-muted p-0.5">
        <button
          type="button"
          onClick={() => { setAuthMode('password'); setErrorMsg(null); }}
          className={`flex-1 py-1.5 text-xs font-mono rounded-sm transition-colors ${
            authMode === 'password'
              ? 'bg-surface font-semibold text-foreground shadow-subtle'
              : 'text-ink-muted hover:text-foreground'
          }`}
        >
          Passphrase
        </button>
        <button
          type="button"
          onClick={() => { setAuthMode('magic_link'); setErrorMsg(null); }}
          className={`flex-1 py-1.5 text-xs font-mono rounded-sm transition-colors ${
            authMode === 'magic_link'
              ? 'bg-surface font-semibold text-foreground shadow-subtle'
              : 'text-ink-muted hover:text-foreground'
          }`}
        >
          Magic Link
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded border border-burnt/30 bg-burnt/10 p-3 text-xs text-burnt flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successNotice && (
        <div className="mb-4 rounded border border-moss/30 bg-moss/10 p-3 text-xs text-moss flex items-start gap-2">
          <Mail className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{successNotice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-xs font-mono text-ink-muted mb-1">
            Email Address
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-burnt focus:outline-none focus:ring-1 focus:ring-burnt"
            placeholder="you@domain.com"
          />
        </div>

        {authMode === 'password' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="login-password" className="text-xs font-mono text-ink-muted">
                Passphrase
              </label>
              {onForgotPasswordClick && (
                <button
                  type="button"
                  onClick={onForgotPasswordClick}
                  className="text-xs font-mono text-burnt hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-burnt focus:outline-none focus:ring-1 focus:ring-burnt"
              placeholder="••••••••••••"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded bg-ink px-4 py-2.5 text-sm font-medium text-bone-100 hover:bg-ink/90 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : authMode === 'password' ? (
            <>
              <KeyRound className="h-4 w-4" />
              <span>Sign In</span>
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              <span>Send Link</span>
            </>
          )}
        </button>
      </form>

      {/* OAuth Options */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-center taxonomy-label mb-3">OR VERIFY WITH IDENTITY PROVIDER</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => loginWithOAuth('google')}
            className="flex items-center justify-center gap-2 rounded border border-border bg-surface px-3 py-2 text-xs font-mono hover:border-ink hover:text-foreground transition-colors"
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => loginWithOAuth('github')}
            className="flex items-center justify-center gap-2 rounded border border-border bg-surface px-3 py-2 text-xs font-mono hover:border-ink hover:text-foreground transition-colors"
          >
            GitHub
          </button>
        </div>
      </div>

      {onSwitchToSignup && (
        <div className="mt-6 text-center text-xs text-ink-muted">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-medium text-burnt hover:underline inline-flex items-center gap-1"
          >
            Register <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
