import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const rituals = [
  'Plan one meal around food already at home',
  'Carry a reusable bottle or cup',
  'Walk, cycle or combine a short trip if practical',
  'Switch off unused lights and devices',
  'Store leftovers where you can see them',
  'Repair, borrow or buy second-hand before replacing',
  'Make a short list before grocery shopping',
];

const topics = [
  { id: 'food', number: '01', title: 'Prevent food waste', description: 'Give ingredients a plan before they become leftovers.', detail: 'Try a fridge-first meal and label leftovers clearly.', src: 'SRC: WRAP / FOOD WASTE GUIDANCE', visual: 'bars' },
  { id: 'travel', number: '02', title: 'Choose smarter trips', description: 'Make the journey fit the day, not the other way round.', detail: 'Combine errands or choose a walk for a nearby trip when it works.', src: 'FIELD NOTE: TRAVEL OPTIONS', visual: 'route' },
  { id: 'energy', number: '03', title: 'Use energy thoughtfully', description: 'Small routines can make everyday energy use more deliberate.', detail: 'Start with idle devices, efficient settings and daylight.', src: 'SRC: ENERGY SAVING TRUST', visual: 'energy' },
  { id: 'reuse', number: '04', title: 'Reuse, repair, borrow', description: 'Extend the life of things you already have.', detail: 'Check repair, borrowing and second-hand options before buying new.', src: 'FIELD NOTE: CIRCULAR USE', visual: 'checks' },
];

