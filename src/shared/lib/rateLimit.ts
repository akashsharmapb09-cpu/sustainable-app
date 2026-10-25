interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipMap = new Map<string, RateLimitRecord>();

// Clean up stale IPs periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipMap.entries()) {
      if (now > record.resetAt) {
        ipMap.delete(ip);
      }
    }
  }, 60000);
}

/**
 * In-memory IP rate limiter: 100 requests per minute per IP.
 */
export function checkRateLimit(ip: string, limit = 100, windowMs = 60000): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const record = ipMap.get(ip);

  if (!record || now > record.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil(record.resetAt / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: Math.ceil(record.resetAt / 1000),
  };
}
