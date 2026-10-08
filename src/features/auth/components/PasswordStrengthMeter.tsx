import { calculatePasswordStrength } from '../lib/passwordSecurity';

interface PasswordStrengthMeterProps {
  passphrase: string;
  isPwned?: boolean;
  pwnedCount?: number;
}

export function PasswordStrengthMeter({ passphrase, isPwned, pwnedCount }: PasswordStrengthMeterProps) {
  if (!passphrase) return null;

  const { score, label, feedback } = calculatePasswordStrength(passphrase);

  const getBarColor = (index: number) => {
    if (index > score) return 'bg-border';
    switch (score) {
      case 1:
        return 'bg-burnt';
      case 2:
        return 'bg-clay';
      case 3:
        return 'bg-moss-400';
      case 4:
        return 'bg-moss-600';
      default:
        return 'bg-border';
    }
  };

  return (
    <div className="mt-2 space-y-1.5" aria-live="polite">
      {/* 4-Segment Strength Indicator */}
      <div className="flex gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`flex-1 rounded-sm transition-colors duration-200 ${getBarColor(step)}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-ink-muted">
          Complexity: <span className="font-semibold text-foreground">{label}</span>
        </span>
        <span className="font-mono text-ink-faint text-[11px]">
          {passphrase.length} / 12+ chars
        </span>
      </div>

      {/* Breached password warning */}
      {isPwned && (
        <div className="rounded border border-burnt/30 bg-burnt/10 p-2 text-xs text-burnt font-sans">
          <span className="font-semibold">Security Alert:</span> This passphrase has appeared in{' '}
          {pwnedCount?.toLocaleString()} public data breaches. Please pick a unique passphrase.
        </div>
      )}

      {/* Helpful feedback */}
      {!isPwned && feedback.length > 0 && score < 3 && (
        <p className="text-xs text-ink-muted font-sans">
          {feedback[0]}
        </p>
      )}
    </div>
  );
}
