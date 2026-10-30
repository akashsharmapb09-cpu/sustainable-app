import { useState } from 'react';
import { Search, SlidersHorizontal, Check, Leaf, LoaderCircle } from 'lucide-react';
import { useAlternatives, useUserActions, useUpsertUserAction } from '../../shared/lib/hooks/useData';
import { useToast } from '../../shared/ui';

const ALTERNATIVE_IMAGES: Record<string, string> = {
  'alt-metro-commute': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&auto=format&fit=crop&q=85',
  'alt-electric-2w': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&auto=format&fit=crop&q=85',
  'alt-shared-e-rickshaw': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=900&auto=format&fit=crop&q=85',
  'alt-carpool-work': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=900&auto=format&fit=crop&q=85',
  'alt-bicycle-short-trips': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=900&auto=format&fit=crop&q=85',
  'alt-train-intercity': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=900&auto=format&fit=crop&q=85',
  'alt-bldc-ceiling-fans': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=85',
  'alt-ac-26-degrees': 'https://images.unsplash.com/photo-1631545806609-3c7c8a0e28d1?w=900&auto=format&fit=crop&q=85',
  'alt-induction-cooktop': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900&auto=format&fit=crop&q=85',
  'alt-solar-water-heater': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=900&auto=format&fit=crop&q=85',
  'alt-meatless-weekdays': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&auto=format&fit=crop&q=85',
  'alt-millets-swap-rice': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=85',
  'alt-home-composting-khamba': 'https://images.unsplash.com/photo-1532996122724-a3c354a0f50b?w=900&auto=format&fit=crop&q=85',
  'alt-reusable-steel-flask': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=900&auto=format&fit=crop&q=85',
  'alt-thrift-clothing': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&auto=format&fit=crop&q=85',
  'alt-refurbished-electronics': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&auto=format&fit=crop&q=85',
};

const CATEGORY_IMAGES: Record<string, string> = {
  transport: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&auto=format&fit=crop&q=85',
  travel: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=900&auto=format&fit=crop&q=85',
  food: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&auto=format&fit=crop&q=85',
  energy: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=900&auto=format&fit=crop&q=85',
  shopping: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&auto=format&fit=crop&q=85',
  waste: 'https://images.unsplash.com/photo-1532996122724-a3c354a0f50b?w=900&auto=format&fit=crop&q=85',
};

const categoryLabel = (category: string) =>
  category === 'waste' ? 'Waste' : category.charAt(0).toUpperCase() + category.slice(1);

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.abs(value));

const formatCostSaving = (delta: number) => {
  if (delta < 0) return 'Save ' + formatINR(delta) + ' / month';
  if (delta > 0) return 'Costs ' + formatINR(delta) + ' more / month';
  return 'No monthly cost change';
};

