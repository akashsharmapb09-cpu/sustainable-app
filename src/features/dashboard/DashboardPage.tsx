import { useEffect, useState } from 'react';
import { ArrowRight, Check, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

const WINS = [
  { id: 'bottle', title: 'Reusable water bottle used', copy: 'Skip single-use plastic and stay hydrated.', image: 'bottle.webp', alt: 'Green reusable bottle with a cork lid' },
  { id: 'transport', title: 'Public transport instead of car', copy: 'Cleaner air, less traffic, stronger cities.', image: 'bus.webp', alt: 'Green city bus on a tree-lined street' },
  { id: 'cycle', title: 'Walk or cycle for short trips', copy: 'Healthier you, cleaner planet.', image: 'bike.webp', alt: 'Bicycle in a green city park' },
  { id: 'compost', title: 'Compost scraps after dinner', copy: 'Turn waste into healthy soil.', image: 'compost.webp', alt: 'Compost bin filled with vegetable scraps' },
  { id: 'led', title: 'Use LED bulbs', copy: 'Less energy. Lower emissions.', image: 'led.webp', alt: 'Glowing LED bulb with a green leaf' },
  { id: 'secondhand', title: 'Choose second-hand', copy: 'Give clothes a longer life.', image: 'secondhand.webp', alt: 'Folded beige second-hand shirt' },
] as const;
const STORE_KEY = 'greenswap.dailyWins.v1';

export function DashboardPage() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]');
      if (Array.isArray(saved)) setCompleted(saved.filter((id): id is string => typeof id === 'string'));
    } catch { /* Start with an empty daily checklist if storage is unavailable. */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(completed)); } catch { /* Storage can be disabled. */ }
  }, [completed]);
  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>('.topbar-search input');
    if (!input) return;
    const update = () => setSearch(input.value);
    input.addEventListener('input', update);
    return () => input.removeEventListener('input', update);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleWins = WINS.filter((win) => (win.title + " " + win.copy).toLowerCase().includes(search.trim().toLowerCase()));
  const toggle = (id: string) => {
    const done = completed.includes(id);
    setCompleted((old) => done ? old.filter((item) => item !== id) : [...old, id]);
    const win = WINS.find((item) => item.id === id);
    setToast(done ? 'Habit unmarked' : "Nice work — " + (win?.title ?? "habit logged"));
  };

  return <div className="gs-dashboard">
    <nav className="gs-view-tabs" aria-label="Dashboard views">
      <Link className="active" to="/dashboard">7-day plan</Link><Link to="/routine">Your goals</Link><Link to="/progress">Analytics</Link><Link className="gs-impact-tab" to="/progress"><Leaf size={17} /> <span><b>Your impact</b><small>6.2 kg CO₂ saved</small></span></Link>
    </nav>
    <section className="gs-summary" aria-label="Weekly impact summary">
      <div className="gs-progress-card"><Leaf className="gs-sprig" aria-hidden="true"/><div className="gs-ring" role="img" aria-label="4 of 7 days completed"><div><strong>4/7</strong><span>days done</span></div></div><div className="gs-progress-copy"><div className="gs-eyebrow">Your 7-day plan</div><h1>Keeping consistent —<br/>3 days to go!</h1><div className="gs-progress-track"><span/></div></div></div>
      <div className="gs-co2-card"><div className="gs-co2-title"><Leaf size={22} fill="currentColor"/> CO₂ saved this week</div><div className="gs-co2-value">6.2 <small>kg</small></div><div className="gs-co2-badge">↑ <b>+0.8 kg</b> from last week</div><img className="gs-earth-art" src="/dashboard-assets/earth-decoration.webp" alt="" aria-hidden="true"/></div>
    </section>
    <section className="gs-wins-section" aria-labelledby="gs-wins-heading"><div className="gs-section-head"><div><h2 id="gs-wins-heading"><Leaf size={25} fill="currentColor"/> Your 6 Daily Wins</h2><p className="gs-wins-count">{completed.length} of 6 habits logged today</p></div><p className="gs-slogan">Better choices. A cleaner tomorrow.</p></div>
      <div className="gs-wins-grid">{visibleWins.map((win) => { const done = completed.includes(win.id); return <article className={"gs-win-card" + (done ? " is-done" : "")} key={win.id}><div className="gs-win-art"><img src={"/dashboard-assets/" + win.image} alt={win.alt} loading="lazy"/><span className="gs-completed-mark"><Check size={16} strokeWidth={3}/></span></div><div className="gs-win-body"><h3>{win.title}</h3><p>{win.copy}</p><div className="gs-win-foot"><small>{done ? 'Logged today' : 'Daily habit'}</small><button type="button" className="gs-done-btn" onClick={() => toggle(win.id)} aria-label={(done ? "Undo: " : "Mark done: ") + win.title} title={done ? 'Undo completion' : 'Mark done'}>{done ? <Check size={18}/> : <ArrowRight size={18}/>}</button></div></div></article>; })}</div>
      {visibleWins.length === 0 && <p className="gs-no-results">No daily wins match “{search}”. Try another search.</p>}
    </section>
    <div className="gs-footer-note"><span>Small choices add up <Leaf size={13}/></span><span>Your impact is estimated from the habits you log.</span></div><div className={"gs-toast" + (toast ? " show" : "")} role="status" aria-live="polite">{toast}</div>
  </div>;
}
