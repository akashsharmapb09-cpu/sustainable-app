import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Analytics } from './Analytics';
import { getRoutineSwaps, removeRoutineSwap, subscribeToRoutineSwaps, type RoutineSwap } from './routineSwapStore';

interface RoutineAction {
  id: string;
  label: string;
  category: string;
  saving: string;
  completed: boolean;
}

const INITIAL_ACTIONS: RoutineAction[] = [
  { id: '1', label: 'Use a reusable water bottle', category: 'Shopping', saving: '-1.5 kg CO₂e', completed: true },
  { id: '2', label: 'Try a plant-based meal', category: 'Food', saving: '-2.8 kg CO₂e', completed: true },
  { id: '3', label: 'Walk or cycle for short trips', category: 'Transport', saving: '-4.2 kg CO₂e', completed: true },
  { id: '4', label: 'Avoid food waste', category: 'Food', saving: '-3.0 kg CO₂e', completed: true },
  { id: '5', label: 'Use LED bulbs', category: 'Energy', saving: '-1.8 kg CO₂e', completed: false },
  { id: '6', label: 'Choose second-hand', category: 'Shopping', saving: '-2.2 kg CO₂e', completed: false },
  { id: '7', label: 'Take shorter showers', category: 'Home', saving: '-2.0 kg CO₂e', completed: false },
];

