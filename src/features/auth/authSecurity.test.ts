import { describe, it, expect, beforeEach } from 'vitest';
import {
  passwordSchema,
  signupSchema,
  calculatePasswordStrength,
} from './lib/passwordSecurity';
import { rateLimiter } from './lib/rateLimiter';

describe('Authentication & Password Security Test Suite', () => {
  describe('Password & Passphrase Validation (NIST SP 800-63B)', () => {
    it('rejects passwords shorter than 12 characters', () => {
      const shortRes = passwordSchema.safeParse('short123');
      expect(shortRes.success).toBe(false);
      if (!shortRes.success) {
        expect(shortRes.error.issues[0].message).toContain('at least 12 characters');
      }
    });

    it('accepts valid 12+ character passphrases with spaces and punctuation', () => {
      const validRes = passwordSchema.safeParse('solar cycling garden tea');
      expect(validRes.success).toBe(true);
    });

    it('rejects passwords containing the literal word "password"', () => {
      const res = passwordSchema.safeParse('mypassword12345');
      expect(res.success).toBe(false);
    });

    it('rejects passwords longer than 128 characters to prevent hashing DoS', () => {
      const longPassword = 'a'.repeat(129);
      const res = passwordSchema.safeParse(longPassword);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain('cannot exceed 128 characters');
      }
    });
  });

  describe('Signup Schema Validation', () => {
    it('validates correct email and matching passphrases', () => {
      const validData = {
        email: 'AARAV@domain.com',
        password: 'solar-cycling-garden-tea',
        confirmPassword: 'solar-cycling-garden-tea',
        fullName: 'Aarav Sharma',
        acceptTerms: true,
      };

      const res = signupSchema.safeParse(validData);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.email).toBe('aarav@domain.com'); // Lowercased
      }
    });

    it('rejects signup if confirmPassword does not match', () => {
      const mismatchData = {
        email: 'test@domain.com',
        password: 'solar-cycling-garden-tea',
        confirmPassword: 'different-password-1234',
        acceptTerms: true,
      };

      const res = signupSchema.safeParse(mismatchData);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain('do not match');
      }
    });

    it('rejects signup if terms of service are not accepted', () => {
      const noTermsData = {
        email: 'test@domain.com',
        password: 'solar-cycling-garden-tea',
        confirmPassword: 'solar-cycling-garden-tea',
        acceptTerms: false,
      };

      const res = signupSchema.safeParse(noTermsData);
      expect(res.success).toBe(false);
    });
  });

  describe('Password Strength & Entropy Calculator', () => {
    it('scores trivial passwords as Very Weak or Weak', () => {
      const weak = calculatePasswordStrength('123456');
      expect(weak.score).toBeLessThanOrEqual(1);
      expect(['Very Weak', 'Weak']).toContain(weak.label);
    });

    it('scores strong multi-word passphrases as Strong or Excellent', () => {
      const strong = calculatePasswordStrength('bldc-metro-harvest-2026!');
      expect(strong.score).toBeGreaterThanOrEqual(3);
      expect(['Strong', 'Excellent']).toContain(strong.label);
    });

    it('deducts score for repeated character sequences', () => {
      const repeated = calculatePasswordStrength('aaaaaaaaaaaa123!');
      expect(repeated.feedback.some((f) => f.includes('repeated'))).toBe(true);
    });
  });

  describe('Rate Limiter & Progressive Delay Backoff', () => {
    const testKey = 'test-ip:127.0.0.1';

    beforeEach(() => {
      rateLimiter.recordSuccess(testKey);
    });

    it('allows initial authentication attempts', () => {
      const check = rateLimiter.check(testKey, 5);
      expect(check.isBlocked).toBe(false);
      expect(check.remainingAttempts).toBe(5);
    });

    it('escalates progressive delay upon consecutive failed attempts', () => {
      const fail1 = rateLimiter.recordFailure(testKey, 5);
      expect(fail1.lockoutTriggered).toBe(false);

      const fail2 = rateLimiter.recordFailure(testKey, 5);
      expect(fail2.delayMs).toBeGreaterThan(0);

      const fail3 = rateLimiter.recordFailure(testKey, 5);
      expect(fail3.delayMs).toBeGreaterThan(fail2.delayMs);
    });

    it('triggers full lockout when attempt threshold is breached', () => {
      for (let i = 0; i < 4; i++) {
        rateLimiter.recordFailure(testKey, 5);
      }

      const fail5 = rateLimiter.recordFailure(testKey, 5);
      expect(fail5.lockoutTriggered).toBe(true);

      const check = rateLimiter.check(testKey, 5);
      expect(check.isBlocked).toBe(true);
      expect(check.retryAfterSeconds).toBeGreaterThan(0);
    });

    it('resets failure record when user successfully authenticates', () => {
      rateLimiter.recordFailure(testKey, 5);
      rateLimiter.recordSuccess(testKey);

      const check = rateLimiter.check(testKey, 5);
      expect(check.isBlocked).toBe(false);
      expect(check.remainingAttempts).toBe(5);
    });
  });
});
