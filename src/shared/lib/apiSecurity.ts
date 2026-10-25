import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * 2. API AUTH: Authenticates Supabase session from request. Returns 401 Response if unauthenticated.
 */
export async function requireApiAuth(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return {
      user: null,
      errorResponse: new Response(
        JSON.stringify({ error: 'Unauthorized: Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }
  return { user, errorResponse: null };
}

/**
 * 8. IDOR PROTECTION: Verifies that the target resource belongs to the requesting user.
 * If not matching, returns 403 Forbidden.
 */
export function verifyOwnership(resourceUserId: string, requestingUserId: string) {
  if (resourceUserId !== requestingUserId) {
    return {
      allowed: false,
      errorResponse: new Response(
        JSON.stringify({ error: 'Forbidden: You do not have permission to access this resource' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }
  return { allowed: true, errorResponse: null };
}

/**
 * 4. INPUT SANITIZATION: Trims whitespace and escapes dangerous HTML characters to prevent XSS.
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * 4. FILE VALIDATION: Ensures uploaded files are images only and under 5MB (5242880 bytes).
 */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const fileUploadSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string().refine((type) => ALLOWED_IMAGE_TYPES.includes(type), {
    message: 'Only image files (JPEG, PNG, WebP, GIF) are permitted.',
  }),
  size: z.number().max(MAX_FILE_SIZE, {
    message: 'File size must not exceed 5MB.',
  }),
});

export function validateImageUpload(file: { name: string; type: string; size: number }) {
  return fileUploadSchema.safeParse(file);
}

/**
 * 4. ZOD INPUT SCHEMAS with automatic trimming and sanitation
 */
export const sanitizedStringSchema = z
  .string()
  .trim()
  .min(1)
  .transform((val) => sanitizeString(val));

export const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(100).transform(sanitizeString),
  email: z.string().trim().email().toLowerCase(),
  subject: z.string().trim().min(3).max(150).transform(sanitizeString),
  message: z.string().trim().min(10).max(3000).transform(sanitizeString),
  captchaToken: z.string().optional(),
});
