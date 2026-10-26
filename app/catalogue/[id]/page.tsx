'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Bookmark, DollarSign, Leaf, ShieldCheck, TrendingDown } from 'lucide-react';
import { EXPANDED_SWAPS } from '@/features/explore/CataloguePage';

interface Props {
  params: { id: string };
}

export default function CatalogueDetailPage({ params }: Props) {
  const item = EXPANDED_SWAPS.find((candidate) => candidate.id === params.id.toLowerCase());

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] text-[#1B2A20] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-3xl p-8 text-center shadow-lg">
          <Leaf className="w-12 h-12 text-[#2B543A] mx-auto mb-4 opacity-70" />
          <h1 className="font-serif text-2xl font-bold text-[#162A20] mb-2">Catalogue item not found</h1>
          <p className="text-sm text-[#5A6E61] mb-6">We couldn&apos;t find a catalogue swap matching &ldquo;{params.id}&rdquo;.</p>
          <Link href="/catalogue" className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full bg-[#162A20] text-white font-medium text-sm hover:bg-[#2B543A] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1B2A20] selection:bg-[#2B543A]/20">
      <header className="sticky top-0 z-30 border-b border-[#E7E2D6] bg-[#F8F6F0]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/catalogue" className="group inline-flex items-center gap-2 text-sm font-medium text-[#465A4E] hover:text-[#162A20]">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Back to Catalogue
          </Link>
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#162A20]">GreenSwap<span className="text-[#2B543A]">.</span></Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#6B7D72]">
          <Link href="/catalogue" className="hover:underline">Catalogue</Link><span>/</span>
          <span>{item.categoryLabel}</span><span>/</span><span className="font-medium text-[#162A20]">{item.title}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          <section className="overflow-hidden rounded-3xl border border-[#E5E0D5] bg-[#FAF8F5] shadow-md md:col-span-7">
            <div className="relative h-72 w-full overflow-hidden sm:h-96">
              <img src={item.image.replace(/w=300/, 'w=800')} alt={item.title} className="h-full w-full object-cover" />
              <span className="absolute left-4 top-4 rounded-full bg-[#162A20]/85 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">{item.categoryLabel}</span>
              <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#2B543A] shadow-sm"><ShieldCheck className="h-3.5 w-3.5" /> Sustainable swap</span>
            </div>
            <div className="border-t border-[#E5E0D5] bg-[#F2EDE2]/60 p-4 text-xs text-[#5A6E61]">Choose the version that fits your home, commute, budget, and routine.</div>
          </section>

          <section className="flex flex-col gap-6 md:col-span-5">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2B543A]"><Leaf className="h-3.5 w-3.5" /> Sustainable swap</div>
              <h1 className="mb-3 font-serif text-3xl font-bold leading-tight text-[#162A20] sm:text-4xl">{item.title}</h1>
              <p className="text-sm leading-relaxed text-[#4A5D50]">A practical, everyday way to make {item.categoryLabel.toLowerCase()} choices more sustainable. Start small, find a version that fits your life, and build consistency over time.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-4 shadow-sm"><div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#2B543A]"><TrendingDown className="h-4 w-4" /> Carbon impact</div><p className="font-serif text-lg font-bold text-[#162A20]">{item.co2Saving}</p></div>
              <div className="rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-4 shadow-sm"><div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#2B543A]"><DollarSign className="h-4 w-4" /> Cost impact</div><p className="font-serif text-lg font-bold text-[#162A20]">{item.costSaving}</p></div>
            </div>
            <div className="flex flex-col gap-3 pt-1">
              <Link href="/routine" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#162A20] px-6 py-3.5 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#2B543A]">Add swap to your daily routine <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/recommendations" className="flex w-full items-center justify-center gap-2 rounded-full border border-[#DCD5C7] bg-[#FAF8F5] px-6 py-3 text-center text-sm font-medium text-[#162A20] transition-colors hover:bg-[#EAE5DA]"><Bookmark className="h-4 w-4 text-[#2B543A]" /> Save to your ideas list</Link>
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-3xl border border-[#E5E0D5] bg-[#FAF8F5] p-6 shadow-sm sm:p-8">
          <h2 className="mb-3 font-serif text-2xl font-bold text-[#162A20]">Why this swap matters</h2>
          <p className="leading-relaxed text-[#465A4E]">This swap focuses on {item.title.toLowerCase()}. Compare the practical cost, time, and convenience before changing your routine; then try it consistently for seven days and adjust it to suit your needs.</p>
          <div className="mt-5 rounded-2xl border border-[#D5E5DB] bg-[#EAF2ED] p-4 text-sm leading-relaxed text-[#1E3B2A]">Lower-impact everyday choices can reduce resource use and associated emissions. Actual results depend on how often you make the swap and the alternative it replaces.</div>
        </section>
      </main>
    </div>
  );
}