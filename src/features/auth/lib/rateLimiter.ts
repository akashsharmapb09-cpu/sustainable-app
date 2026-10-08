interface RateLimitRecord {
  attempts: number;
  lastAttemptTimestamp: number;
  lockoutUntil: number;
}

class ClientRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();

  /**
   * Evaluates if a given action bucket (e.g. 'login:user@example.com') is rate-limited
   */
  check(key: string, maxAttempts = 5, lockoutDurationMs = 15 * 60 * 1000): {
    isBlocked: boolean;
    remainingAttempts: number;
    retryAfterSeconds: number;
  } {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record) {
      return { isBlocked: false, remainingAttempts: maxAttempts, retryAfterSeconds: 0 };
    }

    // Check if under active lockout
    if (now < record.lockoutUntil) {
      const retryAfter = Math.ceil((record.lockoutUntil - now) / 1000);
      return { isBlocked: true, remainingAttempts: 0, retryAfterSeconds: retryAfter };
    }

    // Window expired: reset
    if (now - record.lastAttemptTimestamp > lockoutDurationMs) {
      this.store.delete(key);
      return { isBlocked: false, remainingAttempts: maxAttempts, retryAfterSeconds: 0 };
    }

    const remaining = Math.max(0, maxAttempts - record.attempts);
    return { isBlocked: remaining === 0, remainingAttempts: remaining, retryAfterSeconds: 0 };
  }

  /**
   * Registers a failed attempt and triggers progressive delay / lockout
   */
  recordFailure(key: string, maxAttempts = 5, lockoutDurationMs = 15 * 60 * 1000): {
    lockoutTriggered: boolean;
    delayMs: number;
  } {
    const now = Date.now();
    const existing = this.store.get(key) || { attempts: 0, lastAttemptTimestamp: now, lockoutUntil: 0 };
    const attempts = existing.attempts + 1;

    let lockoutUntil = 0;
    let delayMs = 0;

    if (attempts >= maxAttempts) {
      lockoutUntil = now + lockoutDurationMs;
    } else {
      // Progressive delay: 1st=0s, 2nd=1s, 3rd=3s, 4th=6s
      delayMs = Math.min(10000, Math.pow(attempts - 1, 2) * 1000);
    }

    this.store.set(key, {
      attempts,
      lastAttemptTimestamp: now,
      lockoutUntil,
    });

    return { lockoutTriggered: attempts >= maxAttempts, delayMs };
  }

  /**
   * Clears failure record upon successful authentication
   */
  recordSuccess(key: string): void {
    this.store.delete(key);
  }
}

export const rateLimiter = new ClientRateLimiter();