export function LogActivityPage() {
  const [actions, setActions] = useState<RoutineAction[]>(INITIAL_ACTIONS);
  const [activeTab, setActiveTab] = useState<'plan' | 'swaps' | 'analytics'>('plan');
  const [routineSwaps, setRoutineSwaps] = useState<RoutineSwap[]>([]);

  useEffect(() => {
    const refreshSwaps = () => setRoutineSwaps(getRoutineSwaps());
    refreshSwaps();
    return subscribeToRoutineSwaps(refreshSwaps);
  }, []);

  const toggleAction = (id: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const completedCount = actions.filter((a) => a.completed).length;

  return (
    <div className="routine-root">
      {/* ── Page Header ── */}
      <div className="routine-header">
        <h1 className="routine-title">Your routine</h1>
        <p className="routine-sub">Build simple habits for a stronger impact.</p>
      </div>

      {/* ── Tabs Bar ── */}
      <div className="routine-tabs">
        <button
          type="button"
          className={`routine-tab ${activeTab === 'plan' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('plan')}
        >
          7-day plan
        </button>
        <button
          type="button"
          className={`routine-tab ${activeTab === 'swaps' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('swaps')}
        >
          Your swaps
        </button>
        <button
          type="button"
          className={`routine-tab ${activeTab === 'analytics' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {/* ── Tab 1: 7-Day Plan View ── */}
      {activeTab === 'plan' && (
        <div className="routine-split">
          {/* Left: Your 7-day challenge card */}
          <div className="routine-card routine-challenge-card">
            <div className="challenge-card-header">
              <div>
                <h2 className="challenge-title">Your 7-day challenge</h2>
                <p className="challenge-desc">Complete daily actions to build your sustainable routine.</p>
              </div>
              <span className="challenge-counter">{completedCount}/7 completed</span>
            </div>

            {/* Checklist */}
            <div className="routine-checklist">
              {actions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  className={`checklist-item ${act.completed ? 'is-checked' : ''}`}
                  onClick={() => toggleAction(act.id)}
                >
                  <div className="check-box">
                    {act.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <span className="check-text">{act.label}</span>
                  <span className="check-saving">{act.saving}</span>
                  <span className="check-bookmark">🔖</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Today's Tip & Botanical Quote */}
          <div className="routine-right-col">
            {/* Today's Tip */}
            <div className="routine-card tip-card">
              <div className="tip-header">
                <span className="tip-title">Today&apos;s tip</span>
                <span className="tip-icon">💡</span>
              </div>
              <p className="tip-body">
                Taking a 5 minute shorter shower can save up to <strong>20 liters of water</strong> and reduce hot water heating emissions.
              </p>
            </div>

            {/* Botanical Quote Card */}
            <div className="routine-card quote-card">
              <blockquote className="quote-text">
                &ldquo;Progress, not perfection, leads to a cleaner planet.&rdquo;
              </blockquote>
              <div className="quote-leaf" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M10 30 C15 15 25 10 35 8 C30 20 22 28 10 30Z"
                    fill="#123826"
                    opacity="0.8"
                  />
                  <path d="M12 28 L30 12" stroke="#4dd282" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Your Swaps View ── */}
      {activeTab === 'swaps' && (
        <div className="routine-card routine-swaps-view">
          <div className="swaps-header-row">
            <div>
              <h2 className="challenge-title">Active Adopted Swaps</h2>
              <p className="challenge-desc">Sustainable habits currently active in your household routine.</p>
            </div>
            <Link to="/catalogue" className="adopt-more-btn">
              Browse More Swaps →
            </Link>
          </div>

          {routineSwaps.length === 0 ? (
            <div className="routine-swaps-empty">
              <p>Start adding swaps to see impact</p>
              <Link to="/catalogue" className="adopt-more-btn">Browse swaps →</Link>
            </div>
          ) : (
            <div className="swaps-list-grid">
              {routineSwaps.map((swap) => {
                const created = new Date(swap.createdAt);
                const statusLabel = Number.isNaN(created.getTime()) || created.getFullYear() === 1970
                  ? 'Added to your routine'
                  : 'Added ' + created.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                const moneyLabel = swap.costDiff > 0
                  ? 'Save ' + new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(swap.costDiff) + '/mo'
                  : swap.costDiff < 0
                    ? 'Extra cost ' + new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.abs(swap.costDiff)) + '/mo'
                    : 'No cost estimate';

                return (
                  <div key={swap.id} className="adopted-swap-item">
                    <div className="adopted-item-left">
                      <span className="adopted-status-tag">{statusLabel}</span>
                      <h3 className="adopted-item-title">{swap.title}</h3>
                      <div className="adopted-item-meta">
                        <span className="adopted-cat">{swap.category}</span>
                        <span className="dot-divider">·</span>
                        <span className="adopted-money">{moneyLabel}</span>
                      </div>
                    </div>
                    <div className="adopted-item-right">
                      <span className="adopted-co2-pill">−{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 }).format(swap.co2Saved)} kg CO₂e / mo</span>
                      <button
                        type="button"
                        className="remove-swap-btn"
                        onClick={() => removeRoutineSwap(swap.id)}
                        aria-label={'Remove ' + swap.title}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Tab 3: Analytics View ── */}
      {activeTab === 'analytics' && <Analytics />}

      <style>{`
        .routine-root {
          max-width: 1080px;
          margin: 0 auto;
          padding: 2.2rem 2.5rem 4rem;
          font-family: 'DM Sans', sans-serif;
          color: var(--color-ink);
        }
        .routine-header {
          margin-bottom: 1.4rem;
        }
        .routine-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--color-ink);
          letter-spacing: -0.02em;
          margin: 0 0 0.35rem;
        }
        .routine-sub {
          font-size: 0.9rem;
          color: var(--color-ink-muted);
          margin: 0;
        }

        .routine-tabs {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 2rem;
        }
        .routine-tab {
          padding: 0.45rem 1.15rem;
          border-radius: 999px;
          border: 1px solid #DFD7CA;
          background: #FAF8F4;
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--color-ink-muted);
          cursor: pointer;
          transition: all 0.15s;
        }
        .dark .routine-tab {
          background: #141c17;
          border-color: #24352b;
        }
        .routine-tab:hover {
          border-color: #123826;
          color: var(--color-ink);
        }
        .routine-tab.is-active {
          background: #123826;
          border-color: #123826;
          color: #ffffff;
          font-weight: 600;
        }
        .dark .routine-tab.is-active {
          background: #3eac6a;
          border-color: #3eac6a;
          color: #0c130f;
        }

        .routine-split {
          display: grid;
          grid-template-columns: 1.45fr 1fr;
          gap: 1.8rem;
          align-items: flex-start;
        }
        .routine-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 1.8rem 2rem;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04);
        }

        .challenge-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.8rem;
        }
        .challenge-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0 0 0.3rem;
        }
        .challenge-desc {
          font-size: 0.78rem;
          color: var(--color-ink-muted);
          margin: 0;
        }
        .challenge-counter {
          font-size: 0.75rem;
          font-weight: 700;
          color: #123826;
          background: rgba(18, 56, 38, 0.08);
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          white-space: nowrap;
        }
        .dark .challenge-counter {
          background: rgba(62, 172, 106, 0.15);
          color: #3eac6a;
        }

        .routine-checklist {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .checklist-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
          width: 100%;
        }
        .dark .checklist-item {
          background: #141c17;
          border-color: #24352b;
        }
        .checklist-item:hover { border-color: #123826; }
        .checklist-item.is-checked {
          background: rgba(18, 56, 38, 0.05);
          border-color: rgba(18, 56, 38, 0.3);
        }
        .check-box {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #DFD7CA;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .checklist-item.is-checked .check-box {
          background: #123826;
          border-color: #123826;
          color: #ffffff;
        }
        .check-text {
          font-size: 0.85rem;
          color: var(--color-ink);
          font-weight: 500;
          flex: 1;
        }
        .check-saving {
          font-size: 0.72rem;
          color: #123826;
          font-weight: 600;
          background: rgba(18, 56, 38, 0.08);
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }
        .check-bookmark { font-size: 0.85rem; opacity: 0.35; }
        .checklist-item:hover .check-bookmark { opacity: 0.9; }

        .routine-right-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .tip-card { background: #FAF8F4; }
        .dark .tip-card { background: #152019; }
        .tip-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .tip-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-ink);
        }
        .tip-body {
          font-size: 0.82rem;
          color: var(--color-ink-muted);
          line-height: 1.6;
          margin: 0;
        }

        .quote-card {
          background: #f7f3ec;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2.2rem 2rem;
        }
        .dark .quote-card { background: #131c16; }
        .quote-text {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.15rem;
          font-style: italic;
          color: #123826;
          line-height: 1.5;
          margin: 0 0 1rem;
        }
        .dark .quote-text { color: #4dd282; }

        /* ── Swaps Tab ── */
        .swaps-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.8rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .adopt-more-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1.15rem;
          background: #123826;
          color: #ffffff;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.15s;
        }
        .adopt-more-btn:hover { background: #1c4e36; }
        .swaps-list-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .adopted-swap-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem 1.4rem;
          background: #FAF8F4;
          border: 1px solid #DFD7CA;
          border-radius: 12px;
          gap: 1rem;
        }
        .dark .adopted-swap-item {
          background: #152019;
          border-color: #24352b;
        }
        .adopted-status-tag {
          font-size: 0.65rem;
          color: #123826;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 0.2rem;
          display: block;
        }
        .dark .adopted-status-tag { color: #4dd282; }
        .adopted-item-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0 0 0.25rem;
        }
        .adopted-item-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--color-ink-muted);
        }
        .adopted-money { color: #8b5a2b; font-weight: 600; }
        .adopted-co2-pill {
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          background: rgba(18, 56, 38, 0.1);
          color: #123826;
          font-weight: 700;
          font-size: 0.82rem;
          white-space: nowrap;
        }
        .dark .adopted-co2-pill {
          background: rgba(62, 172, 106, 0.15);
          color: #3eac6a;
        }

        /* ── Analytics Tab ── */
        .analytics-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .kpi-card {
          padding: 1.4rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .kpi-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kpi-label {
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: var(--color-ink-muted);
          display: block;
          margin-bottom: 0.2rem;
        }
        .kpi-value {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--color-ink);
          line-height: 1.1;
          display: block;
        }
        .kpi-value span { font-size: 0.8rem; font-family: 'DM Sans', sans-serif; font-weight: 500; }
        .kpi-sub { font-size: 0.68rem; color: #123826; font-weight: 600; display: block; margin-top: 0.15rem; }
        .dark .kpi-sub { color: #4dd282; }

        .analytics-charts-split {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 1.8rem;
        }
        .chart-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.6rem;
        }
        .chart-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0 0 0.25rem;
        }
        .chart-sub { font-size: 0.78rem; color: var(--color-ink-muted); margin: 0; }
        .chart-period-badge {
          font-size: 0.68rem;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.05);
          color: var(--color-ink-muted);
        }

        .weekly-bars-display {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 180px;
          padding-top: 1.5rem;
        }
        .weekly-bar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          height: 100%;
        }
        .bar-kg-label { font-size: 0.72rem; font-weight: 700; color: #123826; }
        .dark .bar-kg-label { color: #4dd282; }
        .bar-track {
          flex: 1;
          width: 38px;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 8px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        .dark .bar-track { background: rgba(255, 255, 255, 0.04); }
        .bar-fill {
          width: 100%;
          background: linear-gradient(180deg, #4dd282 0%, #123826 100%);
          border-radius: 8px;
          transition: height 0.6s ease;
        }
        .bar-week-label { font-size: 0.72rem; color: var(--color-ink-muted); }

        .category-bars-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 1.5rem 0 1.8rem;
        }
        .cat-breakdown-row {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .cat-breakdown-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
        }
        .cat-name { color: var(--color-ink); }
        .cat-kg { font-weight: 700; color: var(--color-ink); }
        .cat-progress-track {
          height: 7px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 99px;
          overflow: hidden;
        }
        .dark .cat-progress-track { background: rgba(255, 255, 255, 0.06); }
        .cat-progress-fill { height: 100%; border-radius: 99px; }

        .streak-bubble-row {
          border-top: 1px solid var(--color-border);
          padding-top: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .streak-bubble-title {
          font-size: 0.72rem;
          color: var(--color-ink-muted);
          font-weight: 600;
        }
        .streak-dots {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .streak-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          color: #ffffff;
          background: #d4ccbf;
        }
        .streak-dot.is-complete { background: #123826; }
        .streak-dot.is-today { background: #4dd282; color: #0c130f; box-shadow: 0 0 0 2px rgba(77, 210, 130, 0.4); }

        .routine-swaps-empty {
          border: 1px dashed #DFD7CA;
          border-radius: 12px;
          padding: 2rem 1rem;
          text-align: center;
          color: var(--color-ink-muted);
        }
        .routine-swaps-empty p {
          font-size: 0.85rem;
          margin: 0 0 1rem;
        }
        .adopted-item-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.55rem;
          flex-wrap: wrap;
        }
        .remove-swap-btn {
          border: 1px solid var(--color-border);
          border-radius: 999px;
          background: transparent;
          color: var(--color-ink-muted);
          padding: 0.35rem 0.65rem;
          font-size: 0.7rem;
          cursor: pointer;
          white-space: nowrap;
        }
        .remove-swap-btn:hover {
          color: #9f3029;
          border-color: #9f3029;
        }
        .analytics-empty-state {
          margin: -0.75rem 0 1.5rem;
          color: var(--color-ink-muted);
          font-size: 0.82rem;
        }

        @media (max-width: 900px) {
          .routine-split, .analytics-charts-split { grid-template-columns: 1fr; }
          .analytics-kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .analytics-kpi-grid { grid-template-columns: 1fr; }
          .routine-root { padding: 1.5rem 1.25rem; }
        }
      `}</style>
    </div>
  );
}
