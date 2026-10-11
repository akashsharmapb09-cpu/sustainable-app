import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Clock3, Search, Sparkles } from 'lucide-react';
import { SWAPS, CATEGORIES } from '@/lib/catalogue';
import { Badge } from '@/components/ui/Badge';
import { recordSwap } from '@/app/actions';
import { Button } from '@/components/ui/Button';

export const metadata = { title: 'Explore Swaps', description: 'Find a small sustainable swap that fits your routine.' };

export default async function DashboardExplorePage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const query = (params.q ?? '').trim().toLowerCase();
  const category = params.category ?? 'All';
  const swaps = SWAPS.filter((swap) => (category === 'All' || swap.category === category) && (!query || (swap.title + ' ' + swap.summary + ' ' + swap.category).toLowerCase().includes(query)));

  return <div className="min-w-0">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">YOUR NEXT GOOD MOVE / 01</p><h1 className="mt-2 text-3xl font-bold tracking-editorial sm:text-4xl">Explore swaps</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Practical actions, honest context and small rewards. Choose one that feels doable today.</p></div><Link href="/dashboard/catalogue" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-moss-dark">New Swap <ArrowUpRight size={15} /></Link></div>
    <section className="mt-8 rounded-3xl bg-[#f2f5ef] p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">THE SMALL-STEP RULE</p><h2 className="mt-2 max-w-xl font-serif text-2xl tracking-tight sm:text-3xl">Better beats perfect.</h2></div><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-moss shadow-card"><Sparkles size={25} /></div></div><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Impact varies by region, products and habits. Treat the notes as guidance, not a measured personal carbon result. Demo points are only for exploring the flow.</p></section>
    <form method="get" className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><label className="relative block min-w-0 flex-1"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><span className="sr-only">Search swaps</span><input type="search" name="q" defaultValue={params.q} placeholder="Search swaps, habits or topics…" className="min-h-12 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm outline-none transition focus:border-moss/50 focus:ring-4 focus:ring-moss/10" /></label><Button type="submit" variant="secondary">Search swaps</Button></form>
    <nav aria-label="Filter by category" className="mt-4 flex flex-wrap gap-2">{CATEGORIES.map((item) => <Link key={item} href={'/dashboard/explore?' + new URLSearchParams({ category: item, q: params.q ?? '' }).toString()} aria-current={category === item ? 'page' : undefined} className={'rounded-full border px-4 py-2 text-xs font-semibold transition ' + (category === item ? 'border-ink bg-ink text-white' : 'border-line bg-white text-muted hover:border-moss/40 hover:text-ink')}>{item}</Link>)}</nav>
    <div className="mt-6 flex items-center justify-between gap-4"><p className="text-xs text-muted">{swaps.length} practical ideas</p><Link href="/dashboard/catalogue" className="text-xs font-semibold text-moss hover:underline">View full catalogue →</Link></div>
    {swaps.length ? <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{swaps.map((swap, index) => <article key={swap.id} className="card-edge flex min-w-0 flex-col overflow-hidden">
      <div className="relative h-[170px] overflow-hidden bg-[#f0f1e8]"><Image src={swap.image} alt={swap.imageAlt} fill priority={index < 2} sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw" className="object-cover" /></div>
      <div className="flex flex-1 flex-col p-5"><div className="flex flex-wrap items-center justify-between gap-2"><Badge>{swap.category}</Badge><span className="inline-flex items-center gap-1 text-[11px] text-muted"><Clock3 size={12} />{swap.effort}</span></div><h2 className="mt-4 font-serif text-2xl leading-tight tracking-tight">{swap.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{swap.summary}</p><p className="mt-4 rounded-xl bg-paper px-3 py-3 text-xs leading-5 text-muted"><strong className="text-ink">Why it can help: </strong>{swap.evidence}</p><div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4"><span className="text-xs font-semibold text-moss">+{swap.points} demo points</span><form action={recordSwap}><input type="hidden" name="swapId" value={swap.id} /><Button type="submit" size="sm">Do swap <CheckCircle2 size={14} /></Button></form></div></div>
    </article>)}</div> : <div className="mt-6 rounded-3xl border border-dashed border-line bg-white p-12 text-center"><p className="font-serif text-2xl">No swaps match that search.</p><Link href="/dashboard/explore" className="mt-4 inline-block text-sm font-semibold text-moss underline underline-offset-4">Clear filters</Link></div>}
  </div>;
}
