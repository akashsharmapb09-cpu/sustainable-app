import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Check, Bookmark } from 'lucide-react';
import { addRoutineSwapFromCatalog, getRoutineSwaps, removeRoutineSwap, subscribeToRoutineSwaps } from '../../features/activities/routineSwapStore';

interface SwapItem {
  id: string;
  title: string;
  category: 'transport' | 'food' | 'energy' | 'shopping' | 'waste' | 'home';
  categoryLabel: string;
  co2Saving: string;
  costSaving: string;
  image: string;
  saved: boolean;
}

const EXPANDED_SWAPS: SwapItem[] = [
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
          {[
            { id: 'all', label: 'All swaps', count: counts.all },
            { id: 'transport', label: 'Transport', count: counts.transport },
            { id: 'food', label: 'Food', count: counts.food },
            { id: 'energy', label: 'Energy', count: counts.energy },
            { id: 'shopping', label: 'Shopping', count: counts.shopping },
            { id: 'waste', label: 'Waste & Home', count: counts.waste },
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
          {filteredSwaps.map((item) => (
            <div key={item.id} className="cat-card">
              <div className="cat-card-thumb">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="cat-card-content">
                <h2 className="cat-card-title">{item.title}</h2>
                <div className="cat-card-meta">
                  <span className="cat-card-badge">{item.categoryLabel}</span>
                  <span className="cat-card-dot">·</span>
                  <span className="cat-card-cost">{item.costSaving}</span>
                </div>
                <p className="cat-card-co2">{item.co2Saving}</p>
              </div>
              <button
                type="button"
                className={`cat-save-btn ${item.saved ? 'is-saved' : ''}`}
                onClick={() => toggleSave(item.id)}
              >
                {item.saved ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5" />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          ))}

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
      `}</style>
    </div>
  );
}
