import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

interface ExploreCardItem {
  id: string;
  title: string;
  category: 'transport' | 'food' | 'energy' | 'shopping' | 'waste' | 'home';
  co2Saving: string;
  image: string;
  topics: string[];
}

const EXPLORE_ITEMS: ExploreCardItem[] = [
  {
    id: 'transit',
    title: 'Swap to public transport',
    category: 'transport',
    co2Saving: 'Save up to 0.2t CO2e / month',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
    topics: ['lifestyle', 'all'],
  },
  {
    id: 'plant',
    title: 'Eat more plant-based meals',
    category: 'food',
    co2Saving: 'Save up to 0.3t CO2e / month',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
    topics: ['works-for-you', 'food', 'all'],
  },
  {
    id: 'appliances',
    title: 'Use energy efficient appliances',
    category: 'energy',
    co2Saving: 'Save up to 0.1t CO2e / month',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80',
    topics: ['care-about', 'energy', 'home', 'all'],
  },
  {
    id: 'food-waste',
    title: 'Avoid food waste',
    category: 'food',
    co2Saving: 'Save up to 0.15t CO2e / month',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80',
    topics: ['works-for-you', 'food', 'lifestyle', 'all'],
  },
  {
    id: 'secondhand',
    title: 'Buy second-hand',
    category: 'shopping',
    co2Saving: 'Save up to 0.05t CO2e / month',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
    topics: ['choices', 'shopping', 'all'],
  },
  {
    id: 'reusable',
    title: 'Choose reusable items',
    category: 'shopping',
    co2Saving: 'Save up to 0.05t CO2e / month',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
    topics: ['choices', 'shopping', 'lifestyle', 'all'],
  },
  {
    id: 'bldc-fan',
    title: 'BLDC Ceiling Fans',
    category: 'energy',
    co2Saving: 'Save up to 0.08t CO2e / month',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
    topics: ['care-about', 'energy', 'home', 'all'],
  },
  {
    id: 'composting',
    title: 'Aerobic Khamba Composting',
    category: 'waste',
    co2Saving: 'Save up to 0.06t CO2e / month',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
    topics: ['choices', 'waste', 'home', 'all'],
  },
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

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'transport', label: 'Transport' },
  { id: 'food', label: 'Food' },
  { id: 'energy', label: 'Energy' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'waste', label: 'Waste' },
  { id: 'home', label: 'Home' },
];

