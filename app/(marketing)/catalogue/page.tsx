import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ListFilter } from 'lucide-react';
import { SWAPS } from '@/lib/catalogue';
import { Table, TableBody, TableCell, TableHead, TableRow, TableWrap } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export const metadata = { title: 'Catalogue', description: 'The GreenSwap catalogue of small, practical lifestyle alternatives.' };

export default function CataloguePage() {
  return <section className="container-shell py-12 sm:py-16">
    <p className="eyebrow">CATALOGUE / THE COLLECTION</p><h1 className="mt-4 font-serif text-5xl tracking-editorial sm:text-6xl">A clear view of the options.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted">Compare everyday actions by category, effort and the kind of change they support. Points are demo rewards, not a measure of environmental value.</p>
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4"><div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs text-muted"><ListFilter size={14} />{SWAPS.length} listed actions</div><Link href="/dashboard/catalogue" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white">Open full catalogue <ArrowUpRight size={14} /></Link></div>
    <TableWrap className="mt-6"><Table><TableHead><TableRow><th className="px-4 py-3 font-semibold">Action</th><th className="px-4 py-3 font-semibold">Category</th><th className="hidden px-4 py-3 font-semibold sm:table-cell">Potential benefit</th><th className="hidden px-4 py-3 font-semibold md:table-cell">Effort</th><th className="px-4 py-3 font-semibold"><span className="sr-only">Open</span></th></TableRow></TableHead><TableBody>{SWAPS.map((swap) => <TableRow key={swap.id}><TableCell><div className="flex min-w-[220px] items-center gap-3"><Image src={swap.image} alt="" width={56} height={48} className="h-12 w-14 rounded-xl bg-[#f0f1e8] object-cover" /><span><span className="block font-semibold">{swap.title}</span><span className="mt-1 block max-w-sm text-xs leading-5 text-muted">{swap.summary}</span></span></div></TableCell><TableCell><Badge>{swap.category}</Badge></TableCell><TableCell className="hidden text-xs text-muted sm:table-cell">{swap.impact}</TableCell><TableCell className="hidden text-xs text-muted md:table-cell">{swap.effort}</TableCell><TableCell><Link href="/dashboard/explore" className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-moss">Try it <ArrowUpRight size={13} /></Link></TableCell></TableRow>)}</TableBody></Table></TableWrap>
    <p className="mt-5 text-xs leading-5 text-muted">The catalogue is evolving. Advice is indicative and depends on context; read <Link href="/methodology" className="font-semibold text-moss underline underline-offset-4">methodology and source notes</Link> before interpreting outcomes.</p>
  </section>;
}
