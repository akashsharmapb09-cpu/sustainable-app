import { useState } from 'react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const [completedDays, setCompletedDays] = useState<number[]>([1, 2, 3]);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({
    transport: true,
    food: true,
    energy: true,
  });

  const toggleDay = (d: number) => {
    setCompletedDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="dash-container">
      {/* ── Top Greeting Header (Matching Image Exactly) ── */}
      <header className="dash-greeting-row">
        <div>
          <span className="dash-greeting-small">Good morning,</span>
          <h1 className="dash-greeting-title">
            Akash <span className="wave-hand">👋</span>
          </h1>
          <p className="dash-greeting-sub">Small changes today. A lighter tomorrow.</p>
        </div>
        <div className="dash-greeting-right">
          <span className="dash-date-text">Mon, 19 Oct 2026</span>
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
                  strokeDashoffset="143"
                />
              </svg>
              <div className="gauge-center-text">
                <strong>3/7</strong>
                <span>steps</span>
              </div>
            </div>

            {/* Checklist breakdown */}
            <div className="ritual-legend">
              <div className="legend-row">
                <span className="dot dot-green" />
                <span className="legend-name">Completed</span>
                <strong className="legend-score">3</strong>
              </div>
              <div className="legend-row">
                <span className="dot dot-amber" />
                <span className="legend-name">In progress</span>
                <strong className="legend-score">1</strong>
              </div>
              <div className="legend-row">
                <span className="dot dot-gray" />
                <span className="legend-name">Remaining</span>
                <strong className="legend-score">3</strong>
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
      `}</style>
    </div>
  );
}
