import Link from 'next/link';
import { cookies } from 'next/headers';
import { Activity, ArrowUpRight, CheckCircle2, Clock3, Sparkles } from 'lucide-react';
import { safeParseArray } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

type ActivityItem = { id: string; swapId: string; title: string; points: number; createdAt: string };
export const metadata = { title: 'My Activity', description: 'Your recorded demo swaps and Green Points timeline.' };

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ logged?: string }> }) {
  const params = await searchParams;
  const store = await cookies();
  const activity = safeParseArray<ActivityItem>(store.get('greenswap_activity')?.value);
  const pointsRaw = Number.parseInt(store.get('greenswap_points')?.value ?? '120', 10);
  const points = Number.isFinite(pointsRaw) ? pointsRaw : 120;

  return <div className="min-w-0">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">YOUR HISTORY / 03</p><h1 className="mt-2 text-3xl font-bold tracking-editorial sm:text-4xl">My Activity</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Every action starts small. Recorded swaps and earned demo points are stored in this browser’s secure demo cookies.</p></div><Link href="/dashboard/explore" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white">New Swap <ArrowUpRight size={15} /></Link></div>
    {params.logged === '1' && <div role="status" className="mt-6 flex items-center gap-3 rounded-2xl border border-[#d6e7d0] bg-[#f1f7ee] p-4 text-sm text-moss"><CheckCircle2 size={18} />Swap recorded. Your demo points have been updated.</div>}
    <div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="rounded-3xl bg-moss-dark p-5 text-white"><p className="text-xs text-white/70">TOTAL DEMO POINTS</p><p className="mt-3 font-mono text-4xl">{points.toLocaleString('en-IN')}</p><p className="mt-2 text-xs text-white/60">Illustrative balance</p></div><div className="card-edge p-5"><p className="text-xs text-muted">SWAPS LOGGED</p><p className="mt-3 font-mono text-4xl">{activity.length}</p><p className="mt-2 text-xs text-muted">This demo session</p></div><div className="card-edge p-5"><p className="text-xs text-muted">POINTS EARNED HERE</p><p className="mt-3 font-mono text-4xl">{activity.reduce((total, item) => total + item.points, 0)}</p><p className="mt-2 text-xs text-muted">From recorded swaps</p></div></div>
    <section className="mt-8 rounded-3xl border border-line bg-white p-5 sm:p-8"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ea] text-moss"><Activity size={18} /></span><div><h2 className="text-lg font-bold">Your timeline</h2><p className="mt-1 text-xs text-muted">Newest first · local demo history</p></div></div>
      {activity.length ? <ol className="mt-8 space-y-0">{activity.map((item, index) => <li key={item.id} className="relative flex gap-4 pb-8 last:pb-0"><div className="relative flex w-8 shrink-0 justify-center"><span className="z-10 grid h-8 w-8 place-items-center rounded-full border border-[#dce8d7] bg-[#f2f7ef] text-moss"><CheckCircle2 size={15} /></span>{index < activity.length - 1 && <span className="absolute bottom-0 top-8 w-px bg-line" />}</div><div className="min-w-0 flex-1 rounded-2xl border border-line p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{item.title}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-muted"><Clock3 size={12} />{new Date(item.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p></div><Badge className="border-[#dce8d7] bg-[#f2f7ef] text-moss">+{item.points} points</Badge></div><p className="mt-3 text-xs leading-5 text-muted">This is a demo record. It does not represent a verified carbon saving.</p></div></li>)}</ol> : <div className="py-14 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-paper text-moss"><Sparkles size={21} /></span><h3 className="mt-5 font-serif text-2xl">Your first swap starts here.</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">Pick one action from the catalogue. It will appear here with the demo points for the journey.</p><Link href="/dashboard/explore" className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Explore swaps <ArrowUpRight size={14} /></Link></div>}
    </section>
  </div>;
}
