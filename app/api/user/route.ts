import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/shared/lib/supabaseServer';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const supabase = getSupabaseServerClient(authHeader);

  // 2. API AUTH: Authenticate user using Supabase auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized: Authentication required' },
      { status: 401 }
    );
  }

  // 5. SQL: Use parameterized queries through the Supabase client
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, region, diet, commute_mode, created_at')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      profile: profile || null,
    },
  });
}
