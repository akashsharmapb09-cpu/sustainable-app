import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import { SWAPS, CATEGORIES } from '@/lib/catalogue';
import { Badge } from '@/components/ui/Badge';

export const metadata = { title: 'Explore sustainable swaps', description: 'Browse doable changes for food, transport, home, shopping and waste.' };

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const query = (params.q ?? '').trim().toLowerCase();
  const category = params.category ?? 'All';
  const swaps = SWAPS.filter((swap) => (category === 'All' || swap.category === category) && (!query || (swap.title + ' ' + swap.summary + ' ' + swap.category).toLowerCase().includes(query)));

  return <section className="container-shell py-12 sm:py-16">
    <p className="eyebrow">EXPLORE / FIND YOUR NEXT MOVE</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[.97] tracking-editorial sm:text-6xl lg:text-7xl">Small swaps. A little more breathing room.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted">Choose an everyday change that fits your situation. Each card includes context so you can decide what makes sense for you.</p>
    <form method="get" className="mt-8 flex flex-col gap-3 sm:flex-row"><label className="relative min-w-0 flex-1"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><span className="sr-only">Search swaps</span><input name="q" defaultValue={params.q} placeholder="Search food, travel, repair…" className="min-h-12 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm outline-none focus:border-moss/50 focus:ring-4 focus:ring-moss/10" /></label><button className="min-h-12 rounded-full bg-ink px-5 text-sm font-semibold text-white">Search</button></form>
    <nav aria-label="Swap categories" className="mt-4 flex flex-wrap gap-2">{CATEGORIES.map((item) => <Link key={item} href={'/explore?' + new URLSearchParams({ category: item, q: params.q ?? '' }).toString()} aria-current={category === item ? 'page' : undefined} className={'rounded-full border px-4 py-2 text-xs font-semibold transition ' + (category === item ? 'border-ink bg-ink text-white' : 'border-line bg-white text-muted hover:text-ink')}>{item}</Link>)}</nav>
    <div className="mt-8 flex items-center justify-between"><p className="text-xs text-muted">{swaps.length} ideas to explore</p><Link href="/methodology" className="text-xs font-semibold text-moss underline underline-offset-4">How guidance is assessed</Link></div>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{swaps.map((swap) => <article key={swap.id} className="card-edge flex min-w-0 flex-col overflow-hidden"><div className="relative h-48 bg-[#f0f1e8]"><Image src={swap.image} alt={swap.imageAlt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover" /></div><div className="flex flex-1 flex-col p-5"><div className="flex flex-wrap items-center justify-between gap-2"><Badge>{swap.category}</Badge><span className="text-[11px] text-muted">{swap.effort} effort</span></div><h2 className="mt-4 font-serif text-2xl tracking-tight">{swap.title}</h2><p className="mt-2 flex-1 text-sm leading-6 text-muted">{swap.summary}</p><p className="mt-4 text-xs leading-5 text-muted"><strong className="text-ink">Potential benefit: </strong>{swap.impact}. {swap.evidence}</p><Link href="/dashboard/explore" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-moss-dark">Open in the dashboard <ArrowUpRight size={14} /></Link></div></article>)}</div>
  </section>;
}
