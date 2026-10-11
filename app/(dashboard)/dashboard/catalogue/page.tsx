import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SWAPS, CATEGORIES } from '@/lib/catalogue';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableRow, TableWrap } from '@/components/ui/Table';
import { recordSwap } from '@/app/actions';
import { Button } from '@/components/ui/Button';

export const metadata = { title: 'Swap Catalogue', description: 'Browse the GreenSwap catalogue and record a demo swap.' };

export default async function DashboardCataloguePage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const query = (params.q ?? '').trim().toLowerCase();
  const category = params.category ?? 'All';
  const swaps = SWAPS.filter((swap) => (category === 'All' || swap.category === category) && (!query || (swap.title + ' ' + swap.category + ' ' + swap.impact).toLowerCase().includes(query)));

  return <div className="min-w-0">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">THE COLLECTION / 02</p><h1 className="mt-2 text-3xl font-bold tracking-editorial sm:text-4xl">Swap catalogue</h1><p className="mt-2 text-sm leading-6 text-muted">A structured view of practical ideas, effort and the reason behind each one.</p></div><Link href="/dashboard/explore" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white">New Swap <ArrowUpRight size={15} /></Link></div>
    <form method="get" className="mt-7 flex flex-col gap-3 sm:flex-row"><label className="flex-1"><span className="sr-only">Search catalogue</span><input name="q" defaultValue={params.q} placeholder="Search title, category or benefit…" className="min-h-11 w-full rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-moss/50 focus:ring-4 focus:ring-moss/10" /></label><label><span className="sr-only">Category</span><select name="category" defaultValue={category} className="min-h-11 w-full rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-moss/50 sm:w-44">{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label><Button type="submit" variant="secondary">Apply filters</Button></form>
    <div className="mt-6 flex items-center justify-between"><p className="text-xs text-muted">{swaps.length} items</p><p className="font-mono text-[10px] uppercase tracking-wider text-muted">Reward points are demo-only</p></div>
    <TableWrap className="mt-3"><Table>
      <TableHead><TableRow><th className="px-4 py-3 font-semibold">Swap</th><th className="hidden px-4 py-3 font-semibold sm:table-cell">Category</th><th className="hidden px-4 py-3 font-semibold md:table-cell">Potential benefit</th><th className="hidden px-4 py-3 font-semibold lg:table-cell">Effort</th><th className="px-4 py-3 font-semibold">Reward</th><th className="px-4 py-3"><span className="sr-only">Action</span></th></TableRow></TableHead>
      <TableBody>{swaps.map((swap) => <TableRow key={swap.id}><TableCell><div className="flex min-w-[210px] items-center gap-3"><Image src={swap.image} alt="" width={56} height={48} className="h-12 w-14 rounded-xl bg-[#f0f1e8] object-cover" /><span><span className="block text-sm font-semibold text-ink">{swap.title}</span><span className="mt-1 block max-w-[300px] text-xs leading-5 text-muted">{swap.summary}</span></span></div></TableCell><TableCell className="hidden sm:table-cell"><Badge>{swap.category}</Badge></TableCell><TableCell className="hidden text-xs text-muted md:table-cell">{swap.impact}</TableCell><TableCell className="hidden text-xs text-muted lg:table-cell">{swap.effort}</TableCell><TableCell><span className="whitespace-nowrap text-xs font-semibold text-moss">+{swap.points} pts</span></TableCell><TableCell><form action={recordSwap}><input type="hidden" name="swapId" value={swap.id} /><Button type="submit" size="sm" variant="secondary" aria-label={'Do swap: ' + swap.title}><CheckCircle2 size={14} />Do</Button></form></TableCell></TableRow>)}</TableBody>
    </Table></TableWrap>
    <p className="mt-4 text-xs leading-5 text-muted">The catalogue describes potential benefits, not measured personal carbon savings. See <Link href="/how-it-works" className="font-semibold text-moss underline underline-offset-4">how it works</Link>.</p>
  </div>;
}
