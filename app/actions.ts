'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { findSwap } from '@/lib/catalogue';
import { safeParseArray } from '@/lib/utils';

type ActivityItem = { id: string; swapId: string; title: string; points: number; createdAt: string };
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
};

export async function startDemoSession(formData: FormData) {
  const store = await cookies();
  store.set('greenswap_session', 'demo-session-v1', cookieOptions);
  const submittedNext = String(formData.get('next') ?? '');
  const next = submittedNext.startsWith('/dashboard/') && !submittedNext.startsWith('//') ? submittedNext : '/dashboard/explore';
  redirect(next);
}

export async function recordSwap(formData: FormData) {
  const store = await cookies();
  if (store.get('greenswap_session')?.value !== 'demo-session-v1') redirect('/login?next=%2Fdashboard%2Fexplore');
  const swap = findSwap(String(formData.get('swapId') ?? ''));
  if (!swap) redirect('/dashboard/explore?error=unknown-swap');

  const activity = safeParseArray<ActivityItem>(store.get('greenswap_activity')?.value);
  const event: ActivityItem = { id: crypto.randomUUID(), swapId: swap.id, title: swap.title, points: swap.points, createdAt: new Date().toISOString() };
  store.set('greenswap_activity', JSON.stringify([event, ...activity].slice(0, 16)), cookieOptions);
  const previous = Number.parseInt(store.get('greenswap_points')?.value ?? '120', 10);
  const total = Number.isFinite(previous) ? Math.max(0, previous) + swap.points : 120 + swap.points;
  store.set('greenswap_points', String(total), cookieOptions);
  redirect('/dashboard/activity?logged=1');
}

export async function saveDashboardSettings(formData: FormData) {
  const store = await cookies();
  if (store.get('greenswap_session')?.value !== 'demo-session-v1') redirect('/login?next=%2Fdashboard%2Fsettings');
  const safeSettings = {
    displayName: String(formData.get('displayName') ?? 'Green Member').trim().slice(0, 50) || 'Green Member',
    region: String(formData.get('region') ?? 'India').slice(0, 80),
    emailUpdates: formData.get('emailUpdates') === 'on',
    weeklySummary: formData.get('weeklySummary') === 'on',
    privacyMode: formData.get('privacyMode') === 'on',
  };
  store.set('greenswap_settings', JSON.stringify(safeSettings), cookieOptions);
  redirect('/dashboard/settings?tab=general&saved=1');
}

export async function subscribeNewsletter(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect('/?newsletter=invalid');
  // No mailing-list provider is configured. Do not persist the submitted address or claim it was subscribed.
  redirect('/?newsletter=unavailable');
}