export function CataloguePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const alternativesQuery = useAlternatives();
  const actionsQuery = useUserActions();
  const upsert = useUpsertUserAction();
  const { toast } = useToast();

  const swaps = alternativesQuery.data ?? [];
  const actions = actionsQuery.data ?? [];

  const filteredSwaps = swaps.filter((swap) => {
    const matchesCategory = activeCategory === 'all' || swap.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query
      || swap.title.toLowerCase().includes(query)
      || swap.description.toLowerCase().includes(query)
      || swap.category.toLowerCase().includes(query)
      || swap.tags.some((tag) => tag.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const counts = {
    all: swaps.length,
    transport: swaps.filter((swap) => swap.category === 'transport').length,
    food: swaps.filter((swap) => swap.category === 'food').length,
    energy: swaps.filter((swap) => swap.category === 'energy').length,
    shopping: swaps.filter((swap) => swap.category === 'shopping').length,
    waste: swaps.filter((swap) => swap.category === 'waste').length,
    travel: swaps.filter((swap) => swap.category === 'travel').length,
  };

  const adoptSwap = async (alternativeId: string) => {
    try {
      await upsert.mutateAsync({ alternative_id: alternativeId, status: 'adopted' });
      const selected = swaps.find((swap) => swap.id === alternativeId);
      toast({
        title: 'Added to Your Routine',
        description: selected ? selected.title + ' is now in Your swaps.' : 'Your adopted swap is now in Your swaps.',
        type: 'success',
      });
    } catch (error) {
      toast({
        title: 'Could not add this swap',
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
    }
  };


  return (
    <div className="cat-page">
      {/* Header */}
      <div className="cat-header">
        <h1 className="cat-title">Catalogue</h1>
        <p className="cat-sub">Browse all sustainable swaps and find what works for you.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="cat-search-row">
        <div className="cat-search-box">
          <Search className="h-4 w-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Search swaps, fuels, foods, appliances..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button type="button" className="cat-filter-btn">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters ({filteredSwaps.length})</span>
        </button>
      </div>

      {/* Main Grid: Categories Sidebar + Swaps List */}
      <div className="cat-layout">
        {/* Category Filter List */}
        <aside className="cat-sidebar">
          {[
            { id: 'all', label: 'All swaps', count: counts.all },
            { id: 'transport', label: 'Transport', count: counts.transport },
            { id: 'food', label: 'Food', count: counts.food },
            { id: 'energy', label: 'Energy', count: counts.energy },
            { id: 'shopping', label: 'Shopping', count: counts.shopping },
            { id: 'waste', label: 'Waste', count: counts.waste },
            { id: 'travel', label: 'Travel', count: counts.travel },
          ].map(({ id, label, count }) => (
            <button
              key={id}
              type="button"
              className={`cat-nav-item ${activeCategory === id ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(id)}
            >
              <span>{label}</span>
              <span className="cat-count">({count})</span>
            </button>
          ))}
        </aside>

        {/* Swaps List */}
        <div className="cat-list">
          {alternativesQuery.isLoading && <div className="cat-data-message">Loading available sustainable swaps…</div>}
          {alternativesQuery.isError && (
            <div className="cat-data-message" role="alert">
              Could not load swaps.
              <button type="button" onClick={() => void alternativesQuery.refetch()}>Retry</button>
            </div>
          )}
          {actionsQuery.isError && (
            <div className="cat-data-message" role="alert">
              Your adopted swaps could not be checked. Please refresh your saved preferences.
              <button type="button" onClick={() => void actionsQuery.refetch()}>Retry</button>
            </div>
          )}
          {filteredSwaps.map((item) => {
            const savedAction = actions.find((action) => action.alternative_id === item.id);
            const isAdopted = savedAction?.status === 'adopted';
            const image = ALTERNATIVE_IMAGES[item.id] || CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES.shopping;
            const carbonReduction = Math.round(item.co2e_saved_ratio * 100);
            return (
              <div key={item.id} className="cat-card">
                <div className="cat-card-thumb">
                  <img src={image} alt={item.title} loading="lazy" />
                </div>
                <div className="cat-card-content">
                  <h2 className="cat-card-title">{item.title}</h2>
                  <div className="cat-card-meta">
                    <span className="cat-card-badge">{categoryLabel(item.category)}</span>
                    <span className="cat-card-dot">·</span>
                    <span className="cat-card-cost">{formatCostSaving(item.cost_delta_monthly_inr)}</span>
                  </div>
                  <p className="cat-card-co2">{carbonReduction}% lower CO₂e than the matched baseline</p>
                  <p className="cat-card-description">{item.description}</p>
                </div>
                <button
                  type="button"
                  className={`cat-adopt-btn ${isAdopted ? 'is-adopted' : ''}`}
                  disabled={isAdopted || upsert.isPending || alternativesQuery.isLoading}
                  aria-pressed={isAdopted}
                  onClick={() => void adoptSwap(item.id)}
                >
                  {isAdopted ? (
                    <><Check className="h-3.5 w-3.5" /><span>Adopted</span></>
                  ) : upsert.isPending ? (
                    <><LoaderCircle className="h-3.5 w-3.5 animate-spin" /><span>Saving…</span></>
                  ) : (
                    <><Leaf className="h-3.5 w-3.5" /><span>Add to routine</span></>
                  )}
                </button>
              </div>
            );
          })}

          {filteredSwaps.length === 0 && (
            <div className="cat-empty">
              <p>No swaps match your search or filter.</p>
              <button
                type="button"
                className="cat-reset-btn"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
              >
                Clear search &amp; filter
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cat-page {
          max-width: 1060px;
          margin: 0 auto;
          padding: 2.2rem 2.5rem 4rem;
          font-family: 'DM Sans', sans-serif;
          color: var(--color-ink);
        }
        .cat-header {
          margin-bottom: 1.5rem;
        }
        .cat-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--color-ink);
          letter-spacing: -0.02em;
          margin: 0 0 0.35rem;
        }
        .cat-sub {
          font-size: 0.9rem;
          color: var(--color-ink-muted);
          margin: 0;
        }
        .cat-search-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .cat-search-box {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 999px;
          padding: 0.55rem 1.25rem;
          flex: 1;
          max-width: 520px;
        }
        .dark .cat-search-box {
          background: #16201a;
          border-color: #24352b;
        }
        .cat-search-box input {
          border: none;
          background: none;
          outline: none;
          font-size: 0.85rem;
          color: var(--color-ink);
          width: 100%;
        }
        .cat-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1.1rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-ink);
          cursor: pointer;
          transition: all 0.15s;
        }
        .cat-filter-btn:hover {
          border-color: #123826;
        }
        .cat-layout {
          display: grid;
          grid-template-columns: 210px 1fr;
          gap: 2.5rem;
          align-items: flex-start;
        }
        .cat-sidebar {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 14px;
          padding: 0.8rem;
          position: sticky;
          top: 80px;
        }
        .dark .cat-sidebar {
          background: #141c17;
          border-color: #202c24;
        }
        .cat-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.85rem;
          background: none;
          border: none;
          border-radius: 8px;
          color: var(--color-ink-muted);
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
        }
        .cat-nav-item:hover {
          background: rgba(0, 0, 0, 0.04);
          color: var(--color-ink);
        }
        .cat-nav-item.is-active {
          background: rgba(18, 56, 38, 0.1);
          color: #123826;
          font-weight: 700;
        }
        .dark .cat-nav-item.is-active {
          background: rgba(62, 172, 106, 0.15);
          color: #3eac6a;
        }
        .cat-count {
          font-size: 0.72rem;
          opacity: 0.7;
        }
        .cat-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .cat-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 1rem 1.4rem;
          display: flex;
          align-items: center;
          gap: 1.4rem;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .cat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
          border-color: rgba(18, 56, 38, 0.3);
        }
        .cat-card-thumb {
          width: 76px;
          height: 64px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .cat-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cat-card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .cat-card-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0;
        }
        .cat-card-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
        }
        .cat-card-badge {
          color: var(--color-ink-muted);
          font-weight: 600;
        }
        .cat-card-dot {
          color: var(--color-ink-faint);
        }
        .cat-card-cost {
          color: #8b5a2b;
          font-weight: 500;
        }
        .cat-card-co2 {
          font-size: 0.75rem;
          font-weight: 600;
          color: #123826;
          margin: 0;
        }
        .dark .cat-card-co2 {
          color: #3eac6a;
        }
        .cat-save-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 1.1rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid var(--color-border);
          background: #FAF8F4;
          color: var(--color-ink-muted);
        }
        .cat-save-btn:hover {
          border-color: #123826;
          color: #123826;
        }
        .cat-save-btn.is-saved {
          background: #e4efe7;
          border-color: #123826;
          color: #123826;
          font-weight: 700;
        }
        .dark .cat-save-btn.is-saved {
          background: #1a3826;
          border-color: #3eac6a;
          color: #3eac6a;
        }
        .cat-empty {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--color-ink-muted);
        }
        .cat-reset-btn {
          margin-top: 0.75rem;
          padding: 0.45rem 1rem;
          background: #123826;
          color: #fff;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          font-size: 0.78rem;
        }
        @media (max-width: 768px) {
          .cat-layout {
            grid-template-columns: 1fr;
          }
          .cat-sidebar {
            flex-direction: row;
            flex-wrap: wrap;
            position: static;
          }
        }

        .cat-card-description { margin-top:.35rem; color:#78857b; font-size:.72rem; line-height:1.45; }
        .cat-adopt-btn {
          display:inline-flex; flex:0 0 auto; align-items:center; justify-content:center; gap:.45rem;
          min-width:126px; padding:.62rem .95rem; border:1px solid #1d4932; border-radius:999px;
          color:#fff; background:#173c2a; font-size:.72rem; font-weight:750; cursor:pointer;
          transition:transform .16s ease,background .16s ease,box-shadow .16s ease;
        }
        .cat-adopt-btn:hover:not(:disabled) { transform:translateY(-1px); background:#285a3d; box-shadow:0 7px 16px rgba(23,60,42,.16); }
        .cat-adopt-btn.is-adopted { color:#285c3b; background:#e8f1e6; border-color:#c9dbc6; cursor:default; }
        .cat-adopt-btn:disabled:not(.is-adopted) { opacity:.65; cursor:wait; }
        .cat-data-message { grid-column:1/-1; padding:1.1rem 1.25rem; border:1px solid #e5ded1; border-radius:16px; background:#fffdf8; color:#68776d; font-size:.8rem; }
        .cat-data-message button { margin-left:.5rem; color:#24583a; font-weight:750; text-decoration:underline; }
        @media(max-width:650px) {
          .cat-card { align-items:flex-start; flex-wrap:wrap; gap:.8rem; }
          .cat-adopt-btn { width:100%; }
        }
      `}</style>
    </div>
  );
}
