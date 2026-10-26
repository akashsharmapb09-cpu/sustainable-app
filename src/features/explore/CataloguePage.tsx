import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Check, Bookmark, ArrowRight, Bike, Utensils, Zap, ShoppingBag, Recycle, LayoutGrid, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addRoutineSwapFromCatalog, getRoutineSwaps, removeRoutineSwap, subscribeToRoutineSwaps } from '../../features/activities/routineSwapStore';

export interface SwapItem {
  id: string;
  title: string;
  category: 'transport' | 'food' | 'energy' | 'shopping' | 'waste' | 'home';
  categoryLabel: string;
  co2Saving: string;
  costSaving: string;
  image: string;
  saved: boolean;
}

export const EXPANDED_SWAPS: SwapItem[] = [
  // ── Transport (4) ──
  {
    id: 'bike',
    title: 'Bike instead of driving',
    category: 'transport',
    categoryLabel: 'Transport',
    co2Saving: 'Save up to 0.2t CO2e / month',
    costSaving: 'Save ~₹2,400/mo on fuel',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&q=80',
    saved: false,
  },
  {
    id: 'metro',
    title: 'Switch to metro commuting',
    category: 'transport',
    categoryLabel: 'Transport',
    co2Saving: 'Save up to 0.25t CO2e / month',
    costSaving: 'Save ~₹3,200/mo on petrol & parking',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&q=80',
    saved: true,
  },
  {
    id: 'ev-2w',
    title: 'Electric two-wheeler for daily trips',
    category: 'transport',
    categoryLabel: 'Transport',
    co2Saving: 'Save up to 0.18t CO2e / month',
    costSaving: 'Running cost drops to ₹0.30/km',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&q=80',
    saved: false,
  },
  {
    id: 'carpool',
    title: 'Office ride-sharing & carpooling',
    category: 'transport',
    categoryLabel: 'Transport',
    co2Saving: 'Save up to 0.12t CO2e / month',
    costSaving: 'Split fuel costs 50/50',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&q=80',
    saved: false,
  },

  // ── Food (4) ──
  {
    id: 'plant',
    title: 'Eat plant-based meals',
    category: 'food',
    categoryLabel: 'Food',
    co2Saving: 'Save up to 0.3t CO2e / month',
    costSaving: 'Save ~₹1,200/mo grocery delta',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80',
    saved: true,
  },
  {
    id: 'food-waste',
    title: 'Batch cooking & zero kitchen waste',
    category: 'food',
    categoryLabel: 'Food',
    co2Saving: 'Save up to 0.15t CO2e / month',
    costSaving: 'Eliminate 25% food spoilage',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=300&q=80',
    saved: false,
  },
  {
    id: 'local-produce',
    title: 'Eat seasonal local vegetables & millets',
    category: 'food',
    categoryLabel: 'Food',
    co2Saving: 'Save up to 0.1t CO2e / month',
    costSaving: 'Fresher produce, lower price',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&q=80',
    saved: false,
  },
  {
    id: 'meatless-monday',
    title: 'Meatless Mondays ritual',
    category: 'food',
    categoryLabel: 'Food',
    co2Saving: 'Save up to 0.08t CO2e / month',
    costSaving: 'Light on health and pocket',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80',
    saved: false,
  },

  // ── Energy (4) ──
  {
    id: 'led',
    title: 'Use LED bulbs',
    category: 'energy',
    categoryLabel: 'Energy',
    co2Saving: 'Save up to 0.1t CO2e / month',
    costSaving: 'Cuts lighting power by 85%',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80',
    saved: false,
  },
  {
    id: 'ac-setpoint',
    title: 'AC 24°C–26°C thermostat setpoint',
    category: 'energy',
    categoryLabel: 'Energy',
    co2Saving: 'Save up to 0.16t CO2e / month',
    costSaving: 'Saves ~₹680/mo per air conditioner',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&q=80',
    saved: true,
  },
  {
    id: 'bldc-fan',
    title: '5-Star BLDC energy ceiling fans',
    category: 'energy',
    categoryLabel: 'Energy',
    co2Saving: 'Save up to 0.08t CO2e / month',
    costSaving: 'Drops draw from 75W to 28W',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80',
    saved: false,
  },
  {
    id: 'solar-rooftop',
    title: 'Rooftop solar photovoltaic net metering',
    category: 'energy',
    categoryLabel: 'Energy',
    co2Saving: 'Save up to 0.45t CO2e / month',
    costSaving: 'Zero or negative net electricity bills',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=300&q=80',
    saved: false,
  },

  // ── Shopping (3) ──
  {
    id: 'secondhand',
    title: 'Buy second-hand clothes',
    category: 'shopping',
    categoryLabel: 'Shopping',
    co2Saving: 'Save up to 0.05t CO2e / month',
    costSaving: 'Save up to 60% on apparel',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&q=80',
    saved: false,
  },
  {
    id: 'reusable-totes',
    title: 'Canvas shopping totes & reusable bags',
    category: 'shopping',
    categoryLabel: 'Shopping',
    co2Saving: 'Save up to 0.03t CO2e / month',
    costSaving: 'Avoid plastic bag surcharges',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&q=80',
    saved: true,
  },
  {
    id: 'repair-first',
    title: 'Repair appliances before replacement',
    category: 'shopping',
    categoryLabel: 'Shopping',
    co2Saving: 'Save up to 0.12t CO2e / month',
    costSaving: 'Avoids costly replacement purchases',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&q=80',
    saved: false,
  },

  // ── Waste & Home (3) ──
  {
    id: 'compost',
    title: 'Aerobic Khamba home composting',
    category: 'waste',
    categoryLabel: 'Waste',
    co2Saving: 'Save up to 0.08t CO2e / month',
    costSaving: 'Free rich organic garden fertilizer',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80',
    saved: false,
  },
  {
    id: 'water-aerators',
    title: 'Tap aerator nozzles (5L/min flow limit)',
    category: 'home',
    categoryLabel: 'Home',
    co2Saving: 'Save up to 0.04t CO2e / month',
    costSaving: 'Cuts household water consumption 40%',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&q=80',
    saved: false,
  },
  {
    id: 'shorter-shower',
    title: '5-minute shower timer ritual',
    category: 'home',
    categoryLabel: 'Home',
    co2Saving: 'Save up to 0.06t CO2e / month',
    costSaving: 'Saves 600L water and 12 kWh heating',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=300&q=80',
    saved: false,
  },
];

