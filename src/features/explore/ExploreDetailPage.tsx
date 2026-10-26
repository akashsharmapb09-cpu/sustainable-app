import { useParams, useLocation, Link } from 'react-router-dom';
import { getExploreItemById, EXPLORE_ITEMS, type ExploreItem } from './exploreData';
import { EXPANDED_SWAPS } from './CataloguePage';
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  ShieldCheck,
  TrendingDown,
  DollarSign,
  Bookmark,
} from 'lucide-react';

export function ExploreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const collectionPath = location.pathname.startsWith('/catalogue/') ? '/catalogue' : '/explore';
  const exploreItem = getExploreItemById(id || '');
  const catalogueItem = EXPANDED_SWAPS.find((candidate) => candidate.id === (id || '').toLowerCase());
  const item: ExploreItem | undefined = exploreItem ?? (catalogueItem ? {
    id: catalogueItem.id,
    title: catalogueItem.title,
    subtitle: `A practical, everyday way to make ${catalogueItem.categoryLabel.toLowerCase()} choices a little more sustainable.`,
    category: catalogueItem.category,
    categoryLabel: catalogueItem.categoryLabel,
    co2Saving: catalogueItem.co2Saving,
    costSaving: catalogueItem.costSaving,
    image: catalogueItem.image.replace(/w=300/, 'w=800'),
    topics: [catalogueItem.category, 'all'],
    difficulty: catalogueItem.category === 'energy' && catalogueItem.id === 'solar-rooftop' ? 'High Impact' : 'Easy',
    timeToImplement: catalogueItem.category === 'transport' ? 'Start with one trip' : 'Start today',
    verifiedBy: 'GreenSwap catalogue estimates; see the methodology for estimate limits',
    description: `This swap focuses on ${catalogueItem.title.toLowerCase()}. Start with a version that fits your home, commute, budget and existing habits, then build consistency over time.`,
    whyItMatters: catalogueItem.category === 'transport'
      ? 'Choosing lower-emission ways to travel can reduce fuel use and the emissions associated with everyday journeys.'
      : catalogueItem.category === 'food'
        ? 'Food choices and avoiding waste can lower the resources and emissions connected to what households buy and consume.'
        : catalogueItem.category === 'energy'
          ? 'Using less energy or choosing efficient technology can reduce household electricity demand and running costs.'
          : catalogueItem.category === 'shopping'
            ? 'Reusing, repairing and buying thoughtfully helps extend product lifetimes and reduce demand for new materials.'
            : catalogueItem.category === 'waste'
              ? 'Keeping useful organic material out of mixed waste can support a more circular household waste routine.'
              : 'Using water thoughtfully helps reduce household water demand and the energy associated with treatment and heating.',
    actionSteps: [
      `Decide where “${catalogueItem.title.toLowerCase()}” can fit naturally into your week.`,
      'Compare the practical cost, time and convenience before making the change.',
      'Try the change consistently for seven days and adjust it to suit your routine.',
    ],
    keyStats: [
      { label: 'Estimated monthly carbon impact', value: catalogueItem.co2Saving.replace(/^Save up to /, '') },
      { label: 'Cost impact', value: catalogueItem.costSaving },
      { label: 'Category', value: catalogueItem.categoryLabel },
    ],
  } : undefined);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] text-[#1B2A20] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-3xl p-8 text-center shadow-lg">
          <Leaf className="w-12 h-12 text-[#2B543A] mx-auto mb-4 opacity-70" />
          <h1 className="font-serif text-2xl font-bold text-[#162A20] mb-2">Item Not Found</h1>
          <p className="text-sm text-[#5A6E61] mb-6">
            We couldn&apos;t find an explore item matching &ldquo;{id}&rdquo;.
          </p>
          <Link
            to={collectionPath}
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full bg-[#162A20] text-white font-medium text-sm hover:bg-[#2B543A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const relatedItems = EXPLORE_ITEMS.filter((other) => other.id !== item.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1B2A20] selection:bg-[#2B543A]/20 transition-colors">
      {/* Top Header */}
      <header className="border-b border-[#E7E2D6] bg-[#F8F6F0]/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to={collectionPath}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#465A4E] hover:text-[#162A20] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Explore</span>
          </Link>

          <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-[#162A20]">
            GreenSwap<span className="text-[#2B543A]">.</span>
          </Link>

          <Link
            to="/dashboard"
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#ECE7DC] text-[#162A20] hover:bg-[#E2DDD0] transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumb path */}
        <nav className="flex items-center gap-2 text-xs text-[#6B7D72] mb-6">
          <Link to={collectionPath} className="hover:underline">Explore</Link>
          <span>/</span>
          <span className="capitalize">{item.categoryLabel}</span>
          <span>/</span>
          <span className="text-[#162A20] font-medium">{item.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          {/* Main Photo Card */}
          <div className="md:col-span-7 rounded-3xl overflow-hidden border border-[#E5E0D5] bg-[#FAF8F5] shadow-md">
            <div className="relative w-full h-72 sm:h-96 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#162A20]/85 backdrop-blur-md text-white">
                {item.categoryLabel}
              </span>
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-[#2B543A] flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2B543A]" />
                Scientifically Verified
              </span>
            </div>
            <div className="p-4 bg-[#F2EDE2]/60 border-t border-[#E5E0D5] flex items-center justify-between text-xs text-[#5A6E61]">
              <span>Source: {item.verifiedBy}</span>
              <span className="font-semibold text-[#2B543A]">{item.difficulty} Effort</span>
            </div>
          </div>

          {/* Key Facts Summary */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2B543A] mb-2">
                <Leaf className="w-3.5 h-3.5" />
                <span>Sustainable Swap</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#162A20] leading-tight mb-3">
                {item.title}
              </h1>
              <p className="text-sm sm:text-base text-[#4A5D50] leading-relaxed">
                {item.subtitle}
              </p>
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FAF8F5] border border-[#E5E0D5] rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B543A] mb-1">
                  <TrendingDown className="w-4 h-4" />
                  <span>Carbon Reduction</span>
                </div>
                <div className="font-serif text-lg font-bold text-[#162A20]">
                  {item.co2Saving}
                </div>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E5E0D5] rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B543A] mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Cost Impact</span>
                </div>
                <div className="font-serif text-lg font-bold text-[#162A20]">
                  {item.costSaving}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                to="/routine"
                className="w-full py-3.5 px-6 rounded-full bg-[#162A20] hover:bg-[#2B543A] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 cursor-pointer text-center"
              >
                <span>Add swap to your daily routine</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/recommendations"
                className="w-full py-3 px-6 rounded-full bg-[#FAF8F5] hover:bg-[#EAE5DA] border border-[#DCD5C7] text-[#162A20] font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer text-center"
              >
                <Bookmark className="w-4 h-4 text-[#2B543A]" />
                <span>Save to your ideas list</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-8 space-y-8">
            {/* Overview */}
            <section className="bg-[#FAF8F5] border border-[#E5E0D5] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-[#162A20] mb-4">
                Why this swap matters
              </h2>
              <p className="text-sm sm:text-base text-[#465A4E] leading-relaxed mb-4">
                {item.description}
              </p>
              <div className="p-4 rounded-2xl bg-[#EAF2ED] border border-[#D5E5DB] text-xs sm:text-sm text-[#1E3B2A] leading-relaxed">
                <strong className="font-semibold block mb-1">Environmental Insight:</strong>
                {item.whyItMatters}
              </div>
            </section>

            {/* Step-by-Step Action Guide */}
            <section className="bg-[#FAF8F5] border border-[#E5E0D5] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-[#162A20] mb-4">
                Step-by-step action plan
              </h2>
              <div className="space-y-4">
                {item.actionSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#162A20] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm sm:text-base text-[#3E5245] leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Stats & Citation Box */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-[#FAF8F5] border border-[#E5E0D5] rounded-3xl p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#162A20] mb-4">
                Expected Annual Impact
              </h3>
              <div className="space-y-3.5">
                {item.keyStats.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between pb-3 border-b border-[#EAE5DA] last:border-b-0 last:pb-0">
                    <span className="text-xs text-[#5A6E61]">{stat.label}</span>
                    <span className="text-xs font-bold text-[#162A20]">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E5E0D5] rounded-3xl p-6 shadow-sm text-xs text-[#5A6E61] space-y-2">
              <div className="font-semibold text-[#162A20] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2B543A]" />
                <span>Peer-Reviewed Science</span>
              </div>
              <p className="leading-relaxed">
                Calculations calibrated against emissions baseline figures from the {item.verifiedBy}.
              </p>
            </div>
          </div>
        </div>

        {/* Related Swaps */}
        <section className="pt-8 border-t border-[#E5E0D5]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#162A20]">
                Other high-impact swaps
              </h2>
              <p className="text-xs sm:text-sm text-[#5A6E61]">
                Pair this with complementary sustainable alternatives.
              </p>
            </div>
            <Link
              to={collectionPath}
              className="text-xs sm:text-sm font-semibold text-[#2B543A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedItems.map((other) => (
              <Link
                key={other.id}
                to={`${collectionPath}/${other.id}`}
                className="group block bg-[#FAF8F5] border border-[#E5E0D5] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 cursor-pointer flex flex-col"
              >
                <div className="relative w-full h-36 overflow-hidden bg-[#EAE5DA]">
                  <img
                    src={other.image}
                    alt={other.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#162A20]/80 text-white">
                    {other.categoryLabel}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#162A20] group-hover:text-[#2B543A] transition-colors line-clamp-1 mb-1">
                      {other.title}
                    </h3>
                    <p className="text-xs text-[#5A6E61] line-clamp-2 mb-3">
                      {other.subtitle}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#EAE5DA] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#2B543A]">{other.co2Saving}</span>
                    <span className="font-semibold text-[#162A20] group-hover:translate-x-1 transition-transform flex items-center">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
