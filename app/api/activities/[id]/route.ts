import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseServerClient } from '@/shared/lib/supabaseServer';
import { sanitizeString } from '@/shared/lib/apiSecurity';

const updateActivitySchema = z.object({
  quantity: z.number().positive().max(10000).optional(),
  unit: z.string().trim().min(1).max(20).transform(sanitizeString).optional(),
  frequency_per_week: z.number().min(0.1).max(28).optional(),
  notes: z.string().trim().max(500).transform(sanitizeString).optional(),
});

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = params;
  const authHeader = request.headers.get('authorization');
  const supabase = getSupabaseServerClient(authHeader);

  // 2. API AUTH: Check user authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 5. SQL: Parameterized query to retrieve resource
  const { data: activity, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !activity) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
  }

  // 8. IDOR: Verify resource belongs to requesting user
  if (activity.user_id !== user.id) {
    return NextResponse.json(
      { error: 'Forbidden: You do not have permission to view this resource' },
      { status: 403 }
    );
  }

  return NextResponse.json({ activity });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = params;
  const authHeader = request.headers.get('authorization');
  const supabase = getSupabaseServerClient(authHeader);

  // 2. API AUTH: Check user authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 8. IDOR Check: Fetch existing item to verify ownership before modification
  const { data: existing, error: fetchError } = await supabase
    .from('activity_logs')
    .select('user_id')
    .eq('id', id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
  }

  if (existing.user_id !== user.id) {
    return NextResponse.json(
      { error: 'Forbidden: You cannot modify this resource' },
      { status: 403 }
    );
  }

  // 4. INPUT VALIDATION: Validate and sanitize payload with Zod
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parseResult = updateActivitySchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parseResult.error.flatten() },
      { status: 422 }
    );
  }

  // 5. SQL: Parameterized update query
  const { data: updated, error: updateError } = await supabase
    .from('activity_logs')
    .update(parseResult.data)
    .eq('id', id)
    .eq('user_id', user.id) // Dual-defense ownership constraint
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }

  return NextResponse.json({ activity: updated });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = params;
  const authHeader = request.headers.get('authorization');
  const supabase = getSupabaseServerClient(authHeader);

  // 2. API AUTH
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 8. IDOR check
  const { data: existing } = await supabase
    .from('activity_logs')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
  }

  if (existing.user_id !== user.id) {
    return NextResponse.json(
      { error: 'Forbidden: You cannot delete this resource' },
      { status: 403 }
    );
  }

  // 5. SQL: Parameterized delete
  await supabase
    .from('activity_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  return NextResponse.json({ success: true });
}
