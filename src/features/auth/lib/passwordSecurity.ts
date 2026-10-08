import { z } from 'zod';

/**
 * Zod validation schema for secure passphrases:
 * - Minimum 12 characters (NIST SP 800-63B standard)
 * - Maximum 128 characters (prevents DoS via hashing algorithms)
 * - Allows passphrases with spaces and password manager generation (never blocks paste)
 */
export const passwordSchema = z
  .string()
  .min(12, 'Passphrase must be at least 12 characters long')
  .max(128, 'Passphrase cannot exceed 128 characters')
  .refine((val) => !val.includes('password'), {
    message: 'Passphrase cannot contain the word "password"',
  });

export const signupSchema = z
  .object({
    email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
    password: passwordSchema,
    confirmPassword: z.string(),
    fullName: z.string().min(2, 'Name must be at least 2 characters').max(60).optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the privacy policy and terms',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passphrases do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passphrases do not match',
    path: ['confirmPassword'],
  });

export interface PasswordStrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Excellent';
  feedback: string[];
}

/**
 * Calculates passphrase strength and entropy feedback (zxcvbn heuristic equivalent)
 */
export function calculatePasswordStrength(passphrase: string): PasswordStrengthResult {
  if (!passphrase) {
    return { score: 0, label: 'Very Weak', feedback: ['Enter a passphrase with at least 12 characters.'] };
  }

  const length = passphrase.length;
  const feedback: string[] = [];

  let entropyPoints = 0;

  // Length scoring
  if (length >= 12) entropyPoints += 1;
  if (length >= 16) entropyPoints += 1;
  if (length >= 22) entropyPoints += 1;

  // Character variety checks
  const hasLower = /[a-z]/.test(passphrase);
  const hasUpper = /[A-Z]/.test(passphrase);
  const hasDigit = /[0-9]/.test(passphrase);
  const hasSpecial = /[^A-Za-z0-9]/.test(passphrase);
  const hasSpaces = /\s/.test(passphrase);

  const varietyCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
  if (varietyCount >= 3) entropyPoints += 1;
  if (hasSpaces) entropyPoints += 1; // Encourage multi-word passphrases

  // Common pattern deductions
  if (/^[A-Za-z]+$/.test(passphrase) && length < 16) {
    feedback.push('Add numbers, symbols, or additional words to increase complexity.');
    entropyPoints = Math.max(0, entropyPoints - 1);
  }
  if (/^[0-9]+$/.test(passphrase)) {
    feedback.push('Avoid purely numeric passphrases.');
    entropyPoints = 0;
  }
  if (/(.)\1{3,}/.test(passphrase)) {
    feedback.push('Avoid repeated character sequences.');
    entropyPoints = Math.max(0, entropyPoints - 1);
  }

  let score: 0 | 1 | 2 | 3 | 4 = 0;
  if (entropyPoints <= 1) score = 1;
  else if (entropyPoints === 2) score = 2;
  else if (entropyPoints === 3) score = 3;
  else score = 4;

  if (length < 12) {
    score = Math.min(score, 1) as 0 | 1;
    feedback.unshift('Passphrase is under 12 characters.');
  }

  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Excellent'] as const;

  return {
    score,
    label: labels[score],
    feedback: feedback.length > 0 ? feedback : ['Passphrase meets high security and entropy thresholds.'],
  };
}

/**
 * Checks passphrase against HaveIBeenPwned API using k-Anonymity
 * Never sends the password or its full hash over the network.
 * Only the first 5 characters of SHA-1 hash are queried.
 */
export async function checkHaveIBeenPwned(passphrase: string): Promise<{ isPwned: boolean; pwnedCount: number }> {
  if (!passphrase || passphrase.length < 4) {
    return { isPwned: false, pwnedCount: 0 };
  }

  try {
    // 1. Compute SHA-1 hash using browser/Node subtle crypto
    const encoder = new TextEncoder();
    const data = encoder.encode(passphrase);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fullHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    // 2. Split into 5-char prefix and 35-char suffix
    const prefix = fullHash.substring(0, 5);
    const suffix = fullHash.substring(5);

    // 3. Query HIBP range endpoint
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: 'GET',
      headers: {
        'Add-Padding': 'true', // Prevents response size side-channel leakage
      },
    });

    if (!response.ok) {
      // In case of network error or rate limit, fail open safely without blocking user
      return { isPwned: false, pwnedCount: 0 };
    }

    const text = await response.text();
    const lines = text.split('\n');

    for (const line of lines) {
      const [hashSuffix, countStr] = line.trim().split(':');
      if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
        const count = parseInt(countStr, 10) || 1;
        return { isPwned: true, pwnedCount: count };
      }
    }

    return { isPwned: false, pwnedCount: 0 };
  } catch (err) {
    console.warn('HIBP k-anonymity check unavailable:', err);
    return { isPwned: false, pwnedCount: 0 };
  }
}