export function CataloguePage() {
  const navigate = useNavigate();
  const [swaps, setSwaps] = useState<SwapItem[]>(() => {
    const savedIds = new Set(getRoutineSwaps().map((swap) => swap.id));
    return EXPANDED_SWAPS.map((swap) => ({ ...swap, saved: savedIds.has(swap.id) }));
  });
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const syncSavedSwaps = () => {
      const savedIds = new Set(getRoutineSwaps().map((swap) => swap.id));
      setSwaps((current) => current.map((swap) => ({ ...swap, saved: savedIds.has(swap.id) })));
    };
    return subscribeToRoutineSwaps(syncSavedSwaps);
  }, []);

  const toggleSave = (id: string) => {
    const item = swaps.find((swap) => swap.id === id);
    if (!item) return;

    if (item.saved) removeRoutineSwap(id);
    else addRoutineSwapFromCatalog(item);

    const savedIds = new Set(getRoutineSwaps().map((swap) => swap.id));
    setSwaps((current) => current.map((swap) => ({ ...swap, saved: savedIds.has(swap.id) })));
  };

  const filteredSwaps = swaps.filter((s) => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    const matchSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.costSaving.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const counts = {
    all: swaps.length,
    transport: swaps.filter((s) => s.category === 'transport').length,
    food: swaps.filter((s) => s.category === 'food').length,
    energy: swaps.filter((s) => s.category === 'energy').length,
    shopping: swaps.filter((s) => s.category === 'shopping').length,
    waste: swaps.filter((s) => s.category === 'waste' || s.category === 'home').length,
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
          {([
            { id: 'all', label: 'All swaps', count: counts.all, Icon: LayoutGrid },
            { id: 'transport', label: 'Transport', count: counts.transport, Icon: Bike },
            { id: 'food', label: 'Food', count: counts.food, Icon: Utensils },
            { id: 'energy', label: 'Energy', count: counts.energy, Icon: Zap },
            { id: 'shopping', label: 'Shopping', count: counts.shopping, Icon: ShoppingBag },
            { id: 'waste', label: 'Waste & Home', count: counts.waste, Icon: Recycle },
          ] satisfies { id: string; label: string; count: number; Icon: LucideIcon }[]).map(({ id, label, count, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={activeCategory === id}
              className={`cat-nav-item ${activeCategory === id ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(id)}
            >
              <span className="cat-nav-main"><Icon aria-hidden="true" size={17} strokeWidth={1.9} /><span>{label}</span></span>
              <span className="cat-count">{count}</span>
            </button>
          ))}
        </aside>

        {/* Swaps List */}
        <div className="cat-list">
          {filteredSwaps.map((item) => {
            const isFeatured = ['solar-rooftop', 'plant', 'metro', 'bike', 'ev-2w'].includes(item.id);
            return (
              <article
                key={item.id}
                className="cat-card"
                role="link"
                tabIndex={0}
                aria-label={`View details for ${item.title}`}
                onClick={() => navigate(`/catalogue/${item.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    navigate(`/catalogue/${item.id}`);
                  }
                }}
              >
                <div className="cat-card-thumb">
                  <img src={item.image.replace(/w=300/, 'w=600')} alt={item.title} loading="lazy" />
                  {isFeatured ? <span className="cat-featured-badge"><Sparkles size={12} fill="currentColor" /> Featured pick</span> : null}
                </div>
                <div className="cat-card-content">
                  <div className="cat-card-topline">
                    <span className="cat-card-badge"><ShieldCheck size={12} /> {item.categoryLabel}</span>
                    {item.saved ? <span className="cat-adopted-badge"><Check size={12} /> In your routine</span> : null}
                  </div>
                  <h2 className="cat-card-title">{item.title}</h2>
                  <p className="cat-card-cost">{item.costSaving}</p>
                  <p className="cat-card-co2"><Sparkles size={14} /> {item.co2Saving}</p>
                </div>
                <div className="cat-card-actions">
                  <button
                    type="button"
                    className={`cat-save-btn ${item.saved ? 'is-saved' : ''}`}
                    aria-label={item.saved ? `Remove ${item.title} from your routine` : `Save ${item.title} to your routine`}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleSave(item.id);
                    }}
                  >
                    {item.saved ? <><Check className="h-3.5 w-3.5" /><span>Saved</span></> : <><Bookmark className="h-3.5 w-3.5" /><span>Save</span></>}
                  </button>
                  <span className="cat-card-arrow" aria-hidden="true"><ArrowRight size={19} /></span>
                </div>
              </article>
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
          max-width: 1260px;
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
          gap: 1.75rem;
          align-items: flex-start;
        }
        .cat-sidebar {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          background: transparent;
          border: 0;
          border-radius: 18px;
          padding: 0;
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
          gap: 0.7rem;
          width: 100%;
          min-height: 44px;
          padding: 0.65rem 0.85rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 999px;
          color: var(--color-ink-muted);
          font-size: 0.84rem;
          font-weight: 650;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          text-align: left;
        }
        .cat-nav-main { display: inline-flex; align-items: center; gap: 0.65rem; min-width: 0; }
        .cat-nav-main svg { flex-shrink: 0; color: #53745c; }
        .cat-nav-item:hover {
          transform: translateX(3px);
          background: #fff;
          border-color: #9fbea5;
          box-shadow: 0 6px 15px rgba(18, 56, 38, 0.07);
          color: var(--color-ink);
        }
        .cat-nav-item.is-active {
          background: #173e2b;
          border-color: #173e2b;
          color: #fff;
          box-shadow: 0 7px 18px rgba(18, 56, 38, 0.17);
          font-weight: 800;
        }
        .cat-nav-item.is-active .cat-nav-main svg { color: #b6e6c0; }
        .cat-count {
          display: grid;
          place-items: center;
          min-width: 25px;
          height: 25px;
          padding: 0 6px;
          border-radius: 999px;
          background: rgba(18, 56, 38, 0.07);
          font-size: 0.73rem;
          font-weight: 800;
          opacity: 0.9;
        }
        .cat-nav-item.is-active .cat-count { background: rgba(255,255,255,.16); }
        .dark .cat-nav-item { background: #141c17; border-color: #24352b; }
        .dark .cat-nav-item.is-active { background: #1e6840; border-color: #3eac6a; color: #fff; }
        .dark .cat-nav-item.is-active .cat-nav-main svg { color: #a5f0bd; }
        .cat-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 0;
        }
        .cat-card {
          position: relative;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 20px;
          padding: 1rem 1.1rem;
          display: flex;
          align-items: center;
          gap: 1.15rem;
          min-width: 0;
          cursor: pointer;
          outline: none;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.035);
          transition: transform 0.24s cubic-bezier(.2,.8,.2,1), box-shadow 0.24s ease, border-color 0.24s ease, background 0.24s ease;
        }
        .cat-card:hover, .cat-card:focus-visible {
          transform: translateY(-5px);
          box-shadow: 0 18px 38px rgba(20, 58, 37, 0.13);
          border-color: #69a77a;
          background: color-mix(in srgb, var(--color-surface) 96%, #dff2e3);
        }
        .cat-card:focus-visible { outline: 3px solid #70b481; outline-offset: 3px; }
        .cat-card-thumb {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 14px;
          overflow: hidden;
          flex-shrink: 0;
          background: #e7efe4;
        }
        .cat-card-thumb img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s ease;
        }
        .cat-card:hover .cat-card-thumb img, .cat-card:focus-visible .cat-card-thumb img { transform: scale(1.08); }
        .cat-featured-badge {
          position: absolute;
          top: 7px;
          left: 7px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          max-width: calc(100% - 14px);
          padding: 5px 7px;
          border: 1px solid rgba(255,255,255,.52);
          border-radius: 999px;
          background: rgba(18, 44, 29, .88);
          color: #e4f7dc;
          font-size: 0.59rem;
          font-weight: 850;
          letter-spacing: .025em;
          text-transform: uppercase;
          white-space: nowrap;
          backdrop-filter: blur(8px);
        }
        .cat-card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.45rem;
          min-width: 0;
        }
        .cat-card-topline { display: flex; flex-wrap: wrap; align-items: center; gap: 0.45rem; }
        .cat-card-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.12rem;
          font-weight: 750;
          line-height: 1.3;
          color: var(--color-ink);
          margin: 0;
          transition: color 0.2s ease;
        }
        .cat-card:hover .cat-card-title { color: #1d6740; }
        .cat-card-badge, .cat-adopted-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 999px;
          color: #315d3b;
          background: #eaf3e6;
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: .015em;
        }
        .cat-adopted-badge { color: #fff; background: #1f603b; }
        .cat-card-cost {
          color: #8b5a2b;
          font-size: 0.8rem;
          font-weight: 600;
          margin: 0;
        }
        .cat-card-co2 {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          font-weight: 800;
          color: #237044;
          margin: 0;
        }
        .cat-card-actions { display: flex; flex-direction: column; align-items: center; gap: 0.8rem; flex-shrink: 0; }
        .cat-card-arrow {
          display: grid;
          place-items: center;
          width: 39px;
          height: 39px;
          border: 1px solid #d9e5d8;
          border-radius: 50%;
          background: #f7faf4;
          color: #255b37;
          opacity: .35;
          transform: translateX(-5px);
          transition: opacity .22s ease, transform .22s ease, background .22s ease, color .22s ease;
        }
        .cat-card:hover .cat-card-arrow, .cat-card:focus-visible .cat-card-arrow { opacity: 1; transform: translateX(0); background: #1e5936; border-color: #1e5936; color: #fff; }
        .cat-save-btn {
          position: relative;
          z-index: 1;
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
            gap: 0.5rem;
          }
          .cat-nav-item { width: auto; max-width: 100%; }
          .cat-card { gap: 0.85rem; }
          .cat-card-actions { flex-direction: row; }
        }
      `}</style>
    </div>
  );
}
