import React, { useState } from 'react';
import { useAuth } from '../context/authContextDef';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await requestPasswordReset(email);
    setIsSubmitting(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(res.error || 'Failed to dispatch reset email.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md border border-border bg-surface p-6 rounded shadow-elevation">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <span className="taxonomy-label">SEC.02 // RECOVERY DISPATCH</span>
          <button
            onClick={onClose}
            className="text-xs font-mono text-ink-muted hover:text-foreground"
          >
            [ESC / CLOSE]
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-4">
            <CheckCircle2 className="mx-auto h-10 w-10 text-moss mb-3" />
            <h3 className="font-serif text-xl font-bold text-foreground">Link Dispatched</h3>
            <p className="text-xs text-ink-muted mt-2 font-sans leading-relaxed">
              If an account is associated with <strong>{email}</strong>, passphrase reset
              instructions have been sent. Check your inbox and spam folder.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded bg-ink py-2 text-xs font-medium text-bone-100 hover:bg-ink/90"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-1">Reset Passphrase</h3>
            <p className="text-xs text-ink-muted font-sans mb-4">
              Enter your verified email. All active sessions will be invalidated upon completion.
            </p>

            {errorMsg && (
              <div className="mb-4 rounded border border-burnt/30 bg-burnt/10 p-2.5 text-xs text-burnt flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-xs font-mono text-ink-muted mb-1">
                  Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-burnt focus:outline-none focus:ring-1 focus:ring-burnt"
                  placeholder="you@domain.com"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded border border-border px-3 py-1.5 text-xs font-mono text-ink-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded bg-ink px-4 py-1.5 text-xs font-mono font-medium text-bone-100 hover:bg-ink/90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-3.5 w-3.5" />
                      <span>Send Reset Instructions</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