export function ExplorePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const topicParam = searchParams.get('topic');
  const catParam = searchParams.get('cat');

  const [activeCategory, setActiveCategory] = useState<string>(catParam ?? 'all');

  useEffect(() => {
    if (catParam) {
      setActiveCategory(catParam);
    }
  }, [catParam]);

  const currentTopic = topicParam ? TOPIC_METAS[topicParam] : null;

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'all') {
      newParams.delete('cat');
    } else {
      newParams.set('cat', cat);
    }
    setSearchParams(newParams);
  };

  const clearTopic = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('topic');
    setSearchParams(newParams);
  };
  const handleCardClick = (id: string) => {
    navigate(`/explore/${id}`);
  };
  const filteredItems = useMemo(() => {
    return EXPLORE_ITEMS.filter((item) => {
      const matchCat =
        activeCategory === 'all' ||
        item.category === activeCategory ||
        (activeCategory === 'home' && item.topics.includes('home'));

      const matchTopic =
  !topicParam ||
  item.topics.includes(topicParam) ||
  item.id === topicParam;

      return matchCat && matchTopic;
    });
  }, [activeCategory, topicParam]);

  return (
    <div className="discover-root">
      {/* ── Topic Banner (shown when a specific Important Topic is clicked) ── */}
      {currentTopic && (
        <div
          className="topic-spotlight-banner"
          style={{ background: currentTopic.bannerBg }}
        >
          <div className="topic-banner-text">
            <span className="topic-banner-pill">SELECTED TOPIC</span>
            <p className="topic-banner-title">{currentTopic.title}</p>
            <p className="topic-banner-desc">{currentTopic.desc}</p>
          </div>
          <button type="button" className="topic-clear-btn" onClick={clearTopic}>
            Show all topics ✕
          </button>
        </div>
      )}

      {/* ── Main Header ── */}
      <div className="discover-header">
        <div className="discover-header-text">
          <h1 className="discover-title">
            Discover <span className="discover-italic">a better everyday.</span>
          </h1>
          <p className="discover-sub">
            Explore ideas, tips and stories to live well with a lighter footprint.
          </p>
        </div>

        {/* Botanical watermark leaf */}
        <div className="discover-watermark" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 100 C40 80 50 40 100 20 C80 50 40 70 20 100Z"
              fill="#33593A"
              opacity="0.12"
            />
            <path
              d="M30 60 C50 50 70 40 90 25"
              stroke="#33593A"
              strokeWidth="1.5"
              opacity="0.2"
            />
          </svg>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="discover-tabs-bar">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`discover-tab ${activeCategory === id ? 'is-active' : ''}`}
            onClick={() => handleCategoryChange(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── 6 Cards Grid (Matching Reference Image) ── */}
      <div className="discover-cards-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="discover-card cursor-pointer" onClick={() => handleCardClick(item.id)}>
            <div className="discover-card-img">
              <img src={item.image} alt={item.title} loading="lazy" />
            </div>
            <div className="discover-card-body">
              <h2 className="discover-card-name">{item.title}</h2>
              <p className="discover-card-co2">{item.co2Saving}</p>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="discover-empty">
            <p>No swaps found for this combination.</p>
            <button
              type="button"
              className="discover-reset-btn"
              onClick={() => {
                setActiveCategory('all');
                clearTopic();
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        .discover-root {
          max-width: 1140px;
          margin: 0 auto;
          padding: 2.4rem 2.5rem 4rem;
          font-family: 'DM Sans', sans-serif;
          color: var(--color-ink);
          position: relative;
        }

        /* ── Topic Spotlight Banner ── */
        .topic-spotlight-banner {
          border-radius: 16px;
          padding: 1.8rem 2.2rem;
          margin-bottom: 2rem;
          color: #f4efe6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          animation: gs-page-in 0.3s ease both;
        }
        .topic-banner-pill {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #a8dfbc;
          display: block;
          margin-bottom: 0.3rem;
        }
        .topic-banner-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.6rem;
          font-weight: 700;
          margin: 0 0 0.3rem;
          color: #ffffff;
        }
        .topic-banner-desc {
          font-size: 0.85rem;
          color: rgba(244, 239, 230, 0.8);
          margin: 0;
        }
        .topic-clear-btn {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          border-radius: 999px;
          padding: 0.45rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .topic-clear-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        /* ── Header ── */
        .discover-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          position: relative;
          margin-bottom: 1.8rem;
        }
        .discover-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 2.4rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--color-ink);
          margin: 0 0 0.4rem;
          line-height: 1.15;
        }
        .discover-italic {
          font-style: italic;
          font-weight: 400;
          display: block;
          color: #123826;
        }
        .dark .discover-italic {
          color: #4dd282;
        }
        .discover-sub {
          font-size: 0.9rem;
          color: var(--color-ink-muted);
          margin: 0;
          max-width: 45ch;
          line-height: 1.5;
        }
        .discover-watermark {
          width: 90px;
          height: 90px;
          opacity: 0.6;
          pointer-events: none;
        }
        .discover-watermark svg {
          width: 100%;
          height: 100%;
        }

        /* ── Filter Tabs Bar ── */
        .discover-tabs-bar {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        .discover-tab {
          padding: 0.4rem 1.1rem;
          border-radius: 999px;
          border: 1px solid #DFD7CA;
          background: #FAF8F4;
          color: var(--color-ink-muted);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .dark .discover-tab {
          background: #141c17;
          border-color: #24352b;
        }
        .discover-tab:hover {
          border-color: #123826;
          color: var(--color-ink);
        }
        .discover-tab.is-active {
          background: #123826;
          border-color: #123826;
          color: #ffffff;
          font-weight: 600;
        }
        .dark .discover-tab.is-active {
          background: #3eac6a;
          border-color: #3eac6a;
          color: #0c130f;
        }

        /* ── 3x2 Cards Grid ── */
        .discover-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .discover-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .discover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
          border-color: rgba(18, 56, 38, 0.35);
        }
        .discover-card-img {
          width: 100%;
          height: 160px;
          overflow: hidden;
        }
        .discover-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .discover-card:hover .discover-card-img img {
          transform: scale(1.05);
        }
        .discover-card-body {
          padding: 1.15rem 1.25rem 1.3rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .discover-card-name {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0;
          line-height: 1.35;
        }
        .discover-card-co2 {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-ink-muted);
          margin: 0;
        }

        .discover-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 1rem;
          color: var(--color-ink-muted);
        }
        .discover-reset-btn {
          margin-top: 1rem;
          padding: 0.5rem 1.2rem;
          border-radius: 999px;
          background: #123826;
          color: #fff;
          border: none;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .discover-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .discover-cards-grid {
            grid-template-columns: 1fr;
          }
          .discover-root {
            padding: 1.5rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
