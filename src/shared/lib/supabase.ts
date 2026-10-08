import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import { env } from '../config/env';

/**
 * Production Typed Supabase Client
 * 
 * SECURITY:
 * - Restricted strictly to the public Anon / Publishable key.
 * - Service role key is NEVER imported or referenced here.
 * - All queries are bounded by Postgres Row Level Security.
 */
export const supabase = createClient<Database>(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'greenswap-auth-token',
    },
  }
);
