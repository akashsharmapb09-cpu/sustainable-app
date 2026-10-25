import { getSupabaseServerClient } from '../../shared/lib/supabaseServer';

/**
 * 11. ADMIN LOG: Records an audit trail entry in the admin_logs table whenever an administrative action occurs.
 */
export async function recordAdminLog({
  adminId,
  action,
  targetResource,
  details = {},
  ipAddress,
  userAgent,
}: {
  adminId: string;
  action: string;
  targetResource?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('admin_logs').insert({
      admin_id: adminId,
      action,
      target_resource: targetResource,
      ip_address: ipAddress,
      user_agent: userAgent,
      details,
      created_at: new Date().toISOString(),
    });

    if (error) {
      // Admin log insertion failed
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
