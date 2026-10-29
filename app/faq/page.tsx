'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, HelpCircle, BookOpen, Mail } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    category: 'General',
    q: 'What is GreenSwap?',
    a: 'GreenSwap is an open, evidence-based platform designed to help households identify, evaluate, and adopt high-impact lifestyle swaps that reduce carbon emissions and household expenditures.',
  },
  {
    category: 'General',
    q: 'Is GreenSwap free to use?',
    a: 'Yes, GreenSwap is completely free and open for public educational and household use. We do not sell user data or run targeted commercial advertisements.',
  },
  {
    category: 'Calculations',
    q: 'How do you calculate CO2e savings?',
    a: 'Our calculations are based on lifecycle assessment (LCA) emission factors published by official bodies like the UK DEFRA 2024, US EPA eGRID, and the Central Electricity Authority of India. We apply deterministic Multi-Criteria Decision Analysis (MCDA) rather than speculative guesswork.',
  },
  {
    category: 'Calculations',
    q: 'Can I change my regional electricity grid factor?',
    a: 'Yes, in your Profile & Settings page, you can choose between regional grid emission models such as India (CEA Baseline), United Kingdom (DEFRA), and United States (EPA eGRID).',
  },
  {
    category: 'Account & Privacy',
    q: 'Is my data stored securely?',
    a: 'GreenSwap follows privacy-by-design standards compliant with GDPR and India DPDP principles. Your habit logs, preferences, and activity entries are stored securely and never shared with third-party advertisers.',
  },
  {
    category: 'Routine & Plan',
    q: 'How does the 7-day routine plan work?',
    a: 'The 7-day routine breaks sustainable habits down into manageable daily milestones across transportation, diet, and energy reduction. You can check off each day as you build consistency.',
  },
  {
    category: 'Contributions',
    q: 'How can I suggest a new eco swap or provide feedback?',
    a: 'You can submit suggestions directly through our Contact page or discuss calculation models with our engineering team.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1c2e24]">
      {/* Top Bar */}
      <header className="border-b border-[#e2dacb] bg-[#ede5d8]/80 backdrop-blur-sm px-6 py-4 md:px-12 sticky top-0 z-20">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#4a6b57] hover:text-[#162a20] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to GreenSwap
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/methodology"
              className="text-xs font-mono text-[#5b7566] hover:text-[#162a20] underline transition-colors"
            >
              Calculation Methodology →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12 md:px-12 space-y-8">
        {/* Hero */}
        <div className="border-b border-[#e2dacb] pb-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider bg-[#dbe8dc] text-[#162a20] border border-[#bcd3be]">
              <HelpCircle className="h-3.5 w-3.5 text-[#2c5e3f]" />
              HELP &amp; SUPPORT
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#162a20]">
            Frequently Asked Questions
          </h1>
          <p className="font-sans text-sm md:text-base text-[#4a5f51] leading-relaxed">
            Everything you need to know about GreenSwap, carbon footprint formulas, swap catalogs, and our mission.
          </p>

          {/* Search Box */}
          <div className="pt-2">
            <input
              type="text"
              placeholder="Search questions (e.g. emissions, routine, privacy)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#DFD7CA] bg-[#FAF8F4] text-[#1c2e24] text-sm focus:outline-none focus:border-[#162a20] transition-colors"
            />
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <p className="text-sm text-[#6f8275] py-8 text-center">
              No matching questions found. Try a different keyword or{' '}
              <Link href="/contact" className="underline font-semibold">
                contact us
              </Link>
              .
            </p>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-[#DFD7CA] bg-[#FAF8F4] overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-serif text-base md:text-lg font-semibold text-[#162a20] hover:bg-[#f0e8dc] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#4a6b57] transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm md:text-base text-[#4a5f51] leading-relaxed border-t border-[#ede5d8] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Cross Link Footer Card */}
        <div className="rounded-2xl border border-[#bcd3be] bg-[#dbe8dc]/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#162a20]">Have more detailed scientific questions?</h3>
            <p className="text-sm text-[#4a5f51] mt-0.5">
              Explore our comprehensive calculation methodology and primary data sources.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#162a20] text-[#FAF8F4] text-xs font-semibold hover:bg-[#234333] transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" /> Methodology
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#162a20] text-[#162a20] text-xs font-semibold hover:bg-[#162a20]/10 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" /> Contact
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
