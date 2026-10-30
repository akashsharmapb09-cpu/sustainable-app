import { useEffect, useState } from 'react';

const RITUAL_KEY = 'ritualCompletion';
const LAST_DATE_KEY = 'lastLoginDate';
const TOTAL_STEPS = 7;

// Local calendar day, e.g. "2026-10-24" (never a fixed date)
const dayKey = (d: Date) => d.toLocaleDateString('en-CA');

// e.g. "Sat, 24 Oct 2026"
const formatHeaderDate = (d: Date) => {
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'short' });
  const rest = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${weekday}, ${rest}`;
};
import { Link } from 'react-router-dom';
import {
  DAILY_RITUALS_CHANGED_EVENT,
  DEFAULT_DAILY_RITUALS,
  getDailyRituals,
  isDailyRitualStorageEvent,
  type DailyRitual,
} from '../../shared/lib/ritualCompletion';

export function DashboardPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [dailyRituals, setDailyRituals] = useState<DailyRitual[]>(() =>
    DEFAULT_DAILY_RITUALS.map((ritual) => ({ ...ritual }))
  );
  const today = now ? dayKey(now) : null;

  // Keep the date live; re-check every minute so it rolls over at midnight
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    const onFocus = () => setNow(new Date());
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  // Daily reset: new day -> clear ritual completion and store today's date
  useEffect(() => {
    if (!today) return;
    const last = localStorage.getItem(LAST_DATE_KEY);
    if (last !== today) {
      localStorage.removeItem(RITUAL_KEY);
      localStorage.setItem(LAST_DATE_KEY, today);
      setCompletedDays([]);
    } else {
      try {
        setCompletedDays(JSON.parse(localStorage.getItem(RITUAL_KEY) ?? '[]'));
      } catch {
        setCompletedDays([]);
      }
    }
  }, [today]);

  // The dashboard gauge uses the exact same persisted daily ritual check-ins
  // as Your Routine. Listen for same-tab changes and cross-tab storage updates.
  useEffect(() => {
    const refreshDailyRituals = () => setDailyRituals(getDailyRituals());
    const onStorage = (event: StorageEvent) => {
      if (isDailyRitualStorageEvent(event.key)) refreshDailyRituals();
    };
    refreshDailyRituals();
    window.addEventListener(DAILY_RITUALS_CHANGED_EVENT, refreshDailyRituals);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(DAILY_RITUALS_CHANGED_EVENT, refreshDailyRituals);
      window.removeEventListener('storage', onStorage);
    };
  }, [today]);

  // Ritual completion is the number of checked daily habits, not the
  // separate weekday markers shown in the 7-day plan strip below.
  const doneCount = dailyRituals.filter((ritual) => ritual.completed).length;
  const remainingCount = TOTAL_STEPS - doneCount;
  const gaugeOffset = 251.2 * (1 - doneCount / TOTAL_STEPS);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({
    transport: true,
    food: true,
    energy: true,
  });

  const toggleDay = (d: number) => {
    setCompletedDays((prev) => {
      const next = prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d];
      localStorage.setItem(RITUAL_KEY, JSON.stringify(next));
      if (today) localStorage.setItem(LAST_DATE_KEY, today);
      return next;
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="dash-container">
      {/* ── Top Greeting Header (Matching Image Exactly) ── */}
      <header className="dash-greeting-row">
        <div>
          <span className="dash-page-eyebrow">YOUR GREENSWAP OVERVIEW</span>
          <h1 className="dash-greeting-title">
            Good morning <span className="wave-hand">👋</span>
          </h1>
          <p className="dash-greeting-sub">A clearer view of the small choices making a lighter tomorrow.</p>
        </div>
        <div className="dash-greeting-right">
          <span className="dash-date-text">{now ? formatHeaderDate(now) : ''}</span>
          <span className="dash-cheer-text">Keep going, you&apos;re doing great! 🌱</span>
        </div>
      </header>

      {/* ── Row 1: Estimated Impact & Ritual Completion ── */}
      <div className="dash-impact-row">
        {/* Left: Your Estimated Impact Card (Rich Spruce Green) */}
        <div className="dash-impact-card">
          <div className="impact-card-left">
            <span className="impact-label">Your estimated impact</span>
            <div className="impact-stat-group">
              <span className="impact-num">0.7t</span>
              <span className="impact-unit">CO2e saved / month</span>
            </div>
            <div className="impact-badge-pill">
              <span>↑ 12% from last month</span>
            </div>
          </div>

          <div className="impact-right-group">
            {/* 5 Vertical Bar Columns */}
            <div className="impact-chart-bars" aria-label="Monthly savings chart">
              <div className="bar bar-1" style={{ height: '35%' }} />
              <div className="bar bar-2" style={{ height: '52%' }} />
              <div className="bar bar-3" style={{ height: '70%' }} />
              <div className="bar bar-4" style={{ height: '88%' }} />
              <div className="bar bar-5" style={{ height: '100%' }} />
            </div>

            {/* Subtle botanical leaves watermark in card */}
            <div className="impact-leaf-art" aria-hidden="true">
              <svg viewBox="0 0 100 100" fill="none">
                <path
                  d="M10 90 C30 70 40 40 90 20 C70 50 40 70 10 90Z"
                  fill="#ffffff"
                  opacity="0.12"
                />
                <path
                  d="M20 70 C40 55 60 40 85 25"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  opacity="0.18"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Ritual Completion Gauge Card (3/7 steps) */}
        <div className="dash-ritual-card">
          <span className="ritual-card-title">Ritual completion</span>
          <div className="ritual-card-body">
            {/* Circular Gauge */}
            <div className="ritual-gauge-wrap">
              <svg className="ritual-svg" viewBox="0 0 100 100">
                <circle
                  className="gauge-bg"
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                />
                <circle
                  className="gauge-fill"
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={gaugeOffset}
                />
              </svg>
              <div className="gauge-center-text">
                <strong>{doneCount}/{TOTAL_STEPS}</strong>
                <span>steps</span>
              </div>
            </div>

            {/* Checklist breakdown */}
            <div className="ritual-legend">
              <div className="legend-row">
                <span className="dot dot-green" />
                <span className="legend-name">Completed</span>
                <strong className="legend-score">{doneCount}</strong>
              </div>
              <div className="legend-row">
                <span className="dot dot-amber" />
                <span className="legend-name">In progress</span>
                <strong className="legend-score">0</strong>
              </div>
              <div className="legend-row">
                <span className="dot dot-gray" />
                <span className="legend-name">Remaining</span>
                <strong className="legend-score">{remainingCount}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Important Topics For You ── */}
      <section className="dash-topics-section">
        <div className="dash-section-header">
          <h2 className="dash-section-title">Important topics for you</h2>
          <Link to="/explore" className="dash-section-viewall">
            View all →
          </Link>
        </div>

        {/* 4 Cards linking to individual topic pages with matching photos */}
        <div className="dash-topics-grid">
          {/* Card 1: Everyday lifestyle -> links to ?topic=lifestyle */}
          <Link to="/explore?topic=lifestyle" className="topic-card">
            <div className="topic-card-thumb">
              <img
                src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80"
                alt="Everyday lifestyle - monstera potted plant"
                loading="lazy"
              />
            </div>
            <div className="topic-card-text">
              <h3>Everyday lifestyle</h3>
              <p>Simple habits, big impact</p>
            </div>
          </Link>

          {/* Card 2: What works for you -> links to ?topic=works-for-you */}
          <Link to="/explore?topic=works-for-you" className="topic-card">
            <div className="topic-card-thumb">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80"
                alt="What works for you - fresh salad bowl"
                loading="lazy"
              />
            </div>
            <div className="topic-card-text">
              <h3>What works for you</h3>
              <p>Personalised swaps</p>
            </div>
          </Link>

          {/* Card 3: Topics you care about -> links to ?topic=care-about */}
          <Link to="/explore?topic=care-about" className="topic-card">
            <div className="topic-card-thumb">
              <img
                src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&q=80"
                alt="Topics you care about - wind turbines on green hills"
                loading="lazy"
              />
            </div>
            <div className="topic-card-text">
              <h3>Topics you care about</h3>
              <p>Focus on what matters</p>
            </div>
          </Link>

          {/* Card 4: Your everyday choices -> links to ?topic=choices */}
          <Link to="/explore?topic=choices" className="topic-card">
            <div className="topic-card-thumb">
              <img
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80"
                alt="Your everyday choices - canvas tote bag"
                loading="lazy"
              />
            </div>
            <div className="topic-card-text">
              <h3>Your everyday choices</h3>
              <p>Smarter alternatives</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Row 3: Your 7-Day Plan & Saved Swaps ── */}
      <div className="dash-bottom-grid">
        {/* Left: Your 7-day plan */}
        <div className="dash-plan-card">
          <div className="plan-card-header">
            <div>
              <h3>Your 7-day plan</h3>
              <p>Complete simple actions each day.</p>
            </div>
            <Link to="/routine" className="plan-view-btn">
              View plan →
            </Link>
          </div>

          <div className="plan-days-row">
            {[
              { day: 1, label: 'Mon' },
              { day: 2, label: 'Tue' },
              { day: 3, label: 'Wed' },
              { day: 4, label: 'Thu' },
              { day: 5, label: 'Fri' },
              { day: 6, label: 'Sat' },
              { day: 7, label: 'Sun' },
            ].map(({ day, label }) => {
              const isDone = completedDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  className={`day-col ${isDone ? 'is-done' : ''}`}
                  onClick={() => toggleDay(day)}
                  title={`Toggle Day ${day} (${label})`}
                >
                  <div className="day-circle">
                    {isDone ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span>{day}</span>
                    )}
                  </div>
                  <span className="day-label">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Saved swaps */}
        <div className="dash-saved-card">
          <div className="saved-card-header">
            <div>
              <h3>Saved swaps</h3>
              <p>Your bookmarked ideas.</p>
            </div>
            <Link to="/catalogue" className="saved-view-all">
              View all →
            </Link>
          </div>

          <div className="saved-list">
            {/* Swap 1: Public Transport */}
            <div className="saved-item">
              <div className="saved-item-thumb">
                <img
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&q=80"
                  alt="Public transport"
                />
              </div>
              <div className="saved-item-info">
                <strong>Use public transport</strong>
                <span>-0.2t CO₂e/month</span>
              </div>
              <button
                type="button"
                className={`bookmark-btn ${bookmarked.transport ? 'is-bookmarked' : ''}`}
                onClick={() => toggleBookmark('transport')}
                aria-label="Bookmark public transport"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked.transport ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>

            {/* Swap 2: Plant-based meals */}
            <div className="saved-item">
              <div className="saved-item-thumb">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&q=80"
                  alt="Plant-based meals"
                />
              </div>
              <div className="saved-item-info">
                <strong>Eat more plant-based meals</strong>
                <span>-0.1t CO₂e/month</span>
              </div>
              <button
                type="button"
                className={`bookmark-btn ${bookmarked.food ? 'is-bookmarked' : ''}`}
                onClick={() => toggleBookmark('food')}
                aria-label="Bookmark plant-based meals"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked.food ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>

            {/* Swap 3: LED bulbs */}
            <div className="saved-item">
              <div className="saved-item-thumb">
                <img
                  src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=120&q=80"
                  alt="Switch to LED bulbs"
                />
              </div>
              <div className="saved-item-info">
                <strong>Switch to LED bulbs</strong>
                <span>-0.05t CO₂e/month</span>
              </div>
              <button
                type="button"
                className={`bookmark-btn ${bookmarked.energy ? 'is-bookmarked' : ''}`}
                onClick={() => toggleBookmark('energy')}
                aria-label="Bookmark LED bulbs"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked.energy ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dash-container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 2.2rem 2.5rem 4rem;
          color: var(--color-ink);
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Greeting Header ── */
        .dash-greeting-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.8rem;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .dash-greeting-small {
          font-size: 0.95rem;
          color: var(--color-ink-muted);
          display: block;
          margin-bottom: 0.15rem;
        }
        .dash-greeting-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-ink);
          letter-spacing: -0.025em;
          margin: 0 0 0.35rem;
          line-height: 1.1;
        }
        .wave-hand {
          display: inline-block;
          font-style: normal;
        }
        .dash-greeting-sub {
          font-size: 0.9rem;
          color: var(--color-ink-muted);
          margin: 0;
        }
        .dash-greeting-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }
        .dash-date-text {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-ink);
        }
        .dash-cheer-text {
          font-size: 0.75rem;
          color: #123826;
          font-weight: 600;
        }
        .dark .dash-cheer-text {
          color: #4dd282;
        }

        /* ── Impact Row ── */
        .dash-impact-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2.4rem;
        }

        /* Monthly Impact Card */
        .dash-impact-card {
          background: #143728;
          border-radius: 16px;
          padding: 2.2rem 2.4rem;
          color: #f4efe6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          box-shadow: 0 12px 36px rgba(15, 44, 31, 0.22);
          position: relative;
          overflow: hidden;
        }
        .dark .dash-impact-card {
          background: #0d281d;
          border: 1px solid rgba(80, 180, 120, 0.2);
        }
        .impact-card-left {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 2;
        }
        .impact-label {
          font-size: 0.78rem;
          font-weight: 500;
          color: rgba(244, 239, 230, 0.8);
          letter-spacing: 0.02em;
        }
        .impact-stat-group {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          margin: 0.2rem 0;
        }
        .impact-num {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1;
          color: #ffffff;
        }
        .impact-unit {
          font-size: 0.88rem;
          font-weight: 600;
          color: #a8dfbc;
        }
        .impact-badge-pill {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.85rem;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #ffffff;
          width: fit-content;
        }
        .impact-right-group {
          display: flex;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .impact-chart-bars {
          display: flex;
          align-items: flex-end;
          gap: 7px;
          height: 75px;
          width: 80px;
          flex-shrink: 0;
          position: relative;
          z-index: 2;
        }
        .impact-chart-bars .bar {
          flex: 1;
          background: linear-gradient(180deg, #6ee29f 0%, #20874e 100%);
          border-radius: 4px;
          box-shadow: 0 0 12px rgba(110, 226, 159, 0.35);
        }
        .impact-leaf-art {
          position: absolute;
          right: -30px;
          bottom: -30px;
          width: 140px;
          height: 140px;
          pointer-events: none;
          z-index: 1;
        }

        /* Ritual Completion Card */
        .dash-ritual-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 1.8rem 2rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04);
        }
        .ritual-card-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-ink);
          margin-bottom: 1.2rem;
          display: block;
        }
        .ritual-card-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex: 1;
        }
        .ritual-gauge-wrap {
          position: relative;
          width: 96px;
          height: 96px;
          flex-shrink: 0;
        }
        .ritual-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .gauge-bg {
          fill: none;
          stroke: #ede6dc;
        }
        .dark .gauge-bg { stroke: #26332a; }
        .gauge-fill {
          fill: none;
          stroke: #123826;
          stroke-linecap: round;
        }
        .dark .gauge-fill { stroke: #4dd282; }
        .gauge-center-text {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .gauge-center-text strong {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--color-ink);
          line-height: 1;
        }
        .gauge-center-text span {
          font-size: 0.68rem;
          color: var(--color-ink-muted);
          margin-top: 2px;
        }
        .ritual-legend {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          flex: 1;
        }
        .legend-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
        }
        .legend-row .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 0.6rem;
          flex-shrink: 0;
        }
        .dot-green { background: #123826; }
        .dot-amber { background: #d98a3b; }
        .dot-gray { background: #b8b0a5; }
        .legend-name {
          color: var(--color-ink-muted);
          flex: 1;
        }
        .legend-score {
          font-size: 0.8rem;
          color: var(--color-ink);
        }

        /* ── Important Topics ── */
        .dash-topics-section {
          margin-bottom: 2.6rem;
        }
        .dash-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.1rem;
        }
        .dash-section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0;
        }
        .dash-section-viewall {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-ink-muted);
          text-decoration: none;
          transition: color 0.15s;
        }
        .dash-section-viewall:hover {
          color: #123826;
        }
        .dash-topics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .topic-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 14px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .topic-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          border-color: rgba(18, 56, 38, 0.4);
        }
        .topic-card-thumb {
          width: 100%;
          height: 125px;
          overflow: hidden;
        }
        .topic-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .topic-card:hover .topic-card-thumb img {
          transform: scale(1.06);
        }
        .topic-card-text {
          padding: 1rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }
        .topic-card-text h3 {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0;
        }
        .topic-card-text p {
          font-size: 0.75rem;
          color: var(--color-ink-muted);
          margin: 0;
        }

        /* ── Bottom Grid ── */
        .dash-bottom-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 1.5rem;
        }

        /* 7-Day Plan Card */
        .dash-plan-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 1.8rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04);
        }
        .plan-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .plan-card-header h3 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0 0 0.25rem;
        }
        .plan-card-header p {
          font-size: 0.78rem;
          color: var(--color-ink-muted);
          margin: 0;
        }
        .plan-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 1rem;
          background: #123826;
          color: #f4efe6;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 999px;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .plan-view-btn:hover {
          background: #1e5239;
          transform: translateY(-1px);
        }
        .plan-days-row {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .day-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .day-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid var(--color-border-strong);
          color: var(--color-ink-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.82rem;
          font-weight: 600;
          transition: all 0.2s;
        }
        .day-col:hover .day-circle {
          border-color: #123826;
          color: #123826;
        }
        .day-col.is-done .day-circle {
          background: #123826;
          border-color: #123826;
          color: #ffffff;
        }
        .dark .day-col.is-done .day-circle {
          background: #39aa6a;
          border-color: #39aa6a;
        }
        .day-label {
          font-size: 0.7rem;
          color: var(--color-ink-muted);
          font-weight: 500;
        }

        /* Saved Swaps Card */
        .dash-saved-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 1.8rem 2rem;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04);
        }
        .saved-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.4rem;
        }
        .saved-card-header h3 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0 0 0.25rem;
        }
        .saved-card-header p {
          font-size: 0.78rem;
          color: var(--color-ink-muted);
          margin: 0;
        }
        .saved-view-all {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-ink-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .saved-view-all:hover {
          color: #123826;
        }
        .saved-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .saved-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.4rem 0;
        }
        .saved-item-thumb {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }
        .saved-item-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .saved-item-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          flex: 1;
        }
        .saved-item-info strong {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-ink);
        }
        .saved-item-info span {
          font-size: 0.72rem;
          color: var(--color-ink-muted);
        }
        .bookmark-btn {
          background: none;
          border: none;
          color: var(--color-ink-muted);
          cursor: pointer;
          padding: 0.4rem;
          transition: color 0.15s, transform 0.15s;
        }
        .bookmark-btn:hover {
          color: #123826;
          transform: scale(1.1);
        }
        .bookmark-btn.is-bookmarked {
          color: #123826;
        }
        .dark .bookmark-btn.is-bookmarked {
          color: #4dd282;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .dash-impact-row { grid-template-columns: 1fr; }
          .dash-topics-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-bottom-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .dash-container { padding: 1.5rem 1rem; }
          .dash-topics-grid { grid-template-columns: 1fr; }
          .dash-impact-card { flex-direction: column; align-items: flex-start; }
          .plan-days-row { gap: 0.25rem; }
          .day-circle { width: 30px; height: 30px; font-size: 0.75rem; }
        }

        /* Dashboard refresh: align with GreenSwap's warm editorial, forest-green design system. */
        .dash-container {
          width:100%;
          max-width:1460px;
          margin:0 auto;
          padding:2.15rem clamp(1.15rem,3.1vw,3.25rem) 4.25rem;
          color:#20382a;
          font-family:'DM Sans',sans-serif;
        }
        .dash-page-eyebrow {
          display:inline-flex; align-items:center; gap:9px;
          color:#75866e; font-size:.67rem; font-weight:850;
          letter-spacing:.18em; line-height:1.2; text-transform:uppercase;
          margin-bottom:.7rem;
        }
        .dash-page-eyebrow:before {
          content:""; width:22px; height:2px; border-radius:2px; background:#9ba987;
        }
        .dash-greeting-row {
          align-items:flex-end; margin-bottom:1.9rem; gap:1rem;
        }
        .dash-greeting-title {
          color:#20392a; font-size:clamp(2.05rem,3vw,2.75rem);
          line-height:1.04; letter-spacing:-.045em; margin:0 0 .55rem;
        }
        .dash-greeting-sub { max-width:600px; color:#788176; font-size:.98rem; line-height:1.65; }
        .dash-greeting-right {
          align-items:flex-end; gap:.42rem; padding:12px 16px;
          border:1px solid #e6dfd2; border-radius:16px; background:rgba(255,253,248,.76);
          box-shadow:0 5px 16px rgba(49,54,42,.035);
        }
        .dash-date-text { color:#344a38; font-size:.78rem; font-weight:800; letter-spacing:.025em; }
        .dash-cheer-text { color:#7b8d70; font-size:.73rem; font-weight:700; }

        .dash-impact-row {
          grid-template-columns:minmax(0,1.38fr) minmax(355px,.92fr);
          gap:1.15rem; margin-bottom:2.4rem;
        }
        .dash-impact-card {
          min-height:238px; padding:2rem 2.25rem;
          border:1px solid rgba(217,230,213,.16); border-radius:26px;
          background:
            radial-gradient(circle at 90% 12%,rgba(175,203,160,.19),transparent 34%),
            radial-gradient(circle at 8% 100%,rgba(121,167,130,.16),transparent 45%),
            linear-gradient(118deg,#102e20 0%,#1c4932 56%,#315c42 100%);
          box-shadow:0 18px 38px rgba(18,53,35,.18),inset 0 1px 0 rgba(255,255,255,.1);
        }
        .dash-impact-card:before {
          content:""; position:absolute; inset:0; pointer-events:none; opacity:.18;
          background-image:radial-gradient(rgba(255,255,255,.24) .65px,transparent .65px);
          background-size:17px 17px; mask-image:linear-gradient(110deg,transparent 0%,#000 70%);
        }
        .impact-card-left { gap:.72rem; }
        .impact-label {
          display:inline-flex; align-items:center; gap:8px; color:#c8d8c6;
          font-size:.7rem; font-weight:850; letter-spacing:.14em; text-transform:uppercase;
        }
        .impact-label:before { content:""; width:7px; height:7px; border-radius:50%; background:#b8d99d; box-shadow:0 0 0 4px rgba(184,217,157,.13); }
        .impact-stat-group { gap:.32rem; margin:.3rem 0; }
        .impact-num { color:#fffdf6; font-size:clamp(3.5rem,5vw,4.7rem); letter-spacing:-.055em; text-shadow:0 5px 22px rgba(0,0,0,.15); }
        .impact-unit { color:#d1e3cb; font-size:.96rem; font-weight:650; }
        .impact-badge-pill {
          padding:.48rem .9rem; border:1px solid rgba(211,231,201,.22);
          background:rgba(255,255,255,.11); color:#edf5e8; font-size:.72rem;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.08);
        }
        .impact-chart-bars { width:112px; height:104px; gap:9px; align-items:flex-end; }
        .impact-chart-bars .bar {
          border-radius:7px 7px 3px 3px;
          background:linear-gradient(180deg,#d6e9bd 0%,#8fbe8f 45%,#4b9166 100%);
          box-shadow:0 0 18px rgba(177,225,170,.25),inset 0 1px 0 rgba(255,255,255,.42);
          transform:skewY(-3deg);
        }
        .impact-chart-bars .bar-1,.impact-chart-bars .bar-2 { opacity:.62; }
        .impact-leaf-art { width:180px; height:180px; right:-28px; bottom:-46px; }

        .dash-ritual-card {
          position:relative; overflow:hidden; padding:1.65rem 1.8rem;
          border:1px solid #e5ddcf; border-radius:26px;
          background:
            radial-gradient(circle at 100% 0%,rgba(223,214,191,.32),transparent 36%),
            linear-gradient(145deg,#fffdf8 0%,#f5f0e6 100%);
          box-shadow:0 12px 28px rgba(57,54,42,.065),inset 0 1px 0 #fff;
        }
        .dash-ritual-card:after {
          content:""; position:absolute; width:200px; height:200px; right:-118px; bottom:-128px;
          border:1px solid rgba(104,129,91,.13); border-radius:50%; box-shadow:0 0 0 18px rgba(104,129,91,.035),0 0 0 38px rgba(104,129,91,.025);
          pointer-events:none;
        }
        .ritual-card-title {
          position:relative; z-index:1; display:block; margin:0 0 1.3rem;
          color:#344b38; font:700 1.2rem/1.2 'Fraunces',Georgia,serif;
          letter-spacing:-.02em;
        }
        .ritual-card-body { position:relative; z-index:1; justify-content:flex-start; gap:1.4rem; }
        .ritual-gauge-wrap { width:120px; height:120px; }
        .ritual-svg { overflow:visible; }
        .gauge-bg { stroke:#e6e3d8; stroke-width:8; }
        .gauge-fill {
          stroke:#28583b; stroke-width:8; filter:drop-shadow(0 2px 3px rgba(40,88,59,.18));
          transition:stroke-dashoffset .55s cubic-bezier(.2,.7,.2,1);
        }
        .gauge-center-text strong { color:#223b2b; font-size:1.55rem; letter-spacing:-.04em; }
        .gauge-center-text span { color:#899084; font-size:.67rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; }
        .ritual-legend { gap:.78rem; }
        .legend-row { font-size:.82rem; }
        .legend-name { color:#778174; }
        .legend-score { color:#2a4431; font-size:.85rem; font-weight:800; }
        .dot-green { background:#3f7850; }
        .dot-amber { background:#c99a5e; }
        .dot-gray { background:#c3c0b5; }

        .dash-topics-section { margin-bottom:2.55rem; }
        .dash-section-header { align-items:flex-end; margin-bottom:1.12rem; }
        .dash-section-title {
          color:#263c2d; font:700 1.42rem/1.2 'Fraunces',Georgia,serif;
          letter-spacing:-.025em;
        }
        .dash-section-viewall,.saved-view-all {
          display:inline-flex; align-items:center; gap:6px; color:#527255;
          font-size:.79rem; font-weight:800; text-decoration:none;
        }
        .dash-section-viewall:hover,.saved-view-all:hover { color:#1f4b31; text-decoration:underline; text-underline-offset:4px; }
        .dash-topics-grid { grid-template-columns:repeat(4,minmax(0,1fr)); gap:1.1rem; }
        .topic-card {
          border:1px solid #e7dfd3; border-radius:20px; background:#fffdf8;
          box-shadow:0 7px 20px rgba(51,54,42,.045),inset 0 1px 0 #fff;
        }
        .topic-card:hover {
          transform:translateY(-5px); border-color:#c9d3bd;
          box-shadow:0 15px 28px rgba(47,62,44,.1);
        }
        .topic-card-thumb { height:148px; background:#e9e8dd; }
        .topic-card-thumb img { object-position:center; }
        .topic-card-text { gap:.38rem; padding:1.08rem 1.15rem 1.15rem; }
        .topic-card-text h3 { color:#2d4332; font-size:.98rem; font-weight:800; letter-spacing:-.015em; }
        .topic-card-text p { color:#858b7e; font-size:.82rem; line-height:1.5; }

        .dash-bottom-grid { grid-template-columns:minmax(0,1.08fr) minmax(0,1fr); gap:1.15rem; }
        .dash-plan-card,.dash-saved-card {
          border:1px solid #e5ddcf; border-radius:24px; background:linear-gradient(145deg,#fffdf8,#f8f4ec);
          box-shadow:0 10px 26px rgba(57,54,42,.055),inset 0 1px 0 #fff;
        }
        .dash-plan-card { padding:1.7rem 1.85rem 1.8rem; }
        .dash-saved-card { padding:1.7rem 1.8rem; }
        .plan-card-header,.saved-card-header { margin-bottom:1.55rem; }
        .plan-card-header h3,.saved-card-header h3 {
          color:#263c2d; font:700 1.36rem/1.2 'Fraunces',Georgia,serif; letter-spacing:-.025em;
        }
        .plan-card-header p,.saved-card-header p { color:#81887c; font-size:.82rem; line-height:1.55; }
        .plan-view-btn {
          padding:.65rem 1.05rem; border:1px solid #173d29; border-radius:999px;
          background:#173d29; color:#fffaf1; font-size:.78rem; font-weight:800;
          box-shadow:0 6px 14px rgba(23,61,41,.13);
        }
        .plan-view-btn:hover { background:#2b5b3e; }
        .plan-days-row { gap:.45rem; padding:.95rem .8rem .25rem; border-radius:18px; background:#f2f0e7; }
        .day-col { gap:.6rem; min-width:35px; }
        .day-circle {
          width:42px; height:42px; border:1.5px solid #d8d8ca;
          color:#81887d; background:#fffdf8; font-size:.83rem; font-weight:800;
          box-shadow:0 3px 8px rgba(56,58,45,.035);
        }
        .day-col:hover .day-circle { border-color:#78936e; color:#315b3e; }
        .day-col.is-done .day-circle {
          border-color:#214b32; color:#fff; background:linear-gradient(145deg,#2f6b43,#163d29);
          box-shadow:0 5px 12px rgba(28,71,45,.17),inset 0 1px 0 rgba(255,255,255,.2);
        }
        .day-label { color:#778174; font-size:.72rem; font-weight:700; }
        .dash-saved-card { min-width:0; }
        .saved-list { gap:.7rem; }
        .saved-item {
          gap:.85rem; padding:.68rem .72rem; border:1px solid #ebe4d8; border-radius:15px;
          background:rgba(255,255,255,.56); transition:border-color .16s ease,background .16s ease,transform .16s ease;
        }
        .saved-item:hover { transform:translateY(-1px); border-color:#ccd7c4; background:#fffdf8; }
        .saved-item-thumb { width:58px; height:58px; border-radius:13px; overflow:hidden; background:#e7e9de; }
        .saved-item-thumb img { width:100%; height:100%; object-fit:cover; }
        .saved-item-info { gap:4px; }
        .saved-item-info strong { color:#2c4232; font-size:.86rem; line-height:1.35; }
        .saved-item-info span { color:#72816f; font-size:.75rem; font-weight:700; }
        .bookmark-btn {
          width:36px; height:36px; border:1px solid #e4dfd3; border-radius:11px;
          color:#9b9b8e; background:#fffdf8; transition:all .16s ease;
        }
        .bookmark-btn.is-bookmarked { border-color:#d1dfce; color:#3e744b; background:#edf3e9; }
        .bookmark-btn:hover { transform:translateY(-1px); border-color:#9eaf93; }

        @media (max-width:1180px) {
          .dash-impact-row { grid-template-columns:minmax(0,1fr); }
          .dash-ritual-card { min-height:205px; }
          .dash-bottom-grid { grid-template-columns:minmax(0,1fr); }
        }
        @media (max-width:900px) {
          .dash-topics-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .dash-container { padding-left:1.5rem; padding-right:1.5rem; }
        }
        @media (max-width:640px) {
          .dash-container { padding:1.25rem 1rem 2.5rem; }
          .dash-greeting-row { align-items:flex-start; flex-direction:column; }
          .dash-greeting-right { align-items:flex-start; width:100%; }
          .dash-impact-card { min-height:245px; padding:1.55rem 1.35rem; gap:1.25rem; flex-direction:row; align-items:center; }
          .impact-num { font-size:3.4rem; }
          .impact-chart-bars { width:72px; height:78px; gap:5px; }
          .dash-ritual-card { padding:1.45rem 1.25rem; }
          .ritual-gauge-wrap { width:104px; height:104px; }
          .ritual-card-body { gap:1rem; }
          .dash-topics-grid { grid-template-columns:1fr 1fr; gap:.7rem; }
          .topic-card-thumb { height:112px; }
          .topic-card-text { padding:.85rem .82rem .9rem; }
          .topic-card-text h3 { font-size:.85rem; }
          .topic-card-text p { font-size:.72rem; }
          .dash-plan-card,.dash-saved-card { padding:1.3rem 1rem; }
          .plan-card-header,.saved-card-header { flex-direction:column; align-items:flex-start; gap:.8rem; }
          .plan-days-row { gap:.15rem; padding:.8rem .35rem .2rem; }
          .day-circle { width:34px; height:34px; }
          .day-label { font-size:.64rem; }
        }
        @media (max-width:390px) {
          .dash-impact-card { align-items:flex-start; flex-direction:column; }
          .impact-right-group { align-self:flex-end; }
          .dash-topics-grid { grid-template-columns:1fr; }
        }
        @media(prefers-reduced-motion:reduce) {
          .topic-card,.topic-card-thumb img,.day-circle,.saved-item { transition:none; }
        }

            `}</style>
    </div>
  );
}