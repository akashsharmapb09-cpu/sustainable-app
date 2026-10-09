import { describe, expect, it } from 'vitest';
import { getValidatedEnv, isConvexConfigured } from './env';

describe('environment validation', () => {
  it('rejects missing or placeholder Convex settings in production', () => {
    expect(() => getValidatedEnv({}, 'production')).toThrow(/missing VITE_CONVEX_URL/);
    expect(() => getValidatedEnv({
      VITE_CONVEX_URL: 'https://example-project-123.convex.cloud',
    }, 'production')).toThrow(/valid HTTPS Convex deployment URL/);
  });

  it('requires HTTPS and a Convex deployment hostname in production', () => {
    expect(() => getValidatedEnv({
      VITE_CONVEX_URL: 'http://127.0.0.1:3210',
    }, 'production')).toThrow(/valid HTTPS Convex deployment URL/);
  });

  it('accepts a configured production Convex endpoint', () => {
    const result = getValidatedEnv({
      VITE_CONVEX_URL: 'https://project-name-123.convex.cloud',
    }, 'production');

    expect(result.VITE_CONVEX_URL).toBe('https://project-name-123.convex.cloud');
  });

  it('retains safe local defaults outside production', () => {
    const result = getValidatedEnv({}, 'development');
    expect(result.VITE_CONVEX_URL).toBeUndefined();
  });

  it('only accepts real Convex Cloud deployment URLs', () => {
    expect(isConvexConfigured({ VITE_CONVEX_URL: 'https://example-project-123.convex.cloud' })).toBe(false);
    expect(isConvexConfigured({ VITE_CONVEX_URL: 'https://project-name-123.convex.cloud' })).toBe(true);
    expect(isConvexConfigured({ VITE_CONVEX_URL: 'https://project-name.convex.cloud' })).toBe(false);
    expect(isConvexConfigured({ VITE_CONVEX_URL: 'https://greenswap-demo-000000.convex.cloud' })).toBe(false);
  });

  it('accepts only the local Convex backend URL in development', () => {
    expect(isConvexConfigured({ VITE_CONVEX_URL: 'http://localhost:3210' })).toBe(true);
    expect(isConvexConfigured({ VITE_CONVEX_URL: 'http://127.0.0.1:3210' })).toBe(true);
    expect(isConvexConfigured({ VITE_CONVEX_URL: 'http://localhost:3211' })).toBe(false);
    expect(isConvexConfigured({ VITE_CONVEX_URL: 'http://localhost:3210.evil.test' })).toBe(false);
    expect(isConvexConfigured({ VITE_CONVEX_URL: 'https://localhost:3210' })).toBe(false);
  });

  it('never accepts a local backend URL for production builds', () => {
    expect(() => getValidatedEnv({
      VITE_CONVEX_URL: 'http://127.0.0.1:3210',
    }, 'production')).toThrow(/valid HTTPS Convex deployment URL/);
  });
});
