import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().default('https://example.supabase.co'),
  VITE_SUPABASE_ANON_KEY: z.string().min(10).default('anon-dummy-key-for-development-mode-testing-12345'),
  VITE_APP_ENV: z.enum(['development', 'test', 'preview', 'production']).default('development'),
  VITE_APP_URL: z.string().url().default('http://localhost:5173'),
  VITE_ENABLE_MOCK_FALLBACK: z.preprocess((val) => val === 'true' || val === true || val === '1', z.boolean()).default(true),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function getValidatedEnv(): EnvConfig {
  const result = envSchema.safeParse(import.meta.env);
  if (!result.success) {
    console.error('Environment validation failed:', result.error.format());
    // In production fail immediately; in dev/test fall back to defaults
    if (import.meta.env.MODE === 'production') {
      throw new Error(`Invalid environment configuration: ${JSON.stringify(result.error.flatten().fieldErrors)}`);
    }
  }
  return result.success ? result.data : envSchema.parse({});
}

export const env = getValidatedEnv();
