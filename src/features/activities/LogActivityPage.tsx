import { useState } from 'react';
import {
  Check, Flame, TrendingDown, Droplets, Wallet, Calendar, Leaf,
  ArrowUpRight, TrainFront, Utensils, Lightbulb, ShoppingBag, Bike,
  Sparkles, ChevronRight, Zap, Clock3, ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoutineAction {
  id: string; label: string; category: string; saving: string; completed: boolean;
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

const actionIcons = { Shopping: ShoppingBag, Food: Utensils, Transport: Bike, Energy: Lightbulb, Home: Droplets };
const swaps = [
  { title: 'Metro commute for office workdays', cat: 'Transport', co2: '-75 kg CO₂e / mo', money: 'Save ~₹3,200/mo', status: 'Adopted 3 weeks ago', icon: TrainFront, tone: 'transport', detail: 'A lower-carbon way to get to work', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=85' },
  { title: 'Eat plant-based weekday lunches', cat: 'Food', co2: '-30 kg CO₂e / mo', money: 'Save ~₹1,100/mo', status: 'Adopted 2 weeks ago', icon: Utensils, tone: 'food', detail: 'More plants, less food-related impact', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&auto=format&fit=crop&q=85' },
  { title: 'AC 24°C thermostat setpoint', cat: 'Energy', co2: '-40 kg CO₂e / mo', money: 'Save ~₹680/mo', status: 'Adopted 1 month ago', icon: Zap, tone: 'energy', detail: 'Comfortable cooling with less energy', image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=85' },
  { title: 'Cloth totes for market purchases', cat: 'Shopping', co2: '-5 kg CO₂e / mo', money: 'Zero plastic waste', status: 'Adopted 2 months ago', icon: ShoppingBag, tone: 'shopping', detail: 'A reusable choice on every shopping trip', image: 'https://images.unsplash.com/photo-1597481499666-9a2c8d9dcbd2?w=1200&auto=format&fit=crop&q=85' },
];

export function LogActivityPage() {
  const [actions, setActions] = useState<RoutineAction[]>(INITIAL_ACTIONS);
  const [activeTab, setActiveTab] = useState<'plan' | 'swaps' | 'analytics'>('plan');
  const toggleAction = (id: string) => setActions((prev) => prev.map((a) => a.id === id ? { ...a, completed: !a.completed } : a));
  const completedCount = actions.filter((a) => a.completed).length;
  const completionPercent = Math.round((completedCount / actions.length) * 100);

  return (
    <div className="routine-premium">
      <header className="routine-page-header">
        <div className="routine-heading-copy">
          <div className="routine-eyebrow"><Leaf size={14} /> YOUR EVERYDAY, BETTER</div>
          <h1 className="routine-page-title">Your routine<span>.</span></h1>
          <p className="routine-page-subtitle">Small, thoughtful habits. A lighter footprint, one day at a time.</p>
        </div>
        <div className="routine-streak-chip">
          <span className="routine-streak-icon"><Flame size={18} /></span>
          <span><small>Current streak</small><strong>14 days</strong></span>
          <Sparkles className="routine-streak-sparkle" size={15} />
        </div>
      </header>

      <nav className="routine-premium-tabs" aria-label="Routine sections">
        <button type="button" className={`routine-premium-tab ${activeTab === 'plan' ? 'is-active' : ''}`} onClick={() => setActiveTab('plan')}><span className="tab-step">01</span> 7-day plan</button>
        <button type="button" className={`routine-premium-tab ${activeTab === 'swaps' ? 'is-active' : ''}`} onClick={() => setActiveTab('swaps')}><span className="tab-step">02</span> Your swaps</button>
        <button type="button" className={`routine-premium-tab ${activeTab === 'analytics' ? 'is-active' : ''}`} onClick={() => setActiveTab('analytics')}><span className="tab-step">03</span> Analytics</button>
      </nav>

      {activeTab === 'plan' && (
        <div className="routine-plan-view">
          <section className="routine-plan-hero">
            <div className="plan-hero-photo" aria-hidden="true" />
            <div className="plan-hero-glow" />
            <div className="plan-hero-content">
              <div className="plan-hero-kicker"><Sparkles size={14} /> YOUR WEEK, IN BALANCE</div>
              <h2>A lighter week starts<br />with one small win.</h2>
              <p>Build momentum with simple daily actions. Every completed habit moves your household in a greener direction.</p>
              <div className="plan-progress-meta"><span>{completedCount} of 7 daily rituals complete</span><strong>{completionPercent}%</strong></div>
              <div className="plan-progress-track"><span style={{ width: `${completionPercent}%` }} /></div>
              <div className="plan-hero-foot"><span><Check size={13} /> {completedCount} wins collected</span><span>{7 - completedCount} left this week</span></div>
            </div>
            <div className="plan-ring-wrap">
              <div className="plan-progress-ring" style={{ background: `conic-gradient(#7fe0a7 ${completionPercent * 3.6}deg, rgba(255,255,255,.13) 0deg)` }}>
                <div className="plan-ring-inner"><strong>{completionPercent}%</strong><span>complete</span></div>
              </div>
              <div className="plan-ring-caption"><Flame size={14} /> Keep your streak alive</div>
            </div>
          </section>

          <div className="routine-plan-grid">
            <section className="routine-premium-card challenge-panel challenge-panel-editorial">
              <div className="panel-heading-row">
                <div><div className="panel-eyebrow">THE DAILY CHECK-IN</div><h2 className="routine-section-title">Your 7-day challenge</h2><p className="routine-section-subtitle">A few small actions add up to meaningful change.</p></div>
                <span className="challenge-count-pill">{completedCount}<i>/7</i></span>
              </div>
              <div className="routine-premium-checklist">
                {actions.map((act, index) => {
                  const Icon = actionIcons[act.category as keyof typeof actionIcons] || Leaf;
                  return (
                    <button key={act.id} type="button" aria-pressed={act.completed} className={`premium-checklist-item ${act.completed ? 'is-complete' : ''}`} onClick={() => toggleAction(act.id)}>
                      <span className="action-number">{String(index + 1).padStart(2, '0')}</span>
                      <span className={`action-category-icon category-${act.category.toLowerCase()}`}><Icon size={18} /></span>
                      <span className="action-main-copy"><strong>{act.label}</strong><small>{act.category} <span>·</span> Daily ritual</small></span>
                      <span className="action-impact-pill">{act.saving}</span>
                      <span className="premium-action-check">{act.completed ? <Check size={15} strokeWidth={3} /> : <ChevronRight size={17} />}</span>
                    </button>
                  );
                })}
              </div>
              <div className="challenge-panel-footer"><span><ShieldCheck size={15} /> Progress is saved as you go</span><span>{7 - completedCount} habits to complete</span></div>
            </section>

            <aside className="routine-plan-aside">
              <section className="today-tip-card">
                <div className="tip-topline"><span className="tip-icon-bubble"><Droplets size={18} /></span><span className="tip-label">A LITTLE GREEN INSPIRATION</span><Sparkles size={16} className="tip-sparkle" /></div>
                <h3>Today&apos;s lighter-living tip</h3>
                <p>Take a shower that&apos;s five minutes shorter. You could save up to <strong>20 litres of water</strong> while using less energy to heat it.</p>
                <div className="tip-bottom-line"><span>WATER SAVING</span><strong>~20 L <ArrowUpRight size={14} /></strong></div>
              </section>
              <section className="routine-quote-card">
                <div className="quote-orbit quote-orbit-one" /><div className="quote-orbit quote-orbit-two" />
                <span className="quote-mark">“</span><p>Progress, not perfection,<br />leads to a cleaner planet.</p>
                <div className="quote-attribution"><span /> A GREENER EVERYDAY</div><Leaf className="quote-leaf-mark" size={34} />
              </section>
              <div className="aside-mini-note"><span className="aside-mini-icon"><Clock3 size={16} /></span><span><strong>Consistency over intensity</strong><small>Small routines are easier to keep.</small></span></div>
            </aside>
          </div>
        </div>
      )}

      {activeTab === 'swaps' && (
        <div className="routine-swaps-view">
          <section className="swaps-hero-panel">
            <div className="swaps-hero-copy">
              <div className="panel-eyebrow light-eyebrow"><Leaf size={13} /> MAKING BETTER CHOICES STICK</div>
              <h2>Active adopted swaps</h2>
              <p>Your everyday alternatives are building real momentum. Here&apos;s what is already working in your household.</p>
              <Link to="/catalogue" className="swaps-browse-button">Explore more swaps <ArrowUpRight size={16} /></Link>
            </div>
            <div className="swaps-hero-stats">
              <div><span>ACTIVE SWAPS</span><strong>04</strong><small>Across 4 categories</small></div>
              <div><span>MONTHLY CO₂E AVOIDED</span><strong>150 <i>kg</i></strong><small>From your adopted habits</small></div>
              <div><span>ESTIMATED SAVINGS</span><strong>₹4,980</strong><small>Per month</small></div>
            </div>
          </section>
          <div className="swaps-section-heading">
            <div><span className="panel-eyebrow">YOUR HOUSEHOLD PLAYBOOK</span><h3>Habits that are making a difference</h3></div>
            <span className="swaps-active-label"><span /> All swaps active</span>
          </div>
          <div className="premium-swaps-grid">
            {swaps.map((swap, index) => {
              const Icon = swap.icon;
              return (
                <article key={swap.title} className={`premium-swap-card tone-${swap.tone}`}>
                  <img className="swap-card-image" src={swap.image} alt="" loading="lazy" />
                  <div className="swap-card-scrim" aria-hidden="true" />
                  <div className="swap-card-top"><span className="swap-feature-icon"><Icon size={21} /></span><span className="swap-active-status"><span /> ACTIVE</span><span className="swap-card-index">0{index + 1}</span></div>
                  <div className="swap-card-copy"><div className="swap-category-label">{swap.cat}</div><h3>{swap.title}</h3><p>{swap.detail}</p></div>
                  <div className="swap-card-expanded-metrics">
                    <div className="swap-expanded-metric">
                      <span className="swap-savings-label">MONTHLY CO₂E AVOIDED</span>
                      <strong>{swap.co2}</strong>
                    </div>
                    <div className="swap-expanded-divider" />
                    <div className="swap-expanded-metric">
                      <span className="swap-savings-label">HOUSEHOLD BENEFIT</span>
                      <strong>{swap.money}</strong>
                    </div>
                  </div>
                  <div className="swap-card-adopted"><Calendar size={13} /> {swap.status}</div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="routine-analytics-view">
          <section className="analytics-hero-panel">
            <div className="analytics-hero-photo" aria-hidden="true" />
            <div className="analytics-hero-scrim" aria-hidden="true" />
            <div><div className="panel-eyebrow light-eyebrow"><TrendingDown size={14} /> YOUR IMPACT, IN FOCUS</div><h2>Your choices are<br />adding up.</h2><p>A snapshot of the positive changes your household routines are creating.</p></div>
            <div className="analytics-hero-highlight"><span>MONTHLY CARBON SAVED</span><strong>150.0 <i>kg</i></strong><small><TrendingDown size={14} /> 12% better than last month</small></div>
            <div className="analytics-hero-decoration"><Leaf size={150} strokeWidth={0.7} /></div>
          </section>

          <div className="analytics-kpi-grid">
            <article className="routine-premium-card kpi-premium-card kpi-carbon"><div className="kpi-top-row"><span className="kpi-icon-wrap"><TrendingDown size={19} /></span><span className="kpi-trend">+12%</span></div><span className="kpi-label">MONTHLY CO₂E SAVED</span><strong className="kpi-value">150.0 <small>kg</small></strong><span className="kpi-description">Compared with last month</span></article>
            <article className="routine-premium-card kpi-premium-card kpi-money"><div className="kpi-top-row"><span className="kpi-icon-wrap"><Wallet size={19} /></span><span className="kpi-trend">SAVED</span></div><span className="kpi-label">NET EXPENDITURE SAVINGS</span><strong className="kpi-value">₹4,980 <small>/ mo</small></strong><span className="kpi-description">Fuel &amp; electricity deltas</span></article>
            <article className="routine-premium-card kpi-premium-card kpi-water"><div className="kpi-top-row"><span className="kpi-icon-wrap"><Droplets size={19} /></span><span className="kpi-trend">+8%</span></div><span className="kpi-label">WATER CONSERVED</span><strong className="kpi-value">720 <small>litres</small></strong><span className="kpi-description">Showers &amp; tap aerators</span></article>
            <article className="routine-premium-card kpi-premium-card kpi-streak"><div className="kpi-top-row"><span className="kpi-icon-wrap"><Flame size={19} /></span><span className="kpi-trend">ON TRACK</span></div><span className="kpi-label">HABIT STREAK</span><strong className="kpi-value">14 <small>days</small></strong><span className="kpi-description">Your current active streak</span></article>
          </div>

          <div className="analytics-premium-grid">
            <section className="routine-premium-card premium-chart-card">
              <div className="premium-chart-heading"><div><span className="panel-eyebrow">WEEKLY PERFORMANCE</span><h3>Carbon reduction trend</h3><p>Kilograms of CO₂e avoided each week</p></div><span className="chart-period-pill">LAST 4 WEEKS</span></div>
              <div className="carbon-chart-shell">
                <div className="carbon-chart-summary">
                  <div><span className="carbon-chart-caption">TOTAL AVOIDED</span><strong>150 <small>kg CO₂e</small></strong></div>
                  <div className="carbon-chart-summary-right">
                    <span className="carbon-chart-trend"><TrendingDown size={14} /> +19 kg this month</span>
                    <small>Best week <b>47 kg</b></small>
                  </div>
                </div>
                <svg className="carbon-area-chart" viewBox="0 0 640 340" role="img" aria-label="Weekly carbon avoided increased from 28 to 47 kilograms over four weeks">
                  <defs>
                    <linearGradient id="carbonAreaFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#d4a66f" stopOpacity=".28" />
                      <stop offset="100%" stopColor="#d4a66f" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="carbonTrendStroke" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#547b65" />
                      <stop offset="100%" stopColor="#203f30" />
                    </linearGradient>
                    <linearGradient id="barSage" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#b7c8b6" /><stop offset="100%" stopColor="#809a83" />
                    </linearGradient>
                    <linearGradient id="barSand" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#e7c69e" /><stop offset="100%" stopColor="#bd8f61" />
                    </linearGradient>
                    <linearGradient id="barBlue" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#a9c2c2" /><stop offset="100%" stopColor="#688d8c" />
                    </linearGradient>
                    <linearGradient id="barForest" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#64866d" /><stop offset="100%" stopColor="#254b35" />
                    </linearGradient>
                    <linearGradient id="barFrontGloss" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity=".28" />
                      <stop offset="28%" stopColor="#ffffff" stopOpacity=".06" />
                      <stop offset="100%" stopColor="#14291c" stopOpacity=".16" />
                    </linearGradient>
                    <linearGradient id="barSideShade" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#15291d" stopOpacity=".18" />
                      <stop offset="100%" stopColor="#102419" stopOpacity=".45" />
                    </linearGradient>
                    <filter id="bar3DShadow" x="-50%" y="-20%" width="200%" height="160%">
                      <feGaussianBlur stdDeviation="5" />
                    </filter>
                  </defs>

                  <g className="carbon-chart-grid">
                    <line x1="58" y1="48" x2="610" y2="48" />
                    <line x1="58" y1="114" x2="610" y2="114" />
                    <line x1="58" y1="180" x2="610" y2="180" />
                    <line x1="58" y1="246" x2="610" y2="246" />
                  </g>
                  <g className="carbon-chart-axis-labels">
                    <text x="10" y="52">50</text><text x="10" y="118">35</text><text x="10" y="184">20</text><text x="20" y="250">0</text>
                  </g>

                  <path className="carbon-chart-area" d="M112 129 C158 121 197 116 250 105 S354 88 388 78 S490 57 526 48 L526 246 L112 246 Z" />

                  <polygon className="carbon-chart-floor" points="62,246 606,246 586,269 82,269" />
                  <g className="carbon-chart-floor-lines">
                    <path d="M82 269 L112 246 M208 269 L236 246 M334 269 L360 246 M460 269 L484 246 M586 269 L606 246" />
                    <path d="M70 254 L598 254 M76 261 L592 261" />
                  </g>
                  <g className="carbon-chart-bars-3d">
                    <ellipse className="bar-ground-shadow" cx="119" cy="251" rx="40" ry="8" />
                    <g className="bar-prism bar-prism-sage">
                      <polygon className="bar-side" points="138,129 153,117 153,234 138,246" />
                      <polygon className="bar-top" points="86,129 101,117 153,117 138,129" />
                      <rect className="bar-front" x="86" y="129" width="52" height="117" rx="8" />
                      <rect className="bar-front-gloss" x="86" y="129" width="52" height="117" rx="8" />
                    </g>

                    <ellipse className="bar-ground-shadow" cx="257" cy="251" rx="40" ry="8" />
                    <g className="bar-prism bar-prism-sand">
                      <polygon className="bar-side" points="276,105 291,93 291,234 276,246" />
                      <polygon className="bar-top" points="224,105 239,93 291,93 276,105" />
                      <rect className="bar-front" x="224" y="105" width="52" height="141" rx="8" />
                      <rect className="bar-front-gloss" x="224" y="105" width="52" height="141" rx="8" />
                    </g>

                    <ellipse className="bar-ground-shadow" cx="395" cy="251" rx="40" ry="8" />
                    <g className="bar-prism bar-prism-blue">
                      <polygon className="bar-side" points="414,78 429,66 429,234 414,246" />
                      <polygon className="bar-top" points="362,78 377,66 429,66 414,78" />
                      <rect className="bar-front" x="362" y="78" width="52" height="168" rx="8" />
                      <rect className="bar-front-gloss" x="362" y="78" width="52" height="168" rx="8" />
                    </g>

                    <ellipse className="bar-ground-shadow" cx="533" cy="251" rx="40" ry="8" />
                    <g className="bar-prism bar-prism-forest">
                      <polygon className="bar-side" points="552,48 567,36 567,234 552,246" />
                      <polygon className="bar-top" points="500,48 515,36 567,36 552,48" />
                      <rect className="bar-front" x="500" y="48" width="52" height="198" rx="8" />
                      <rect className="bar-front-gloss" x="500" y="48" width="52" height="198" rx="8" />
                    </g>
                  </g>

                  <path className="carbon-chart-line" d="M112 129 C158 121 197 116 250 105 S354 88 388 78 S490 57 526 48" />
                  <g className="carbon-chart-points">
                    <circle cx="112" cy="129" r="6" />
                    <circle cx="250" cy="105" r="6" />
                    <circle cx="388" cy="78" r="6" />
                    <circle className="carbon-point-latest" cx="526" cy="48" r="8" />
                  </g>

                  <g className="carbon-chart-values">
                    <text x="112" y="107" textAnchor="middle">28 kg</text>
                    <text x="250" y="83" textAnchor="middle">34 kg</text>
                    <text x="388" y="56" textAnchor="middle">41 kg</text>
                    <g className="carbon-latest-callout">
                      <rect x="485" y="7" width="82" height="27" rx="13.5" />
                      <text x="526" y="25" textAnchor="middle">47 kg</text>
                    </g>
                  </g>

                  <g className="carbon-chart-weeks">
                    <text x="112" y="306" textAnchor="middle">WEEK 01</text>
                    <text x="250" y="280" textAnchor="middle">WEEK 02</text>
                    <text x="388" y="280" textAnchor="middle">WEEK 03</text>
                    <text x="526" y="280" textAnchor="middle">WEEK 04</text>
                  </g>
                </svg>
                <div className="carbon-chart-legend">
                  <span><i className="legend-bar" /> Weekly avoided CO₂e</span>
                  <span><i className="legend-line" /> Trend line</span>
                </div>
              </div>
              <div className="chart-bottom-note"><span><span className="chart-legend-dot" /> Carbon avoided each week</span><strong>Consistent upward progress</strong></div>
            </section>

            <section className="routine-premium-card premium-breakdown-card">
              <div className="premium-chart-heading"><div><span className="panel-eyebrow">WHERE IT COMES FROM</span><h3>Impact by category</h3><p>Your biggest sources of positive change</p></div><span className="breakdown-total">150 <small>kg</small></span></div>
              <div className="premium-category-list">
                {[
                  { name: 'Transport', detail: 'Metro & carpooling', pct: 50, color: '#164532', kg: '75 kg' },
                  { name: 'Energy', detail: 'AC 24°C & LEDs', pct: 27, color: '#3b9163', kg: '40 kg' },
                  { name: 'Food', detail: 'Plant-based meals', pct: 20, color: '#b87552', kg: '30 kg' },
                  { name: 'Shopping & waste', detail: 'Totes & compost', pct: 3, color: '#91a196', kg: '5 kg' },
                ].map((cat) => (
                  <div key={cat.name} className="premium-category-row">
                    <div className="premium-category-top"><span><i style={{ backgroundColor: cat.color }} />{cat.name}<small>{cat.detail}</small></span><strong>{cat.kg}</strong></div>
                    <div className="premium-category-track"><span style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} /></div>
                    <div className="premium-category-foot"><span>{cat.pct}% of total impact</span></div>
                  </div>
                ))}
              </div>
              <div className="premium-streak-footer">
                <div><span className="streak-footer-icon"><Calendar size={15} /></span><span><strong>14-day consistency</strong><small>You&apos;re building a lasting rhythm</small></span></div>
                <div className="premium-streak-dots">{['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i} className={i < 12 ? 'is-complete' : i === 12 ? 'is-today' : ''}>{i === 12 ? <Check size={10} /> : d}</span>)}</div>
              </div>
            </section>
          </div>
        </div>
      )}

      <style>{`
        .routine-premium{--forest:#123826;--deep:#0d2a1d;--muted:#718078;max-width:1180px;margin:0 auto;padding:2.25rem 2.5rem 4.5rem;color:var(--color-ink,#17271f);font-family:'DM Sans',sans-serif}
        .routine-page-header{display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;margin-bottom:1.55rem}
        .routine-eyebrow,.panel-eyebrow{display:flex;align-items:center;gap:.45rem;color:#3c825e;font-size:.66rem;font-weight:800;letter-spacing:.16em}
        .routine-page-title{margin:.45rem 0 .25rem;font:700 clamp(2.2rem,3.5vw,3rem)/1.05 'Fraunces',Georgia,serif;letter-spacing:-.045em;color:#14291f}
        .routine-page-title span{color:#5ca878}.routine-page-subtitle{margin:0;color:#758178;font-size:.9rem}
        .routine-streak-chip{display:flex;align-items:center;gap:.75rem;min-width:180px;padding:.72rem .9rem;border:1px solid #e7dfd2;border-radius:16px;background:rgba(255,255,255,.72);box-shadow:0 8px 22px rgba(39,51,41,.045)}
        .routine-streak-icon{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;color:#a9572c;background:#fff0e3}
        .routine-streak-chip small,.routine-streak-chip strong{display:block}.routine-streak-chip small{color:#8a928c;font-size:.68rem}.routine-streak-chip strong{color:#1c3326;font:700 1rem 'Fraunces',Georgia,serif;margin-top:.1rem}.routine-streak-sparkle{margin-left:auto;color:#c38a43}
        .routine-premium-tabs{display:flex;gap:.45rem;align-items:center;padding:.38rem;width:max-content;max-width:100%;border-radius:999px;border:1px solid #e9e2d8;background:rgba(255,255,255,.62);box-shadow:0 5px 18px rgba(37,47,39,.035);margin-bottom:1.55rem}
        .routine-premium-tab{display:inline-flex;align-items:center;gap:.55rem;border:0;border-radius:999px;padding:.66rem 1.12rem;background:transparent;color:#68776e;font-size:.8rem;font-weight:650;cursor:pointer;transition:background .2s,color .2s,transform .2s,box-shadow .2s}
        .routine-premium-tab:hover{color:#153b29;background:#f0f3ed;transform:translateY(-1px)}.routine-premium-tab.is-active{background:linear-gradient(135deg,#164832,#0f3021);color:#fff;box-shadow:0 5px 13px rgba(18,56,38,.2)}.tab-step{font-size:.62rem;opacity:.56;letter-spacing:.06em}
        .routine-plan-hero{position:relative;isolation:isolate;overflow:hidden;display:grid;grid-template-columns:minmax(0,1fr) 245px;gap:2rem;align-items:center;padding:2.05rem 2.2rem;margin-bottom:1.5rem;border-radius:24px;color:#fff;background:radial-gradient(circle at 85% 15%,rgba(113,203,143,.2),transparent 30%),linear-gradient(115deg,#102d20 0%,#174c34 65%,#236a47 100%);box-shadow:0 18px 45px rgba(16,53,35,.15)}
        .plan-hero-glow{position:absolute;z-index:-1;right:12%;bottom:-150px;width:360px;height:300px;border-radius:50%;background:rgba(91,194,128,.14);filter:blur(25px)}
        .plan-hero-content{max-width:680px}.plan-hero-kicker{display:flex;align-items:center;gap:.45rem;color:#a7e6bd;font-size:.66rem;font-weight:800;letter-spacing:.16em}
        .plan-hero-content h2{margin:.72rem 0 .55rem;font:650 clamp(1.65rem,2.5vw,2.3rem)/1.08 'Fraunces',Georgia,serif;letter-spacing:-.025em}.plan-hero-content p{max-width:570px;margin:0;color:rgba(255,255,255,.72);font-size:.83rem;line-height:1.65}
        .plan-progress-meta{display:flex;align-items:center;justify-content:space-between;max-width:540px;margin-top:1.45rem;color:rgba(255,255,255,.78);font-size:.72rem}.plan-progress-meta strong{color:#b5efc9;font-size:.82rem}
        .plan-progress-track{max-width:540px;height:8px;margin-top:.55rem;border-radius:99px;overflow:hidden;background:rgba(255,255,255,.13)}.plan-progress-track span{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#69cc8f,#b5efc9);box-shadow:0 0 14px rgba(142,235,175,.38);transition:width .35s ease}
        .plan-hero-foot{display:flex;gap:1.15rem;margin-top:.8rem;color:rgba(255,255,255,.66);font-size:.68rem}.plan-hero-foot span{display:flex;align-items:center;gap:.35rem}.plan-hero-foot svg{color:#9ce4b8}
        .plan-ring-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.75rem}.plan-progress-ring{display:grid;place-items:center;width:154px;height:154px;border-radius:50%;box-shadow:0 0 0 9px rgba(255,255,255,.035),0 12px 32px rgba(0,0,0,.16)}
        .plan-ring-inner{display:flex;flex-direction:column;align-items:center;justify-content:center;width:126px;height:126px;border-radius:50%;background:linear-gradient(145deg,#173e2c,#102d20);border:1px solid rgba(255,255,255,.12)}.plan-ring-inner strong{color:#fff;font:700 2.2rem 'Fraunces',Georgia,serif}.plan-ring-inner span{color:#b5d6c0;font-size:.66rem;letter-spacing:.08em;text-transform:uppercase}
        .plan-ring-caption{display:flex;align-items:center;gap:.4rem;color:rgba(255,255,255,.7);font-size:.69rem}.plan-ring-caption svg{color:#ffb875}
        .routine-plan-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(265px,.85fr);align-items:start;gap:1.35rem}
        .routine-premium-card{background:linear-gradient(145deg,#fffdfa,#fbf8f2);border:1px solid #e8e0d5;border-radius:21px;box-shadow:0 10px 32px rgba(45,53,43,.045)}
        .challenge-panel{padding:1.65rem}.panel-heading-row{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.25rem}
        .panel-eyebrow{font-size:.61rem;letter-spacing:.14em}.routine-section-title{margin:.36rem 0 .24rem;font:700 1.45rem 'Fraunces',Georgia,serif;letter-spacing:-.02em;color:#183426}.routine-section-subtitle{margin:0;color:#79847c;font-size:.75rem}
        .challenge-count-pill{min-width:58px;height:58px;display:flex;align-items:center;justify-content:center;gap:2px;border-radius:18px;color:#fff;background:linear-gradient(145deg,#1b573a,#123826);font:700 1.42rem 'Fraunces',Georgia,serif;box-shadow:0 7px 16px rgba(18,56,38,.14)}.challenge-count-pill i{font:500 .72rem 'DM Sans',sans-serif;color:#b9ddc6}
        .routine-premium-checklist{display:flex;flex-direction:column;gap:.62rem}.premium-checklist-item{width:100%;display:flex;align-items:center;gap:.78rem;padding:.75rem .85rem;border:1px solid #e9e2d8;border-radius:15px;background:#fffefa;text-align:left;cursor:pointer;transition:transform .18s,border .18s,background .18s,box-shadow .18s}
        .premium-checklist-item:hover{transform:translateY(-2px);border-color:#a9c9b4;box-shadow:0 7px 18px rgba(36,75,50,.07)}.premium-checklist-item.is-complete{background:linear-gradient(100deg,#f0f7f1,#fbfdf9);border-color:#d4e5d8}
        .action-number{width:22px;flex-shrink:0;color:#a3aaa4;font-size:.62rem;font-weight:750;letter-spacing:.05em}.action-category-icon{width:38px;height:38px;display:grid;place-items:center;flex-shrink:0;border-radius:12px;color:#32764e;background:#eaf4ec}
        .premium-checklist-item.is-complete .action-category-icon{color:#fff;background:linear-gradient(145deg,#3e9461,#1d5b3b)}.action-main-copy{display:flex;flex:1;min-width:0;flex-direction:column;gap:.22rem}
        .action-main-copy strong{color:#20372a;font-size:.79rem;font-weight:700}.action-main-copy small{color:#929b93;font-size:.64rem}.action-main-copy small span{padding:0 .2rem;color:#c2b9aa}
        .action-impact-pill{white-space:nowrap;padding:.34rem .58rem;border-radius:999px;background:#edf3ec;color:#356b49;font-size:.63rem;font-weight:750}.premium-action-check{width:26px;height:26px;display:grid;place-items:center;flex-shrink:0;border:1px solid #ddd8ce;border-radius:50%;color:#8d9a90;background:#fff}
        .is-complete .premium-action-check{border-color:#1c5c3b;color:#fff;background:#1c5c3b}.challenge-panel-footer{display:flex;justify-content:space-between;gap:1rem;margin-top:1.05rem;padding-top:.9rem;border-top:1px solid #eee8df;color:#879188;font-size:.66rem}
        .challenge-panel-footer span:first-child{display:flex;align-items:center;gap:.35rem}.challenge-panel-footer svg{color:#42835a}
        .routine-plan-aside{display:flex;flex-direction:column;gap:1rem}.today-tip-card{position:relative;overflow:hidden;padding:1.45rem;border-radius:21px;color:#fff;background:radial-gradient(circle at 100% 0%,rgba(135,202,145,.25),transparent 40%),linear-gradient(145deg,#285c3f,#153825);box-shadow:0 12px 28px rgba(18,56,38,.12)}
        .tip-topline{display:flex;align-items:center;gap:.65rem;color:#c3e8cf}.tip-icon-bubble{width:35px;height:35px;display:grid;place-items:center;border-radius:12px;color:#173e2a;background:#c5efd1}.tip-label{font-size:.59rem;font-weight:800;letter-spacing:.12em}.tip-sparkle{margin-left:auto;color:#f1d293}
        .today-tip-card h3{margin:1.05rem 0 .48rem;color:#fff;font:650 1.24rem 'Fraunces',Georgia,serif}.today-tip-card p{margin:0;color:rgba(255,255,255,.76);font-size:.78rem;line-height:1.7}.today-tip-card p strong{color:#c4f1d0}
        .tip-bottom-line{display:flex;justify-content:space-between;align-items:center;margin-top:1.2rem;padding-top:.85rem;border-top:1px solid rgba(255,255,255,.15)}.tip-bottom-line span{color:rgba(255,255,255,.58);font-size:.58rem;letter-spacing:.12em;font-weight:800}.tip-bottom-line strong{display:flex;align-items:center;color:#d2f4da;font-size:.88rem}
        .routine-quote-card{min-height:190px;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.6rem;border-radius:21px;color:#f4f8f1;text-align:center;background:radial-gradient(circle at 50% 120%,rgba(94,160,112,.25),transparent 60%),linear-gradient(145deg,#172f23,#0e2419);box-shadow:0 12px 28px rgba(18,56,38,.1)}
        .quote-orbit{position:absolute;border:1px solid rgba(185,225,190,.13);border-radius:50%;pointer-events:none}.quote-orbit-one{width:230px;height:230px;right:-78px;top:-140px}.quote-orbit-two{width:175px;height:175px;left:-70px;bottom:-115px}
        .quote-mark{height:29px;color:#9ad3a8;font:3rem 'Fraunces',Georgia,serif;line-height:1}.routine-quote-card p{margin:.4rem 0 1rem;font:italic 1.05rem/1.48 'Fraunces',Georgia,serif}
        .quote-attribution{display:flex;align-items:center;gap:.45rem;color:#9cbaa4;font-size:.56rem;letter-spacing:.15em;font-weight:800}.quote-attribution span{width:18px;height:1px;background:#6eb487}.quote-leaf-mark{position:absolute;right:1rem;bottom:.9rem;color:rgba(139,206,156,.24);transform:rotate(-25deg)}
        .aside-mini-note{display:flex;align-items:center;gap:.7rem;padding:.8rem .9rem;border:1px solid #e7dfd2;border-radius:15px;background:rgba(255,255,255,.68)}.aside-mini-icon{width:32px;height:32px;display:grid;place-items:center;border-radius:10px;background:#f1eee5;color:#52725b}
        .aside-mini-note strong,.aside-mini-note small{display:block}.aside-mini-note strong{color:#34483b;font-size:.7rem}.aside-mini-note small{margin-top:.12rem;color:#8b958d;font-size:.62rem}
        .swaps-hero-panel,.analytics-hero-panel{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:2rem;margin-bottom:1.45rem;padding:2rem 2.15rem;border-radius:23px;color:#fff;background:radial-gradient(circle at 80% 0%,rgba(111,195,137,.18),transparent 32%),linear-gradient(115deg,#102c20,#1b5035);box-shadow:0 16px 38px rgba(18,56,38,.13)}
        .swaps-hero-copy{max-width:430px;flex:1}.light-eyebrow{color:#a8dfba}.swaps-hero-copy h2{margin:.55rem 0 .48rem;color:#fff;font:700 2rem 'Fraunces',Georgia,serif;letter-spacing:-.03em}
        .swaps-hero-copy p{max-width:400px;margin:0;color:rgba(255,255,255,.7);font-size:.79rem;line-height:1.65}
        .swaps-browse-button{display:inline-flex;align-items:center;gap:.55rem;margin-top:1.1rem;padding:.62rem .95rem;border:1px solid rgba(255,255,255,.2);border-radius:999px;color:#fff;background:rgba(255,255,255,.1);text-decoration:none;font-size:.72rem;font-weight:700;transition:background .2s,transform .2s}
        .swaps-browse-button:hover{background:rgba(255,255,255,.18);transform:translateY(-1px)}
        .swaps-hero-stats{display:grid;grid-template-columns:repeat(3,minmax(105px,1fr));gap:0;flex:1.25;max-width:560px;border:1px solid rgba(255,255,255,.15);border-radius:17px;background:rgba(255,255,255,.06);backdrop-filter:blur(12px)}
        .swaps-hero-stats>div{padding:1.1rem .85rem}.swaps-hero-stats>div+div{border-left:1px solid rgba(255,255,255,.13)}
        .swaps-hero-stats span,.swaps-hero-stats strong,.swaps-hero-stats small{display:block}.swaps-hero-stats span{color:#a8c7b2;font-size:.54rem;letter-spacing:.1em;font-weight:800}
        .swaps-hero-stats strong{margin:.4rem 0 .2rem;color:#fff;font:700 1.75rem 'Fraunces',Georgia,serif}.swaps-hero-stats strong i{color:#b7d9c1;font:500 .75rem 'DM Sans',sans-serif}.swaps-hero-stats small{color:rgba(255,255,255,.56);font-size:.6rem}
        .swaps-section-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;margin:1.4rem 0 .85rem}.swaps-section-heading h3{margin:.32rem 0 0;color:#1b3527;font:700 1.35rem 'Fraunces',Georgia,serif}
        .swaps-active-label{display:flex;align-items:center;gap:.45rem;color:#6f8175;font-size:.68rem}.swaps-active-label span,.swap-active-status span{width:7px;height:7px;border-radius:50%;background:#4da96f;box-shadow:0 0 0 3px rgba(77,169,111,.13)}
        .premium-swaps-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
        .premium-swap-card{position:relative;overflow:hidden;display:flex;flex-direction:column;min-height:234px;padding:1.35rem 1.45rem 1rem;border:1px solid #e7dfd3;border-radius:20px;background:linear-gradient(145deg,#fffefa,#f8f5ee);box-shadow:0 8px 26px rgba(43,54,45,.04);transition:transform .2s,box-shadow .2s,border-color .2s}
        .premium-swap-card:hover{transform:translateY(-3px);border-color:#c6d9ca;box-shadow:0 15px 34px rgba(43,70,50,.09)}.premium-swap-card:after{content:'';position:absolute;right:-42px;top:-60px;width:145px;height:145px;border-radius:50%;background:var(--swap-glow,rgba(91,163,110,.09));pointer-events:none}
        .tone-transport{--swap-accent:#397b9c;--swap-soft:#eaf3f7;--swap-glow:rgba(81,147,176,.12)}.tone-food{--swap-accent:#a56c42;--swap-soft:#f7eee6;--swap-glow:rgba(190,129,78,.12)}.tone-energy{--swap-accent:#a78337;--swap-soft:#f7f2df;--swap-glow:rgba(185,151,67,.13)}.tone-shopping{--swap-accent:#64846a;--swap-soft:#edf3e9;--swap-glow:rgba(112,155,115,.14)}
        .swap-card-top{position:relative;z-index:1;display:flex;align-items:center;gap:.6rem}.swap-feature-icon{width:43px;height:43px;display:grid;place-items:center;border-radius:14px;color:var(--swap-accent);background:var(--swap-soft)}
        .swap-active-status{display:flex;align-items:center;gap:.38rem;color:#607a68;font-size:.58rem;letter-spacing:.12em;font-weight:850}.swap-card-index{margin-left:auto;color:#b9b9ad;font:700 .88rem 'Fraunces',Georgia,serif}
        .swap-card-copy{position:relative;z-index:1;margin:1.05rem 0 1rem}.swap-category-label{color:var(--swap-accent);font-size:.61rem;letter-spacing:.12em;text-transform:uppercase;font-weight:850}
        .swap-card-copy h3{max-width:400px;margin:.32rem 0 .3rem;color:#21392c;font:700 1.12rem/1.24 'Fraunces',Georgia,serif}.swap-card-copy p{margin:0;color:#869187;font-size:.68rem}
        .swap-card-bottom{position:relative;z-index:1;display:flex;justify-content:space-between;align-items:flex-end;gap:.7rem;margin-top:auto;padding-top:.8rem;border-top:1px solid #ebe5dc}
        .swap-savings-label{display:block;color:#969f98;font-size:.54rem;letter-spacing:.1em;font-weight:800}.swap-card-savings strong{display:block;margin-top:.25rem;color:#1b5839;font-size:.79rem}
        .swap-card-money{padding:.34rem .58rem;border-radius:999px;color:#956333;background:#f6eee2;font-size:.64rem;font-weight:750;white-space:nowrap}.swap-card-adopted{position:relative;z-index:1;display:flex;align-items:center;gap:.35rem;margin-top:.65rem;color:#9a9f97;font-size:.6rem}
        .analytics-hero-panel{min-height:190px;margin-bottom:1.1rem}.analytics-hero-panel>div:first-child{position:relative;z-index:1;max-width:470px}
        .analytics-hero-panel h2{margin:.55rem 0 .38rem;color:#fff;font:700 2rem/1.12 'Fraunces',Georgia,serif;letter-spacing:-.03em}.analytics-hero-panel p{max-width:390px;margin:0;color:rgba(255,255,255,.69);font-size:.77rem;line-height:1.6}
        .analytics-hero-highlight{position:relative;z-index:1;min-width:220px;padding:1.05rem 1.25rem;border:1px solid rgba(255,255,255,.17);border-radius:17px;background:rgba(255,255,255,.07);backdrop-filter:blur(10px)}
        .analytics-hero-highlight span,.analytics-hero-highlight strong,.analytics-hero-highlight small{display:flex}.analytics-hero-highlight span{color:#b0d3bb;font-size:.57rem;letter-spacing:.13em;font-weight:800}
        .analytics-hero-highlight strong{align-items:baseline;gap:.35rem;margin:.3rem 0;color:#fff;font:700 2.3rem 'Fraunces',Georgia,serif}.analytics-hero-highlight strong i{color:#c2ddca;font:500 .78rem 'DM Sans',sans-serif}
        .analytics-hero-highlight small{align-items:center;gap:.35rem;color:#b5e5c4;font-size:.65rem}.analytics-hero-decoration{position:absolute;right:14%;top:-45px;color:rgba(198,239,203,.07);transform:rotate(-25deg)}
        .analytics-kpi-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.95rem;margin-bottom:1rem}.kpi-premium-card{position:relative;overflow:hidden;min-height:154px;padding:1.15rem 1.2rem;transition:transform .2s,box-shadow .2s}
        .kpi-premium-card:hover{transform:translateY(-3px);box-shadow:0 15px 32px rgba(39,58,42,.08)}.kpi-premium-card:after{content:'';position:absolute;width:100px;height:100px;right:-44px;bottom:-55px;border-radius:50%;background:var(--kpi-glow,rgba(49,123,83,.08))}
        .kpi-carbon{--kpi-accent:#23734a;--kpi-soft:#e6f4e9;--kpi-glow:rgba(54,147,83,.11)}.kpi-money{--kpi-accent:#9a6926;--kpi-soft:#faf0dc;--kpi-glow:rgba(190,146,64,.12)}.kpi-water{--kpi-accent:#397a9a;--kpi-soft:#e7f1f7;--kpi-glow:rgba(71,143,174,.12)}.kpi-streak{--kpi-accent:#b45f37;--kpi-soft:#fbede4;--kpi-glow:rgba(204,113,68,.12)}
        .kpi-top-row{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem}.kpi-premium-card .kpi-icon-wrap{width:36px;height:36px;display:grid;place-items:center;border-radius:12px;color:var(--kpi-accent);background:var(--kpi-soft)}
        .kpi-trend{color:var(--kpi-accent);font-size:.58rem;font-weight:850;letter-spacing:.09em}.kpi-label{position:relative;z-index:1;display:block;color:#88948b;font-size:.57rem;letter-spacing:.12em;font-weight:850}
        .kpi-value{position:relative;z-index:1;display:block;margin:.22rem 0 .12rem;color:#193629;font:700 1.48rem/1.15 'Fraunces',Georgia,serif}.kpi-value small{color:#66796d;font:500 .7rem 'DM Sans',sans-serif}.kpi-description{position:relative;z-index:1;color:#909b92;font-size:.63rem}
        .analytics-premium-grid{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(0,1fr);gap:1rem}.premium-chart-card,.premium-breakdown-card{padding:1.45rem 1.5rem}
        .premium-chart-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}.premium-chart-heading h3{margin:.3rem 0 .2rem;color:#1b3628;font:700 1.3rem 'Fraunces',Georgia,serif}.premium-chart-heading p{margin:0;color:#8a958c;font-size:.68rem}
        .chart-period-pill{padding:.38rem .62rem;border-radius:999px;color:#688071;background:#eef3ed;font-size:.56rem;letter-spacing:.09em;font-weight:850;white-space:nowrap}
        .premium-weekly-chart{position:relative;display:flex;align-items:flex-end;justify-content:space-around;height:218px;margin-top:1.2rem;padding:1.25rem 1rem .1rem 2.4rem}
        .chart-gridline{position:absolute;left:2.3rem;right:0;border-top:1px dashed #e8e6de;pointer-events:none}.chart-gridline span{position:absolute;left:-2.35rem;top:-.52rem;color:#a1aaa2;font-size:.54rem}.chart-gridline-one{top:21%}.chart-gridline-two{top:57%}
        .premium-week-column{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:.45rem;height:100%;min-width:48px}.premium-week-column>strong{color:#547261;font-size:.69rem}.premium-week-column>strong small{margin-left:2px;font-size:.53rem;font-weight:600}
        .premium-bar-track{display:flex;align-items:flex-end;width:38px;height:146px;overflow:hidden;border-radius:11px;background:#f0f0e9;box-shadow:inset 0 1px 2px rgba(31,49,36,.04)}.premium-bar-track span{display:block;width:100%;border-radius:10px;background:linear-gradient(180deg,#7fd99d 0%,#317b53 58%,#143d2a 100%);box-shadow:0 4px 12px rgba(42,130,79,.18);transition:height .4s ease}.is-latest .premium-bar-track span{background:linear-gradient(180deg,#a0edb8 0%,#45a66b 50%,#16452f 100%)}
        .premium-week-label{color:#849087;font-size:.6rem}.chart-bottom-note{display:flex;align-items:center;justify-content:space-between;gap:.8rem;margin-top:.95rem;padding-top:.8rem;border-top:1px solid #eee9e0;color:#869289;font-size:.62rem}.chart-bottom-note>span{display:flex;align-items:center;gap:.4rem}.chart-legend-dot{width:8px;height:8px;border-radius:50%;background:#4caa70}.chart-bottom-note strong{color:#2f7650;font-size:.65rem}
        .breakdown-total{color:#1a4b32;font:700 1.35rem 'Fraunces',Georgia,serif;white-space:nowrap}.breakdown-total small{color:#77867a;font:500 .67rem 'DM Sans',sans-serif}
        .premium-category-list{display:flex;flex-direction:column;gap:.9rem;margin:1.2rem 0 1.35rem}.premium-category-top{display:flex;align-items:center;justify-content:space-between;gap:.7rem}
        .premium-category-top>span{display:flex;align-items:center;flex-wrap:wrap;gap:.42rem;color:#344b3b;font-size:.7rem;font-weight:750}.premium-category-top>span i{width:8px;height:8px;border-radius:3px}.premium-category-top>span small{color:#99a198;font-size:.59rem;font-weight:450}.premium-category-top>strong{color:#304e3a;font-size:.68rem;white-space:nowrap}
        .premium-category-track{height:8px;margin-top:.48rem;overflow:hidden;border-radius:99px;background:#f0eee8}.premium-category-track span{display:block;height:100%;border-radius:99px}.premium-category-foot{display:flex;justify-content:flex-end;margin-top:.2rem;color:#a0a9a1;font-size:.55rem}
        .premium-streak-footer{padding-top:1rem;border-top:1px solid #eee9e0}.premium-streak-footer>div:first-child{display:flex;align-items:center;gap:.55rem}.streak-footer-icon{width:30px;height:30px;display:grid;place-items:center;border-radius:10px;color:#9a6432;background:#f8eee1}
        .premium-streak-footer strong,.premium-streak-footer small{display:block}.premium-streak-footer strong{color:#34493a;font-size:.68rem}.premium-streak-footer small{margin-top:.08rem;color:#96a096;font-size:.57rem}
        .premium-streak-dots{display:flex;flex-wrap:wrap;gap:.34rem;margin-top:.75rem}.premium-streak-dots span{width:23px;height:23px;display:grid;place-items:center;border-radius:50%;color:#7f8c81;background:#f0eee7;font-size:.57rem;font-weight:750}.premium-streak-dots span.is-complete{color:#fff;background:#245b3c}.premium-streak-dots span.is-today{color:#153c28;background:#9de3b5;box-shadow:0 0 0 3px rgba(91,175,119,.14)}
        @media(max-width:1050px){.routine-premium{padding:1.8rem 1.5rem 3rem}.swaps-hero-panel{align-items:flex-start;flex-direction:column}.swaps-hero-stats{max-width:none;width:100%}.analytics-kpi-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:850px){.routine-plan-grid,.analytics-premium-grid{grid-template-columns:1fr}.routine-plan-hero{grid-template-columns:minmax(0,1fr) 180px;padding:1.6rem}.plan-progress-ring{width:130px;height:130px}.plan-ring-inner{width:106px;height:106px}.premium-swaps-grid{grid-template-columns:1fr}}
        @media(max-width:600px){.routine-premium{padding:1.25rem 1rem 2.5rem}.routine-page-header{align-items:flex-start;flex-direction:column;gap:1rem}.routine-streak-chip{min-width:0}.routine-premium-tabs{width:100%;justify-content:space-between;gap:.15rem}.routine-premium-tab{flex:1;justify-content:center;padding:.62rem .45rem;font-size:.7rem}.tab-step{display:none}.routine-plan-hero{grid-template-columns:1fr;gap:1.15rem;padding:1.35rem}.plan-ring-wrap{flex-direction:row;justify-content:flex-start}.plan-progress-ring{width:88px;height:88px}.plan-ring-inner{width:70px;height:70px}.plan-ring-inner strong{font-size:1.35rem}.plan-ring-caption{font-size:.62rem}.challenge-panel{padding:1rem}.premium-checklist-item{gap:.45rem;padding:.62rem .55rem}.action-number{display:none}.action-category-icon{width:32px;height:32px;border-radius:10px}.action-main-copy strong{font-size:.7rem}.action-main-copy small{font-size:.58rem}.action-impact-pill{padding:.27rem .38rem;font-size:.55rem}.premium-action-check{width:23px;height:23px}.challenge-panel-footer{font-size:.58rem}.swaps-hero-panel,.analytics-hero-panel{padding:1.4rem;border-radius:19px}.swaps-hero-stats{grid-template-columns:1fr}.swaps-hero-stats>div{padding:.7rem .85rem}.swaps-hero-stats>div+div{border-left:0;border-top:1px solid rgba(255,255,255,.13)}.swaps-hero-stats strong{margin:.2rem 0}.swaps-section-heading{align-items:flex-start;flex-direction:column}.swaps-section-heading h3{font-size:1.15rem}.premium-swap-card{min-height:220px;padding:1.1rem}.analytics-hero-panel{align-items:flex-start;flex-direction:column;gap:1rem}.analytics-hero-highlight{width:100%;min-width:0}.analytics-hero-decoration{right:-15px;top:10px}.analytics-kpi-grid{grid-template-columns:1fr 1fr;gap:.55rem}.kpi-premium-card{min-height:145px;padding:.85rem}.kpi-label{font-size:.5rem}.kpi-value{font-size:1.2rem}.kpi-description{font-size:.55rem}.premium-chart-card,.premium-breakdown-card{padding:1rem}.premium-chart-heading h3{font-size:1.08rem}.premium-chart-heading p{font-size:.59rem}.premium-weekly-chart{padding-left:1.7rem;padding-right:.1rem}.chart-gridline{left:1.65rem}.chart-gridline span{left:-1.7rem;font-size:.48rem}.premium-week-column{min-width:39px}.premium-bar-track{width:29px}.premium-week-label{font-size:.52rem}.chart-bottom-note{font-size:.55rem}.premium-category-top>span{font-size:.64rem}.premium-category-top>span small{flex-basis:100%;margin-left:1rem}}

        /* Art direction: editorial climate journal meets premium fintech. */
        .routine-premium {
          position: relative;
          max-width: 1240px;
          padding: 2.1rem clamp(1.4rem,3vw,3.1rem) 5rem;
          isolation: isolate;
        }
        .routine-premium:before {
          content:""; position:absolute; z-index:-1; inset:0;
          background:
            radial-gradient(ellipse at 8% 6%,rgba(188,207,179,.2),transparent 28%),
            radial-gradient(ellipse at 95% 36%,rgba(214,198,164,.16),transparent 27%);
          pointer-events:none;
        }
        .routine-page-header { align-items:center; padding:0 0 1.35rem; border-bottom:1px solid rgba(113,128,120,.18); margin-bottom:1.35rem; }
        .routine-eyebrow { color:#3b7852; font-size:.62rem; letter-spacing:.2em; }
        .routine-page-title { font-size:clamp(2.55rem,4.5vw,3.7rem); letter-spacing:-.06em; text-shadow:0 2px 0 rgba(255,255,255,.55); }
        .routine-page-subtitle { max-width:560px; font-size:.91rem; letter-spacing:.005em; }
        .routine-streak-chip { border-radius:18px; padding:.65rem .9rem; border-color:rgba(206,194,174,.8); background:linear-gradient(145deg,rgba(255,255,255,.95),rgba(247,242,232,.9)); box-shadow:0 10px 26px rgba(50,64,51,.08),inset 0 1px 0 #fff; }
        .routine-streak-icon { border-radius:13px; color:#fff; background:linear-gradient(145deg,#d78a4c,#9d4e2a); box-shadow:0 5px 12px rgba(157,78,42,.2); }
        .routine-premium-tabs { margin-bottom:1.65rem; padding:.42rem; gap:.3rem; border-color:#e4dccf; border-radius:17px; background:rgba(255,253,248,.86); box-shadow:0 8px 24px rgba(46,61,48,.06),inset 0 1px 0 #fff; }
        .routine-premium-tab { border-radius:12px; padding:.72rem 1.25rem; font-size:.83rem; }
        .routine-premium-tab.is-active { background:linear-gradient(135deg,#174b32,#0b291b); box-shadow:0 6px 16px rgba(13,48,31,.25),inset 0 1px 0 rgba(255,255,255,.13); }
        .tab-step { opacity:.5; font-variant-numeric:tabular-nums; }

        /* 7-day plan: cinematic image panel, strong progress hierarchy, tactile checklist. */
        .routine-plan-hero {
          min-height:300px; grid-template-columns:minmax(0,1fr) 265px; padding:2.45rem 2.7rem;
          border:1px solid rgba(179,216,188,.18); border-radius:30px;
          background:linear-gradient(110deg,#082719 0%,#103b28 56%,#214a31 100%);
          box-shadow:0 24px 58px rgba(9,43,27,.2),inset 0 1px 0 rgba(255,255,255,.12);
        }
        .plan-hero-photo {
          position:absolute; z-index:-2; inset:0 0 0 36%;
          background-image:url("https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1800&auto=format&fit=crop&q=85");
          background-size:cover; background-position:center 48%; opacity:.78;
          mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.3) 16%,#000 62%);
        }
        .routine-plan-hero:after {
          content:""; position:absolute; z-index:-1; inset:0;
          background:linear-gradient(90deg,#09291b 0%,rgba(9,41,27,.97) 33%,rgba(9,41,27,.58) 72%,rgba(9,41,27,.35) 100%),
                     linear-gradient(0deg,rgba(4,21,13,.25),transparent 60%);
          pointer-events:none;
        }
        .plan-hero-glow { right:4%; bottom:-170px; width:480px; height:360px; background:rgba(93,204,128,.21); filter:blur(34px); }
        .plan-hero-kicker { color:#c2efce; font-size:.68rem; letter-spacing:.2em; }
        .plan-hero-content h2 { font-size:clamp(2rem,3.4vw,3.05rem); line-height:1.02; letter-spacing:-.045em; text-shadow:0 4px 18px rgba(0,0,0,.18); }
        .plan-hero-content p { max-width:520px; font-size:.87rem; line-height:1.72; }
        .plan-progress-meta { max-width:560px; margin-top:1.65rem; font-size:.77rem; }
        .plan-progress-track { max-width:560px; height:10px; background:rgba(255,255,255,.17); box-shadow:inset 0 1px 3px rgba(0,0,0,.18); }
        .plan-progress-track span { background:linear-gradient(90deg,#67c88a,#d0f3d8); box-shadow:0 0 20px rgba(166,241,185,.55); }
        .plan-ring-wrap { position:relative; z-index:1; }
        .plan-progress-ring { width:178px; height:178px; border:1px solid rgba(255,255,255,.35); box-shadow:0 0 0 10px rgba(255,255,255,.055),0 18px 42px rgba(0,0,0,.28),0 0 45px rgba(137,220,158,.2); }
        .plan-ring-inner { width:148px; height:148px; background:radial-gradient(circle at 40% 22%,#285a3d,#09291b 75%); box-shadow:inset 0 0 0 1px rgba(255,255,255,.12),inset 0 10px 26px rgba(255,255,255,.035); }
        .plan-ring-inner strong { font-size:2.75rem; letter-spacing:-.05em; }
        .plan-ring-inner span { margin-top:.12rem; color:#bce5c7; font-size:.69rem; }
        .plan-ring-caption { color:rgba(255,255,255,.86); font-size:.73rem; }

        .routine-plan-grid { grid-template-columns:minmax(0,1.62fr) minmax(280px,.82fr); gap:1.2rem; }
        .routine-premium-card { border-radius:25px; border-color:#e5ddcf; background:linear-gradient(150deg,#fffefa 0%,#f9f5ec 100%); box-shadow:0 14px 38px rgba(42,53,42,.065),inset 0 1px 0 #fff; }
        .challenge-panel { padding:1.8rem; }
        .panel-eyebrow { letter-spacing:.18em; color:#49815d; }
        .routine-section-title { font-size:1.65rem; letter-spacing:-.035em; }
        .routine-section-subtitle { font-size:.82rem; }
        .challenge-count-pill { width:68px; min-width:68px; height:68px; border-radius:21px; font-size:1.68rem; background:linear-gradient(145deg,#285e40,#0c2d1e); box-shadow:0 10px 22px rgba(18,56,38,.19),inset 0 1px 0 rgba(255,255,255,.18); }
        .routine-premium-checklist { gap:.66rem; }
        .premium-checklist-item {
          min-height:70px; padding:.72rem .9rem; gap:.85rem; border-radius:17px;
          background:linear-gradient(105deg,#fffefa,#f9f6ef);
          box-shadow:0 3px 9px rgba(39,56,43,.025),inset 0 1px 0 #fff;
        }
        .premium-checklist-item.is-complete { background:linear-gradient(105deg,#eef7ef,#f9fbf5); border-color:#c4ddc9; }
        .premium-checklist-item.is-complete:before { content:""; width:3px; align-self:stretch; margin:-.72rem 0 -.72rem -.9rem; border-radius:0 5px 5px 0; background:linear-gradient(#77c98b,#1d6941); }
        .action-number { width:24px; color:#a0aaa1; font-size:.67rem; }
        .action-category-icon { width:43px; height:43px; border-radius:14px; box-shadow:inset 0 1px 0 rgba(255,255,255,.8); }
        .action-main-copy strong { font-size:.84rem; }
        .action-main-copy small { font-size:.68rem; }
        .action-impact-pill { padding:.39rem .68rem; background:#e7f0e7; color:#245b3c; font-size:.66rem; border:1px solid rgba(79,131,89,.08); }
        .premium-action-check { width:29px; height:29px; box-shadow:0 2px 5px rgba(39,56,43,.07); }
        .challenge-panel-footer { margin-top:1.2rem; padding-top:1rem; font-size:.7rem; }
        .today-tip-card {
          min-height:225px; padding:1.65rem; border-radius:25px;
          background:
            linear-gradient(180deg,rgba(7,39,24,.3),rgba(7,39,24,.94)),
            url("https://images.unsplash.com/photo-1437482078695-4d3ef4be9fbb?w=1000&auto=format&fit=crop&q=85") center/cover;
          box-shadow:0 18px 38px rgba(18,56,38,.18),inset 0 1px 0 rgba(255,255,255,.14);
        }
        .tip-icon-bubble { width:42px; height:42px; border-radius:15px; }
        .today-tip-card h3 { font-size:1.5rem; letter-spacing:-.025em; }
        .today-tip-card p { font-size:.83rem; }
        .tip-bottom-line { margin-top:1.35rem; }
        .routine-quote-card { min-height:205px; border-radius:25px; background:radial-gradient(circle at 50% 105%,rgba(100,178,119,.3),transparent 58%),linear-gradient(145deg,#203e2c,#0b2217); box-shadow:0 18px 38px rgba(18,56,38,.16),inset 0 1px 0 rgba(255,255,255,.12); }
        .routine-quote-card p { font-size:1.23rem; }

        /* Adopted swaps: full-bleed photography, glass details, strong editorial type. */
        .swaps-hero-panel {
          min-height:285px; padding:2.35rem 2.5rem; border-radius:29px;
          background:
            linear-gradient(90deg,rgba(7,35,22,.97) 0%,rgba(9,42,26,.88) 50%,rgba(9,42,26,.48) 100%),
            url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1800&auto=format&fit=crop&q=85") center 48%/cover;
          box-shadow:0 24px 54px rgba(11,47,29,.2),inset 0 1px 0 rgba(255,255,255,.14);
        }
        .swaps-hero-copy h2 { font-size:clamp(2rem,3.4vw,2.8rem); letter-spacing:-.045em; }
        .swaps-hero-copy p { font-size:.86rem; }
        .swaps-hero-stats { background:rgba(5,31,19,.32); border-color:rgba(255,255,255,.22); border-radius:20px; box-shadow:inset 0 1px 0 rgba(255,255,255,.13); }
        .swaps-hero-stats>div { padding:1.25rem .95rem; }
        .swaps-hero-stats span { font-size:.58rem; }
        .swaps-hero-stats strong { font-size:2rem; }
        .swaps-section-heading { margin:1.8rem 0 1rem; }
        .swaps-section-heading h3 { font-size:1.55rem; letter-spacing:-.035em; }
        .premium-swaps-grid { gap:1.15rem; }
        .premium-swap-card {
          isolation:isolate; min-height:300px; padding:1.3rem 1.45rem 1.1rem;
          border:1px solid rgba(255,255,255,.22); border-radius:24px;
          background:#183929; box-shadow:0 16px 36px rgba(30,47,35,.14);
          color:#fff; transition:transform .28s ease,box-shadow .28s ease;
        }
        .premium-swap-card:hover { transform:translateY(-5px) scale(1.008); box-shadow:0 24px 48px rgba(30,47,35,.2); }
        .swap-card-image { position:absolute; z-index:-2; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .6s ease; }
        .premium-swap-card:hover .swap-card-image { transform:scale(1.06); }
        .swap-card-scrim { position:absolute; z-index:-1; inset:0; background:linear-gradient(180deg,rgba(5,22,14,.2) 0%,rgba(5,22,14,.28) 34%,rgba(5,22,14,.82) 72%,rgba(5,22,14,.96) 100%); }
        .premium-swap-card:after { right:-50px; top:-75px; width:190px; height:190px; border:1px solid rgba(255,255,255,.15); background:rgba(255,255,255,.06); box-shadow:0 0 0 20px rgba(255,255,255,.025),0 0 0 42px rgba(255,255,255,.018); }
        .tone-transport,.tone-food,.tone-energy,.tone-shopping { --swap-accent:#d5f0dc; --swap-soft:rgba(255,255,255,.16); }
        .swap-feature-icon { width:49px; height:49px; border-radius:16px; color:#f1fff3; background:rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.2); backdrop-filter:blur(12px); box-shadow:0 8px 18px rgba(0,0,0,.12); }
        .swap-active-status { color:#dcf4e2; }
        .swap-active-status span { background:#8be1a7; box-shadow:0 0 0 4px rgba(139,225,167,.17),0 0 12px rgba(139,225,167,.35); }
        .swap-card-index { color:rgba(255,255,255,.58); font-size:1rem; }
        .swap-card-copy { margin:1.45rem 0 1rem; }
        .swap-category-label { color:#b7edc5; }
        .swap-card-copy h3 { max-width:390px; color:#fff; font-size:1.38rem; line-height:1.16; letter-spacing:-.025em; text-shadow:0 2px 12px rgba(0,0,0,.28); }
        .swap-card-copy p { color:rgba(255,255,255,.74); font-size:.76rem; }
        .swap-card-bottom { border-top-color:rgba(255,255,255,.23); padding-top:.85rem; }
        .swap-savings-label { color:rgba(255,255,255,.64); font-size:.57rem; }
        .swap-card-savings strong { color:#fff; font-size:.9rem; }
        .swap-card-money { color:#fff3dc; background:rgba(255,255,255,.15); border:1px solid rgba(255,255,255,.19); backdrop-filter:blur(10px); font-size:.68rem; }
        .swap-card-adopted { color:rgba(255,255,255,.67); font-size:.65rem; }
        .swap-card-adopted svg { color:#b8e8c5; }

        /* Analytics: editorial statement panel, distinct KPI surfaces, richer charts. */
        .analytics-hero-panel {
          min-height:265px; padding:2.25rem 2.5rem; border-radius:29px;
          background:linear-gradient(90deg,rgba(7,34,22,.97) 0%,rgba(9,42,26,.82) 54%,rgba(9,42,26,.42) 100%);
          box-shadow:0 24px 54px rgba(11,47,29,.18),inset 0 1px 0 rgba(255,255,255,.13);
        }
        .analytics-hero-photo { position:absolute; z-index:-2; inset:0; background:url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&auto=format&fit=crop&q=85") center 43%/cover; opacity:.75; }
        .analytics-hero-scrim { position:absolute; z-index:-1; inset:0; background:linear-gradient(90deg,rgba(7,34,22,.97) 0%,rgba(9,42,26,.84) 48%,rgba(9,42,26,.35) 100%); }
        .analytics-hero-panel h2 { font-size:clamp(2rem,3.5vw,2.9rem); letter-spacing:-.045em; }
        .analytics-hero-panel p { font-size:.84rem; }
        .analytics-hero-highlight { min-width:260px; padding:1.3rem 1.5rem; border-radius:21px; background:rgba(5,31,19,.35); box-shadow:inset 0 1px 0 rgba(255,255,255,.14); }
        .analytics-hero-highlight strong { font-size:3rem; letter-spacing:-.05em; }
        .analytics-hero-decoration { color:rgba(207,242,211,.11); right:27%; top:-70px; }
        .analytics-kpi-grid { gap:1.05rem; margin-bottom:1.15rem; }
        .kpi-premium-card { min-height:174px; padding:1.25rem 1.35rem; border-radius:22px; box-shadow:0 12px 30px rgba(38,53,42,.06),inset 0 1px 0 #fff; }
        .kpi-premium-card:after { width:135px; height:135px; right:-56px; bottom:-78px; border:1px solid rgba(255,255,255,.35); box-shadow:0 0 0 16px rgba(255,255,255,.14); }
        .kpi-carbon { background:linear-gradient(145deg,#e8f4e8,#d9ebdc); }
        .kpi-money { background:linear-gradient(145deg,#fff7e7,#f4ead6); }
        .kpi-water { background:linear-gradient(145deg,#edf6f8,#dcecf0); }
        .kpi-streak { background:linear-gradient(145deg,#fff1e7,#f5e3d6); }
        .kpi-top-row { margin-bottom:.95rem; }
        .kpi-premium-card .kpi-icon-wrap { width:43px; height:43px; border-radius:15px; box-shadow:0 5px 12px rgba(36,54,42,.07),inset 0 1px 0 rgba(255,255,255,.8); }
        .kpi-trend { padding:.32rem .55rem; border-radius:999px; background:rgba(255,255,255,.56); font-size:.58rem; }
        .kpi-label { color:#697c6f; font-size:.6rem; }
        .kpi-value { margin:.32rem 0 .18rem; font-size:1.72rem; letter-spacing:-.035em; }
        .kpi-description { color:#7d8c80; font-size:.68rem; }
        .analytics-premium-grid { grid-template-columns:minmax(0,1.15fr) minmax(0,1fr); gap:1.15rem; }
        .premium-chart-card,.premium-breakdown-card { padding:1.7rem 1.8rem; border-radius:25px; }
        .premium-chart-heading h3 { font-size:1.52rem; letter-spacing:-.03em; }
        .premium-chart-heading p { font-size:.76rem; }
        .chart-period-pill { padding:.45rem .7rem; font-size:.6rem; }
        .premium-weekly-chart { height:245px; margin-top:1.55rem; }
        .premium-bar-track { width:46px; height:160px; border-radius:13px; background:linear-gradient(180deg,#f2f0e9,#e6e5dc); }
        .premium-week-column>strong { font-size:.76rem; }
        .premium-week-label { font-size:.66rem; }
        .chart-bottom-note { font-size:.68rem; }
        .premium-category-list { gap:1.05rem; margin:1.45rem 0 1.55rem; }
        .premium-category-top>span { font-size:.77rem; }
        .premium-category-top>span small { font-size:.64rem; }
        .premium-category-top>strong { font-size:.76rem; }
        .premium-category-track { height:10px; margin-top:.56rem; }
        .premium-category-foot { font-size:.6rem; }
        .premium-streak-footer { padding-top:1.2rem; }
        .premium-streak-footer strong { font-size:.74rem; }
        .premium-streak-footer small { font-size:.62rem; }
        .premium-streak-dots { gap:.42rem; margin-top:.85rem; }
        .premium-streak-dots span { width:25px; height:25px; }

        @media(max-width:1050px) {
          .routine-plan-grid { grid-template-columns:minmax(0,1.3fr) minmax(250px,.8fr); }
          .swaps-hero-panel { align-items:flex-start; flex-direction:column; }
          .swaps-hero-stats { max-width:none; width:100%; }
          .analytics-kpi-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
        }
        @media(max-width:850px) {
          .routine-plan-grid,.analytics-premium-grid { grid-template-columns:1fr; }
          .routine-plan-hero { grid-template-columns:minmax(0,1fr) 190px; padding:1.7rem; }
          .premium-swaps-grid { grid-template-columns:1fr 1fr; }
        }
        @media(max-width:600px) {
          .routine-premium { padding:1.2rem 1rem 2.5rem; }
          .routine-page-header { align-items:flex-start; flex-direction:column; gap:1rem; }
          .routine-premium-tabs { width:100%; justify-content:space-between; }
          .routine-plan-hero { grid-template-columns:1fr; gap:1.1rem; padding:1.45rem; }
          .plan-hero-photo { inset:0; opacity:.4; mask-image:none; }
          .plan-ring-wrap { flex-direction:row; justify-content:flex-start; }
          .plan-progress-ring { width:94px; height:94px; }
          .plan-ring-inner { width:74px; height:74px; }
          .plan-ring-inner strong { font-size:1.45rem; }
          .challenge-panel { padding:1rem; }
          .premium-checklist-item { gap:.48rem; padding:.62rem .58rem; }
          .action-number { display:none; }
          .action-category-icon { width:33px; height:33px; border-radius:11px; }
          .action-main-copy strong { font-size:.72rem; }
          .action-main-copy small { font-size:.58rem; }
          .action-impact-pill { padding:.28rem .38rem; font-size:.55rem; }
          .premium-action-check { width:23px; height:23px; }
          .swaps-hero-panel,.analytics-hero-panel { padding:1.45rem; border-radius:21px; }
          .swaps-hero-stats { grid-template-columns:1fr; }
          .swaps-hero-stats>div+div { border-left:0; border-top:1px solid rgba(255,255,255,.13); }
          .premium-swaps-grid { grid-template-columns:1fr; }
          .premium-swap-card { min-height:270px; }
          .analytics-hero-panel { align-items:flex-start; flex-direction:column; gap:1rem; }
          .analytics-hero-highlight { width:100%; min-width:0; }
          .analytics-kpi-grid { grid-template-columns:1fr 1fr; gap:.6rem; }
          .kpi-premium-card { min-height:150px; padding:.9rem; }
          .kpi-value { font-size:1.28rem; }
          .premium-chart-card,.premium-breakdown-card { padding:1.05rem; }
          .premium-weekly-chart { padding-left:1.7rem; padding-right:.1rem; }
          .chart-gridline { left:1.65rem; }
          .chart-gridline span { left:-1.7rem; font-size:.48rem; }
          .premium-week-column { min-width:39px; }
          .premium-bar-track { width:29px; }
          .premium-week-label { font-size:.52rem; }
          .chart-bottom-note { font-size:.55rem; }
          .premium-category-top>span { font-size:.64rem; }
          .premium-category-top>span small { flex-basis:100%; margin-left:1rem; }
        }


        /* Balanced palette: warm ivory, restrained forest accents, and category-specific colour. */
        .challenge-panel-editorial {
          position:relative; isolation:isolate; overflow:hidden;
          border:1px solid #e6ddcf;
          background:
            radial-gradient(ellipse at 100% 0%,rgba(224,203,169,.24),transparent 34%),
            radial-gradient(ellipse at 0% 100%,rgba(207,220,199,.22),transparent 36%),
            linear-gradient(145deg,#fffdf8 0%,#f7f1e7 100%);
          box-shadow:0 18px 42px rgba(59,53,40,.075),inset 0 1px 0 #fff;
        }
        .challenge-panel-editorial:before {
          content:""; position:absolute; z-index:-1; width:260px; height:260px; right:-145px; top:-155px;
          border:1px solid rgba(177,151,111,.2); border-radius:50%;
          box-shadow:0 0 0 24px rgba(177,151,111,.04),0 0 0 52px rgba(177,151,111,.025);
          pointer-events:none;
        }
        .challenge-panel-editorial .panel-eyebrow { color:#9b7650; }
        .challenge-panel-editorial .routine-section-title { color:#1c3327; font-size:1.68rem; }
        .challenge-panel-editorial .routine-section-subtitle { color:#85877d; font-size:.8rem; }
        .challenge-panel-editorial .challenge-count-pill {
          color:#fffaf0; background:linear-gradient(145deg,#294b37,#173724);
          box-shadow:0 8px 20px rgba(28,65,43,.18),inset 0 1px 0 rgba(255,255,255,.18);
        }
        .challenge-panel-editorial .challenge-count-pill i { color:#d7e4d1; }
        .challenge-panel-editorial .premium-checklist-item {
          min-height:72px; border:1px solid #e8e0d4; border-radius:16px;
          background:linear-gradient(110deg,#fffefa,#fbf7ef);
          box-shadow:0 4px 12px rgba(63,58,45,.035),inset 0 1px 0 #fff;
        }
        .challenge-panel-editorial .premium-checklist-item:hover {
          transform:translateY(-2px); border-color:#c7b79e;
          box-shadow:0 10px 22px rgba(63,58,45,.09),inset 0 1px 0 #fff;
        }
        .challenge-panel-editorial .premium-checklist-item.is-complete {
          border-color:#d1dfcf;
          background:linear-gradient(105deg,#edf4eb,#f8f8ef);
        }
        .challenge-panel-editorial .premium-checklist-item.is-complete:before {
          content:""; width:3px; align-self:stretch; flex-shrink:0; margin:-.72rem 0 -.72rem -.9rem;
          border-radius:0 5px 5px 0; background:linear-gradient(#7eaa82,#477653);
        }
        .challenge-panel-editorial .action-number { color:#a29e91; }
        .challenge-panel-editorial .action-category-icon {
          color:#527b69; background:#e7eee5; border:1px solid rgba(93,128,99,.1);
          box-shadow:inset 0 1px 0 rgba(255,255,255,.85);
        }
        .challenge-panel-editorial .category-food { color:#a76e42; background:#f8eadc; border-color:#f0dfcf; }
        .challenge-panel-editorial .category-transport { color:#477b94; background:#e5eff3; border-color:#d8e7ec; }
        .challenge-panel-editorial .category-energy { color:#a17a31; background:#f7efd9; border-color:#eee3c1; }
        .challenge-panel-editorial .category-home { color:#58838b; background:#e4f0ef; border-color:#d4e5e3; }
        .challenge-panel-editorial .category-shopping { color:#7a6c9a; background:#eeeaf5; border-color:#e1dbee; }
        .challenge-panel-editorial .premium-checklist-item.is-complete .action-category-icon {
          color:#fff; background:linear-gradient(145deg,#5d8b67,#315c40); border-color:transparent;
        }
        .challenge-panel-editorial .action-main-copy strong { color:#28392e; font-size:.84rem; }
        .challenge-panel-editorial .action-main-copy small { color:#96968b; }
        .challenge-panel-editorial .action-impact-pill {
          color:#586d56; background:#f0f1e9; border:1px solid #e4e7da;
        }
        .challenge-panel-editorial .premium-action-check {
          color:#8b9387; border-color:#ded9cd; background:#fffdf8;
        }
        .challenge-panel-editorial .is-complete .premium-action-check {
          color:#fff; border-color:#315f40; background:#315f40;
          box-shadow:0 3px 9px rgba(49,95,64,.16);
        }
        .challenge-panel-editorial .challenge-panel-footer {
          color:#8a8d82; border-top-color:#e9e1d6;
        }
        .challenge-panel-editorial .challenge-panel-footer svg { color:#6f9572; }

        /* Carbon chart: mixed-tone columns, a polished trajectory line, and a featured latest week. */
        .carbon-chart-shell {
          position:relative; margin-top:1rem; padding:1rem 1rem .65rem; overflow:hidden;
          border:1px solid #e7dfd2; border-radius:22px;
          background:
            radial-gradient(ellipse at 88% 0%,rgba(222,197,159,.2),transparent 34%),
            linear-gradient(145deg,#fffdf8,#f5f0e6);
          box-shadow:inset 0 1px 0 #fff,0 9px 22px rgba(53,54,43,.045);
        }
        .carbon-chart-summary { display:flex; align-items:flex-end; justify-content:space-between; gap:.8rem; padding:0 .45rem .35rem; }
        .carbon-chart-caption { display:block; color:#938b7c; font-size:.55rem; font-weight:850; letter-spacing:.15em; }
        .carbon-chart-summary strong { display:block; margin-top:.17rem; color:#203c2c; font:700 1.55rem 'Fraunces',Georgia,serif; letter-spacing:-.035em; }
        .carbon-chart-summary strong small { color:#818276; font:500 .67rem 'DM Sans',sans-serif; }
        .carbon-chart-summary-right { display:flex; flex-direction:column; align-items:flex-end; gap:.38rem; }
        .carbon-chart-summary-right>small { color:#8d8c80; font-size:.58rem; }
        .carbon-chart-summary-right>small b { color:#a36d42; }
        .carbon-chart-trend { display:inline-flex; align-items:center; gap:.35rem; padding:.4rem .65rem; border:1px solid #e6d9c6; border-radius:999px; color:#98683d; background:#fff9ef; font-size:.62rem; font-weight:800; white-space:nowrap; }
        .carbon-area-chart { display:block; width:100%; height:auto; overflow:visible; margin-top:.25rem; }
        .carbon-chart-area { fill:url(#carbonAreaFill); }
        .carbon-chart-grid line { stroke:#e6dfd3; stroke-width:1; stroke-dasharray:3 7; }
        .carbon-chart-axis-labels { fill:#a29b8e; font:11px 'DM Sans',sans-serif; }
        .carbon-chart-line { fill:none; stroke:url(#carbonTrendStroke); stroke-width:4; stroke-linecap:round; filter:drop-shadow(0 4px 4px rgba(40,77,53,.15)); }
        .carbon-chart-points circle { fill:#fffaf1; stroke:#537b60; stroke-width:3.5; }
        .carbon-chart-points .carbon-point-latest { fill:#fff3df; stroke:#b97846; stroke-width:4.5; }
        .carbon-chart-values { fill:#536b58; font:700 12px 'DM Sans',sans-serif; }
        .carbon-latest-callout rect { fill:#b97846; filter:drop-shadow(0 3px 4px rgba(108,67,35,.18)); }
        .carbon-latest-callout text { fill:#fffaf1; font-size:12px; font-weight:800; }
        .carbon-chart-weeks { fill:#8f9186; font:800 10px 'DM Sans',sans-serif; letter-spacing:1.1px; }
        .carbon-chart-legend { display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:1.1rem; padding:.15rem 0 .25rem; color:#85887d; font-size:.59rem; }
        .carbon-chart-legend span { display:inline-flex; align-items:center; gap:.38rem; }
        .carbon-chart-legend i { display:inline-block; width:17px; height:7px; border-radius:5px; }
        .carbon-chart-legend .legend-bar { background:linear-gradient(90deg,#b7c8b6,#bd8f61,#688d8c,#254b35); }
        .carbon-chart-legend .legend-line { height:3px; background:#315b40; }
        @media(max-width:600px) {
          .challenge-panel-editorial .routine-section-title { font-size:1.35rem; }
          .challenge-panel-editorial .premium-checklist-item { gap:.4rem; padding:.62rem .55rem; }
          .challenge-panel-editorial .action-impact-pill { font-size:.51rem; padding:.25rem .32rem; }
          .carbon-chart-shell { margin-left:-.25rem; margin-right:-.25rem; padding:.7rem .45rem .35rem; }
          .carbon-chart-summary strong { font-size:1.18rem; }
          .carbon-chart-trend { font-size:.53rem; padding:.32rem .45rem; }
          .carbon-chart-values { font-size:11px; }
          .carbon-chart-weeks { font-size:9px; }
        }
        
        /* Raised 3D carbon columns with visible top/side planes and soft floor shadows. */
        .carbon-chart-shell { perspective:1100px; }
        .carbon-area-chart { overflow:visible; transform:rotateX(2deg); transform-origin:50% 100%; }
        .carbon-chart-floor { fill:#ebe5d9; stroke:#d6cdbd; stroke-width:1; }
        .carbon-chart-floor-lines { fill:none; stroke:#d5ccbc; stroke-width:1; opacity:.72; }
        .bar-ground-shadow { fill:rgba(40,48,37,.18); filter:url(#bar3DShadow); }
        .bar-front { stroke:rgba(255,255,255,.48); stroke-width:1; }
        .bar-front-gloss { fill:url(#barFrontGloss); pointer-events:none; }
        .bar-side { fill:#566f59; stroke:rgba(34,53,37,.18); stroke-width:1; }
        .bar-top { fill:#d0dcc8; stroke:rgba(255,255,255,.52); stroke-width:1; }
        .bar-prism-sage .bar-front { fill:url(#barSage); }
        .bar-prism-sage .bar-side { fill:#718b75; }
        .bar-prism-sage .bar-top { fill:#d0ddcf; }
        .bar-prism-sand .bar-front { fill:url(#barSand); }
        .bar-prism-sand .bar-side { fill:#a77d57; }
        .bar-prism-sand .bar-top { fill:#f1d9b9; }
        .bar-prism-blue .bar-front { fill:url(#barBlue); }
        .bar-prism-blue .bar-side { fill:#587b7d; }
        .bar-prism-blue .bar-top { fill:#d0e1df; }
        .bar-prism-forest .bar-front { fill:url(#barForest); }
        .bar-prism-forest .bar-side { fill:#1d422d; }
        .bar-prism-forest .bar-top { fill:#91ad93; }
        .carbon-chart-bars-3d .bar-prism { filter:drop-shadow(0 7px 8px rgba(35,48,35,.11)); }
        .carbon-chart-line { stroke-width:3.5; opacity:.9; }
        .carbon-chart-points circle { stroke-width:3; }

        /* Your swaps: wider breathing room, taller photo panels, and expanded impact breakdown. */
        .swaps-hero-panel { min-height:320px; padding:2.65rem 2.8rem; }
        .swaps-hero-copy { max-width:490px; }
        .swaps-hero-copy h2 { font-size:clamp(2.25rem,3.8vw,3.15rem); max-width:440px; line-height:1.02; }
        .swaps-hero-copy p { max-width:455px; font-size:.9rem; }
        .swaps-hero-stats { max-width:600px; }
        .swaps-hero-stats>div { padding:1.45rem 1rem; }
        .swaps-hero-stats strong { font-size:2.15rem; }
        .swaps-section-heading { margin:2.1rem 0 1.15rem; }
        .swaps-section-heading h3 { font-size:1.72rem; }
        .premium-swaps-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:1.35rem; }
        .premium-swap-card { min-height:385px; padding:1.6rem 1.65rem 1.3rem; border-radius:27px; }
        .swap-card-image { filter:saturate(.9); }
        .swap-card-scrim { background:linear-gradient(180deg,rgba(6,24,16,.12) 0%,rgba(6,24,16,.22) 28%,rgba(6,24,16,.76) 58%,rgba(6,24,16,.95) 100%); }
        .swap-feature-icon { width:54px; height:54px; border-radius:18px; }
        .swap-card-copy { margin:2.3rem 0 1.1rem; }
        .swap-card-copy h3 { font-size:1.62rem; max-width:430px; line-height:1.12; }
        .swap-card-copy p { max-width:430px; font-size:.8rem; }
        .swap-card-expanded-metrics {
          position:relative; z-index:1; display:grid; grid-template-columns:minmax(0,1fr) 1px minmax(0,1fr);
          align-items:center; gap:1rem; margin-top:auto; padding:1rem 1.05rem;
          border:1px solid rgba(255,255,255,.24); border-radius:18px;
          background:rgba(12,31,21,.42); backdrop-filter:blur(16px);
          box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 8px 20px rgba(0,0,0,.09);
        }
        .swap-expanded-metric { min-width:0; }
        .swap-expanded-metric .swap-savings-label { color:rgba(255,255,255,.64); font-size:.56rem; letter-spacing:.1em; }
        .swap-expanded-metric strong { display:block; margin-top:.36rem; color:#fff; font-size:.9rem; line-height:1.35; }
        .swap-expanded-divider { height:39px; background:rgba(255,255,255,.2); }
        .swap-card-adopted { margin-top:.85rem; font-size:.67rem; }
        @media(max-width:1050px) {
          .swaps-hero-panel { min-height:0; padding:2rem; }
          .premium-swap-card { min-height:360px; }
        }
        @media(max-width:700px) {
          .premium-swaps-grid { grid-template-columns:1fr; }
          .premium-swap-card { min-height:345px; padding:1.3rem; }
          .swap-card-copy { margin:1.8rem 0 1rem; }
          .swap-card-copy h3 { font-size:1.35rem; }
          .swap-card-expanded-metrics { gap:.65rem; padding:.8rem; }
          .swap-expanded-metric strong { font-size:.78rem; }
          .carbon-chart-shell { perspective:none; }
          .carbon-area-chart { transform:none; }
        }
      `}</style>
    </div>
  );
}
