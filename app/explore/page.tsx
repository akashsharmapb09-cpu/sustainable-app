'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { EXPLORE_ITEMS, ExploreItem } from '@/features/explore/exploreData';
import { 
  ArrowLeft, 
  ArrowRight, 
  Leaf, 
  CheckCircle2, 
  Sparkles, 
  TrendingDown, 
  ShieldCheck,
  Compass
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'transport', label: 'Transport' },
  { id: 'food', label: 'Food' },
  { id: 'energy', label: 'Energy' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'waste', label: 'Waste' },
  { id: 'home', label: 'Home' },
];

const TOPIC_METAS: Record<string, { title: string; desc: string; bannerBg: string }> = {
  lifestyle: {
    title: 'Everyday lifestyle',
    desc: 'Simple habits that fit your routine for a tangible everyday carbon reduction.',
    bannerBg: 'linear-gradient(135deg, #1b3827 0%, #12291d 100%)',
  },
  'works-for-you': {
    title: 'What works for you',
    desc: 'Personalised food and lifestyle alternatives configured for your preferences.',
    bannerBg: 'linear-gradient(135deg, #3d2c1d 0%, #291e13 100%)',
  },
  'care-about': {
    title: 'Topics you care about',
    desc: 'Clean power, renewables, and high-impact interventions that make the biggest difference.',
    bannerBg: 'linear-gradient(135deg, #17353f 0%, #0e2229 100%)',
  },
  choices: {
    title: 'Your everyday choices',
    desc: 'Smarter alternatives for daily purchases, circular economy, and low-waste living.',
    bannerBg: 'linear-gradient(135deg, #2b3320 0%, #1c2215 100%)',
  },
};

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const currentTopic = activeTopic ? TOPIC_METAS[activeTopic] : null;

  const filteredItems = useMemo(() => {
    return EXPLORE_ITEMS.filter((item) => {
      const matchCat =
        activeCategory === 'all' ||
        item.category === activeCategory ||
        (activeCategory === 'home' && item.topics.includes('home'));

      const matchTopic = !activeTopic || item.topics.includes(activeTopic);

      return matchCat && matchTopic;
    });
  }, [activeCategory, activeTopic]);

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1B2A20] selection:bg-[#2B543A]/20 transition-colors">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#E7E2D6] bg-[#F8F6F0]/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-[#465A4E] hover:text-[#1B2A20] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#162A20]">
            GreenSwap<span className="text-[#2B543A]">.</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF2ED] text-[#2B543A]">
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Topic Spotlight Banner (if active) */}
        {currentTopic && (
          <div
            className="rounded-2xl p-6 sm:p-8 mb-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-fadeIn"
            style={{ background: currentTopic.bannerBg }}
          >
            <div>
              <span className="inline-block text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 mb-2">
                Selected Topic
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
                {currentTopic.title}
              </h2>
              <p className="text-white/80 text-sm max-w-xl">
                {currentTopic.desc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTopic(null)}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-white/15 hover:bg-white/25 transition-colors whitespace-nowrap"
            >
              Show all topics ✕
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-start justify-between relative mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2B543A] mb-2">
              <Leaf className="w-3.5 h-3.5" />
              <span>Catalog & Alternatives</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#162A20] leading-tight">
              Discover <span className="italic font-normal text-[#2B543A]">a better everyday.</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#5A6E61] max-w-2xl leading-relaxed">
              Explore vetted sustainable swaps backed by published environmental benchmarks. Click any card to view savings, step-by-step guides, and verify the science.
            </p>
          </div>

          {/* Botanical Decorative Leaf Watermark */}
          <div className="hidden sm:block opacity-20 pointer-events-none select-none w-20 h-20 text-[#2B543A]">
            <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
              <path
                d="M20 100 C40 80 50 40 100 20 C80 50 40 70 20 100Z"
                fill="currentColor"
              />
              <path
                d="M30 60 C50 50 70 40 90 25"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveCategory(id)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                activeCategory === id
                  ? 'bg-[#162A20] text-white shadow-sm font-semibold'
                  : 'bg-[#ECE7DC] text-[#465A4E] hover:bg-[#E2DDD0] hover:text-[#162A20]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Explore Cards Grid with Next.js Link & cursor-pointer hover effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/explore/${item.id}`}
              className="group block bg-[#FAF8F5] border border-[#E5E0D5] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 cursor-pointer flex flex-col"
            >
              {/* Image Container with zoom on hover */}
              <div className="relative w-full h-48 overflow-hidden bg-[#EAE5DA]">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#162A20]/80 backdrop-blur-md text-white">
                  {item.categoryLabel}
                </span>
                <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-md text-[#2B543A] flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3 text-[#2B543A]" />
                  Verified
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#162A20] group-hover:text-[#2B543A] transition-colors leading-snug mb-2">
                    {item.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5A6E61] line-clamp-2 leading-relaxed mb-4">
                    {item.subtitle}
                  </p>
                </div>

                {/* Key Metrics Footnote */}
                <div className="pt-3 border-t border-[#EAE5DA] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#2B543A]">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      {item.co2Saving}
                    </span>
                    <span className="text-[#6B7D72] font-medium">
                      {item.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-[#5A6E61]">
                    <span>{item.costSaving}</span>
                    <span className="inline-flex items-center gap-1 text-[#2B543A] font-semibold group-hover:translate-x-1 transition-transform">
                      View details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 px-4 bg-[#FAF8F5] border border-dashed border-[#DFD8CC] rounded-2xl">
            <Leaf className="w-8 h-8 text-[#5A6E61] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-lg font-bold text-[#162A20]">No swaps found</h3>
            <p className="text-sm text-[#5A6E61] mt-1 mb-4">Try selecting a different category or clearing filters.</p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setActiveTopic(null);
              }}
              className="px-4 py-2 rounded-full bg-[#162A20] text-white text-xs font-semibold hover:bg-[#2B543A] transition-colors cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
