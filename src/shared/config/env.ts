import { z } from 'zod';

const envSchema = z.object({
  VITE_CONVEX_URL: z.string().url().optional(),
  VITE_APP_ENV: z.enum(['development', 'test', 'preview', 'production']).default('development'),
  VITE_APP_URL: z.string().url().default('http://localhost:5173'),
  VITE_ENABLE_MOCK_FALLBACK: z.preprocess((val) => val === 'true' || val === true || val === '1', z.boolean()).default(true),
});

export type EnvConfig = z.infer<typeof envSchema>;

function isConvexCloudConfigured(source: Record<string, unknown>): boolean {
  const url = typeof source.VITE_CONVEX_URL === 'string' ? source.VITE_CONVEX_URL.trim() : '';
  const match = /^https:\/\/([a-z0-9]+(?:-[a-z0-9]+){2,})\.convex\.cloud$/i.exec(url);
  if (!match) return false;
  const deployment = match[1].toLowerCase();
  return !/(?:^|-)(?:example|placeholder|your-deployment|greenswap-demo)(?:-|$)/i.test(deployment);
}

export function isConvexConfigured(source: Record<string, unknown> = import.meta.env): boolean {
  if (isConvexCloudConfigured(source)) return true;

  const url = typeof source.VITE_CONVEX_URL === 'string' ? source.VITE_CONVEX_URL.trim() : '';
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:'
      && ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname)
      && parsed.port === '3210'
      && parsed.pathname === '/'
      && !parsed.search
      && !parsed.hash;
  } catch {
    return false;
  }
}

export function getValidatedEnv(
  source: Record<string, unknown> = import.meta.env,
  mode = import.meta.env.MODE
): EnvConfig {
  if (mode === 'production') {
    const url = typeof source.VITE_CONVEX_URL === 'string' ? source.VITE_CONVEX_URL.trim() : '';
    if (!isConvexCloudConfigured(source)) {
      const reason = url.length === 0
        ? 'missing VITE_CONVEX_URL'
        : 'VITE_CONVEX_URL must be a valid HTTPS Convex deployment URL';
      throw new Error(`Invalid production environment: ${reason}`);
    }
  }

  const result = envSchema.safeParse(source);
  if (!result.success) {
    // In production fail immediately; in dev/test fall back to defaults
    if (mode === 'production') {
      console.error('Production environment validation failed:', result.error.format());
      throw new Error(`Invalid environment configuration: ${JSON.stringify(result.error.flatten().fieldErrors)}`);
    }
    console.warn('Environment validation failed; using development defaults.');
  }
  return result.success ? result.data : envSchema.parse({});
}

export const env = getValidatedEnv();