function readSaved(): string[] {
  try { const raw = localStorage.getItem('greenswap-saved-swaps'); const value: unknown = raw ? JSON.parse(raw) : []; return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []; } catch { return []; }
}
function readRituals(): boolean[] {
  try { const raw = localStorage.getItem('greenswap-weekly-plan'); const value: unknown = raw ? JSON.parse(raw) : {}; return rituals.map((_, i) => Boolean((value as Record<string, unknown>)[String(i)])); } catch { return rituals.map(() => false); }
}
function saveEvent(name: string, props: Record<string, string | number> = {}) {
  // Privacy-friendly analytics is opt-in and only emits the three documented events.
  const endpoint = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  if (endpoint && typeof window !== 'undefined' && navigator.doNotTrack !== '1') {
    const plausible = (window as Window & { plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void }).plausible;
    plausible?.(name, { props });
  }
}
function LineIcon({ type }: { type: string }) {
  if (type === 'bars') return <span className="topic-bars" aria-hidden="true"><i/><i/><i/></span>;
  if (type === 'route') return <span className="topic-route" aria-hidden="true"><i/><i/><i/></span>;
  if (type === 'energy') return <span className="topic-energy" aria-hidden="true">≈</span>;
  return <span className="font-mono text-sm" aria-hidden="true">[ ]<br/>[ ]<br/>[ ]</span>;
}
export function DashboardPage() {
  const reduceMotion = useReducedMotion();
  const [saved, setSaved] = useState<string[]>(readSaved);
  const [done, setDone] = useState<boolean[]>(readRituals);
  const [toast, setToast] = useState('');
  const [email, setEmail] = useState('');
  const [count, setCount] = useState(0);
  const complete = done.filter(Boolean).length;
  const isFinished = complete === 7;
  const shareText = useMemo(() => `I’m building lighter habits with GreenSwap — practical sustainable swaps for real life. #GreenSwap2026`, []);
  useEffect(() => { saveEvent('dashboard_view'); }, []);
  useEffect(() => {
    if (reduceMotion) { setCount(0.7); return; }
    let start: number | undefined;
    let frame = 0;
    const tick = (time: number) => { if (start === undefined) start = time; const p = Math.min((time - start) / 700, 1); setCount(0.7 * (1 - Math.pow(1 - p, 3))); if (p < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);
  useEffect(() => {
    if (!isFinished) return;
    const key = 'greenswap-confetti-shown';
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    setToast('Seven small rituals. A lovely start.');
    const timer = window.setTimeout(() => setToast(''), 3600);
    return () => window.clearTimeout(timer);
  }, [isFinished]);
  function toggleSwap(id: string) {
    const next = saved.includes(id) ? saved.filter(v => v !== id) : [...saved, id];
    setSaved(next);
    localStorage.setItem('greenswap-saved-swaps', JSON.stringify(next));
    saveEvent('swap_toggled', { swap_id: id, saved: next.includes(id) ? 1 : 0 });
  }
  function toggleRitual(index: number) {
    const next = done.map((v, i) => i === index ? !v : v);
    setDone(next);
    localStorage.setItem('greenswap-weekly-plan', JSON.stringify(Object.fromEntries(next.map((v, i) => [String(i), v]))));
  }
  async function shareImpact() {
    try { if (navigator.share) await navigator.share({ title: 'My GreenSwap practice', text: shareText, url: window.location.origin }); else { await navigator.clipboard.writeText(shareText + ' ' + window.location.origin); setToast('Share text copied.'); window.setTimeout(() => setToast(''), 2500); } } catch { /* A dismissed share sheet is not an error. */ }
  }
  function inviteFriend() {
    const message = 'Join me on GreenSwap for practical sustainable swaps that fit real life: ' + window.location.origin;
    if (navigator.share) void navigator.share({ title: 'Try GreenSwap', text: message }).catch(() => undefined);
    else void navigator.clipboard.writeText(message).then(() => { setToast('Invite copied.'); window.setTimeout(() => setToast(''), 2500); });
  }
  function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) { setToast('Enter a valid email address.'); return; }
    const list = (() => { try { const raw = localStorage.getItem('greenswap-newsletter-local'); const v: unknown = raw ? JSON.parse(raw) : []; return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []; } catch { return []; } })();
    if (!list.includes(clean)) list.push(clean);
    localStorage.setItem('greenswap-newsletter-local', JSON.stringify(list));
    setEmail('');
    setToast('Saved on this device. Newsletter delivery is not connected yet.');
    window.setTimeout(() => setToast(''), 4000);
  }
  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#0E0E0E]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 px-5 py-5 sm:px-10 lg:px-[8%]">
        <Link to="/" className="font-serif text-2xl" aria-label="GreenSwap home">GreenSwap<span className="text-[#b64b2c]">.</span></Link>
        <nav aria-label="Dashboard navigation" className="flex flex-wrap items-center gap-4 text-xs"><a href="#topics" className="hover:underline">Important topics</a><a href="#rituals" className="hover:underline">Weekly ritual</a><Link to="/profile" className="hover:underline">My profile</Link><Link to="/pro" className="rounded-full bg-[#0E0E0E] px-4 py-2 text-white">Explore Pro ↗</Link></nav>
      </header>
      <div className="mx-auto max-w-[1440px] px-5 py-9 sm:px-10 lg:px-[8%]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="taxonomy-label">FIELD NOTES / EDITION 2026 · FIG. 04</p><h1 className="mt-3 font-serif text-6xl tracking-[-.04em] sm:text-7xl">Your dashboard<span className="text-[#b64b2c]">.</span></h1><p className="mt-3 max-w-xl text-sm leading-6 text-black/60">A practical starting point for a lighter routine. Keep what fits; leave what doesn’t.</p></div><Link to="/profile" className="border border-black/20 px-4 py-3 text-sm hover:border-black/50">Tune my preferences ↗</Link></div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <section className="premium-card editorial-grain bg-[#111110] text-[#F7F5F0] lg:col-span-8" aria-labelledby="saved-title">
            <div className="flex items-start justify-between gap-4"><p className="taxonomy-label text-white/60">YOUR PRACTICE / INDICATIVE VALUE</p><span className="font-mono text-[10px] text-white/50">FIG. 01</span></div>
            <h2 id="saved-title" className="mt-8 font-serif text-5xl leading-none sm:text-7xl"><motion.span key={count.toFixed(2)}>{count.toFixed(1)}</motion.span><span className="text-2xl sm:text-3xl">t CO₂e</span></h2>
            <p className="mt-4 text-sm text-white/65">saved / month <span className="mx-2">—</span> illustrative example, not a measured personal result</p>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4"><span className="font-mono text-[9px] uppercase tracking-widest text-white/45">SRC: DEMO FIGURE · NOT A VERIFIED ESTIMATE</span><button onClick={() => void shareImpact()} className="border border-white/30 px-4 py-2 text-xs hover:bg-white hover:text-black" aria-label="Share GreenSwap impact">Share my impact ↗</button></div>
          </section>
          <section className="premium-card flex flex-col justify-between lg:col-span-4" aria-labelledby="ritual-progress-title">
            <div className="flex justify-between"><p className="taxonomy-label">WEEKLY PRACTICE</p><span className="font-mono text-[10px]">FIG. 02</span></div>
            <div className="my-5 flex items-center gap-5">
              <svg viewBox="0 0 120 120" className="w-32 shrink-0" role="img" aria-label={`${complete} of 7 rituals completed`}><circle cx="60" cy="60" r="49" fill="none" stroke="rgba(14,14,14,.1)" strokeWidth="8"/><circle cx="60" cy="60" r="49" fill="none" stroke="#315b3d" strokeWidth="8" strokeLinecap="butt" strokeDasharray={String(2*Math.PI*49)} strokeDashoffset={String(2*Math.PI*49*(1-complete/7))} transform="rotate(-90 60 60)" className="transition-all duration-500"/><text x="60" y="57" textAnchor="middle" fontSize="25" fill="#0E0E0E" fontFamily="Georgia">{complete}</text><text x="60" y="75" textAnchor="middle" fontSize="11" fill="#666">of 7</text></svg>
              <div><h2 id="ritual-progress-title" className="font-serif text-2xl">Ritual completion</h2><p className="mt-2 text-xs leading-5 text-black/55">{isFinished ? 'All seven. Keep the good life.' : 'A small repeatable action is more useful than a perfect plan.'}</p></div>
            </div>
            <a href="#rituals" className="border-t border-black/10 pt-4 text-sm underline underline-offset-4">Continue the week →</a>
          </section>
        </div>
        <section id="topics" className="mt-12 scroll-mt-8">
          <div className="mb-5 flex items-center justify-between border-b border-black/15 pb-3"><h2 className="taxonomy-label">IMPORTANT TOPICS</h2><span className="font-mono text-xs">[04]</span></div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map(topic => <motion.article key={topic.id} whileHover={reduceMotion ? undefined : { y: -2 }} transition={{ duration: .18, ease: 'easeOut' }} className="premium-card topic-card group relative flex min-h-[300px] flex-col overflow-hidden">
              <div className="topic-rule absolute left-0 top-0 h-px w-0 bg-[#0E0E0E] transition-all duration-300 group-hover:w-full group-focus-within:w-full" />
              <div className="flex items-start justify-between"><span className="taxonomy-label">{topic.number} / FIELD NOTE</span><LineIcon type={topic.visual} /></div>
              <h3 className="mt-8 font-serif text-3xl leading-[.98]">{topic.title}</h3><p className="mt-3 text-sm leading-6 text-black/60">{topic.description}</p><p className="mt-4 text-xs leading-5">{topic.detail}</p>
              <div className="mt-auto flex items-end justify-between gap-2 border-t border-black/10 pt-4"><span className="max-w-[75%] font-mono text-[8px] tracking-wide text-black/45">{topic.src}</span><button onClick={() => toggleSwap(topic.id)} aria-pressed={saved.includes(topic.id)} aria-label={`${saved.includes(topic.id) ? 'Remove' : 'Save'} ${topic.title}`} className="whitespace-nowrap border border-black/20 px-3 py-2 text-xs hover:border-black/60">{saved.includes(topic.id) ? 'Saved ✓' : 'Save +'}</button></div>
            </motion.article>)}
          </div>
          <p className="mt-3 text-xs text-black/45">{saved.length ? `${saved.length} of 7 free swaps saved` : 'No swaps yet — start with one that fits.'} <span className="ml-2 font-mono text-[9px]">SAVED ON THIS DEVICE</span></p>
          {saved.length >= 7 && <div className="premium-card relative mt-4 overflow-hidden"><div className="select-none blur-[2px]" aria-hidden="true"><p className="taxonomy-label">MORE ROOM TO EXPLORE</p><h3 className="mt-2 font-serif text-3xl">Your next collection</h3><p className="mt-2 text-sm">More tailored swap ideas and planning space.</p></div><Link to="/pro" className="absolute inset-0 grid place-items-center bg-[#F7F5F0]/55 font-serif text-2xl underline underline-offset-4">Unlock with Pro ↗</Link></div>}
        </section>
        <section id="rituals" className="mt-14 scroll-mt-8">
          <div className="mb-5 flex items-end justify-between border-b border-black/15 pb-3"><div><p className="taxonomy-label">SEVEN DAYS / SMALL REPEATS</p><h2 className="mt-2 font-serif text-4xl">A week that works.</h2></div><span className="font-mono text-xs">{String(complete).padStart(2,'0')} / 07</span></div>
          {isFinished && <div className="paper-confetti" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{left:`${(i*37)%100}%`,animationDelay:`${(i%8)*.11}s`,transform:`rotate(${i*29}deg)`}} />)}</div>}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">{rituals.map((ritual,i)=><label key={ritual} className={`premium-card flex cursor-pointer items-start gap-3 ${done[i]?'bg-[#e9ece3]':''}`}><input type="checkbox" checked={done[i]} onChange={() => toggleRitual(i)} className="mt-1 accent-[#315b3d]" aria-label={ritual}/><span className="min-w-0"><span className="taxonomy-label">{String(i+1).padStart(2,'0')} / DAY</span><span className={`mt-2 block text-sm leading-5 ${done[i]?'line-through text-black/45':''}`}>{ritual}</span></span></label>)}</div>
          <p className="mt-3 font-mono text-[9px] tracking-widest text-black/45">ACTIONS ARE SUGGESTIONS, NOT A SCORE OF YOUR VALUES.</p>
        </section>
        <section className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="premium-card"><p className="taxonomy-label">PASS IT ON / 01</p><h2 className="mt-3 font-serif text-3xl">Share my impact.</h2><p className="mt-2 text-sm leading-6 text-black/60">Invite someone into a lighter routine. Share a link and an honest note about what you are trying.</p><button onClick={() => void shareImpact()} className="mt-5 rounded-full bg-[#0E0E0E] px-5 py-3 text-sm text-white hover:bg-black/80">Share my impact ↗</button><p className="mt-3 font-mono text-[9px] text-black/40">SHARE CARD USES YOUR BROWSER'S NATIVE SHARE SHEET WHEN AVAILABLE.</p></article>
          <article className="premium-card"><p className="taxonomy-label">GOOD THINGS TRAVEL / 02</p><h2 className="mt-3 font-serif text-3xl">Invite a friend.</h2><p className="mt-2 text-sm leading-6 text-black/60">Send GreenSwap to a friend. Referral rewards are a future feature; no reward is issued yet.</p><button onClick={inviteFriend} className="mt-5 border border-black/20 px-5 py-3 text-sm hover:border-black/50">Invite friend ↗</button></article>
        </section>
        <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="premium-card"><p className="taxonomy-label">FIELD LETTERS / OCCASIONAL</p><h2 className="mt-3 font-serif text-3xl">A note now and then.</h2><p className="mt-2 text-sm text-black/60">Practical ideas, never a popup. Newsletter signup is stored locally until delivery is connected.</p><form className="mt-5 flex flex-wrap gap-2" onSubmit={subscribe}><label htmlFor="newsletter-email" className="sr-only">Email address</label><input id="newsletter-email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="YOUR EMAIL ADDRESS" className="min-w-0 flex-1 border border-black/20 bg-transparent px-3 py-3 font-mono text-[11px] outline-offset-2 focus:border-black" /><button className="bg-[#0E0E0E] px-4 py-3 text-xs text-white" type="submit">Sign me up ↗</button></form></article>
          <article className="premium-card flex flex-col justify-between"><div><p className="taxonomy-label">MORE ROOM / GREEN SWAP PRO</p><h2 className="mt-3 font-serif text-3xl">Keep exploring.</h2><p className="mt-2 text-sm leading-6 text-black/60">Free includes up to seven saved swaps. Pro is a pricing preview; checkout is not yet active.</p></div><Link to="/pro" className="mt-5 inline-flex w-fit rounded-full bg-[#0E0E0E] px-5 py-3 text-sm text-white">Compare plans →</Link></article>
        </section>
      </div>
      {toast && <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 border border-black/20 bg-[#F7F5F0] px-5 py-3 text-sm shadow-sm">{toast}</div>}
      <footer className="border-t border-black/10 px-5 py-7 sm:px-10 lg:px-[8%]"><div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-4"><div><Link to="/" className="font-serif text-2xl">GreenSwap.</Link><p className="mt-2 max-w-md text-sm text-black/60">Built to make a lighter footprint. Keep the good life.</p></div><p className="font-mono text-[9px] uppercase tracking-widest text-black/45">No tracking, just math. · 2026</p></div></footer>
    </main>
  );
}
export default DashboardPage;
