import crypto from 'crypto';

/**
 * 16. WEBHOOK SIGNATURE VERIFICATION:
 * Verifies HMAC-SHA256 signature using timing-safe comparison to prevent timing attacks.
 */
export function verifyWebhookSignature({
  payload,
  signatureHeader,
  secret,
}: {
  payload: string | Buffer;
  signatureHeader: string | null;
  secret: string;
}): boolean {
  if (!signatureHeader || !secret) {
    return false;
  }

  try {
    const rawPayload = typeof payload === 'string' ? payload : payload.toString('utf8');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawPayload)
      .digest('hex');

    // Remove prefix if present (e.g., 'sha256=...')
    const cleanedSignature = signatureHeader.replace(/^sha256=/, '').trim();

    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const actualBuffer = Buffer.from(cleanedSignature, 'hex');

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}
