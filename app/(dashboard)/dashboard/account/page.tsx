import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowUpRight, BadgeCheck, Leaf, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { safeParseArray } from '@/lib/utils';

type ActivityItem = { id: string; points: number; title: string; createdAt: string };
type Preferences = { displayName?: string; region?: string };
export const metadata = { title: 'My Account', description: 'Demo account overview and personal preferences.' };

export default async function AccountPage() {
  const store = await cookies();
  const pointsRaw = Number.parseInt(store.get('greenswap_points')?.value ?? '120', 10);
  const points = Number.isFinite(pointsRaw) ? pointsRaw : 120;
  const activity = safeParseArray<ActivityItem>(store.get('greenswap_activity')?.value);
  let preferences: Preferences = {};
  try { preferences = JSON.parse(store.get('greenswap_settings')?.value ?? '{}') as Preferences; } catch { preferences = {}; }

  return <div className="min-w-0">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">MEMBER PROFILE / 04</p><h1 className="mt-2 text-3xl font-bold tracking-editorial sm:text-4xl">My Account</h1><p className="mt-2 text-sm leading-6 text-muted">Your demo profile, points and a clear view of what is saved.</p></div><Link href="/dashboard/settings" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white">Edit settings <ArrowUpRight size={15} /></Link></div>
    <section className="mt-7 overflow-hidden rounded-3xl border border-line bg-white"><div className="grid gap-6 bg-gradient-to-r from-[#f2f6ef] to-white p-6 sm:p-8 md:grid-cols-[auto,1fr,auto] md:items-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-green-600 to-emerald-400 text-2xl font-bold text-white shadow-lg shadow-green-700/15">G</span>
      <div><div className="flex flex-wrap items-center gap-2"><h2 className="font-serif text-3xl tracking-tight">{preferences.displayName || 'Green Member'}</h2><BadgeCheck size={17} className="text-moss" /></div><p className="mt-1 text-sm text-muted">demo@greenswap.app</p><p className="mt-3 text-xs text-muted">Region preference: {preferences.region || 'India'}</p></div>
      <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-moss shadow-card"><Sparkles size={17} />{points.toLocaleString('en-IN')} Green Points</span>
    </div>
    <div className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0"><div className="p-5 sm:p-6"><p className="text-xs text-muted">SWAPS RECORDED</p><p className="mt-2 font-mono text-3xl">{activity.length}</p></div><div className="p-5 sm:p-6"><p className="text-xs text-muted">POINTS FROM SWAPS</p><p className="mt-2 font-mono text-3xl">{activity.reduce((total, item) => total + item.points, 0)}</p></div><div className="p-5 sm:p-6"><p className="text-xs text-muted">ACCOUNT STATUS</p><p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={16} className="text-moss" />Demo session</p></div></div></section>
    <div className="mt-5 grid gap-4 md:grid-cols-2"><section className="card-edge p-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ea] text-moss"><UserRound size={18} /></span><h2 className="mt-4 font-serif text-2xl">Profile & preferences</h2><p className="mt-2 text-sm leading-6 text-muted">Tune the name shown in your demo and choose how you want GreenSwap to feel.</p><Link href="/dashboard/settings" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-moss">Manage preferences <ArrowUpRight size={14} /></Link></section><section className="card-edge p-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ea] text-moss"><Leaf size={18} /></span><h2 className="mt-4 font-serif text-2xl">Your activity</h2><p className="mt-2 text-sm leading-6 text-muted">Revisit recorded swaps and see the demo points attached to each action.</p><Link href="/dashboard/activity" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-moss">View my activity <ArrowUpRight size={14} /></Link></section></div>
    <p className="mt-5 text-xs leading-5 text-muted">Demo only: the profile and points shown here are not tied to a production account, payment or verified environmental outcome.</p>
  </div>;
}
