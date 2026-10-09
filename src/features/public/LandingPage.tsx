import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const panels = {
  routine: { label: 'YOUR ROUTINE, YOUR NEXT MOVE', title: <>Make room for<br />better habits<span>.</span></>, body: 'Practical alternatives for travel, food, energy and waste, shaped around your priorities, budget and real life.' },
  food: { label: 'FOOD / WASTE LESS', title: <>Use what you have.<br /><em>Waste less.</em></>, body: 'Plan around ingredients already in your kitchen, give leftovers a future, and shop with a short list.' },
  lowCost: { label: 'LOW COST / SMALL STEPS', title: <>Small changes.<br /><em>Real life.</em></>, body: 'Try no-cost habits first: switch off idle devices, repair before replacing, and walk when it works for your trip.' },
};

function WireGlobe() {
  return (
    <div className="wire-globe-wrap" role="img" aria-label="Minimal wireframe globe representing a more sustainable world">
      <div className="wire-globe">
        <span className="globe-latitude latitude-one" />
        <span className="globe-latitude latitude-two" />
        <span className="globe-latitude latitude-three" />
        <span className="globe-longitude longitude-one" />
        <span className="globe-longitude longitude-two" />
        <span className="globe-meridian" />
        <span className="globe-axis" />
      </div>
      <span className="globe-figure">FIG. 001 / A LIVING SYSTEM</span>
      <span className="globe-coordinate">31°38′N / 74°52′E</span>
    </div>
  );
}

export function LandingPage() {
  const [active, setActive] = useState<keyof typeof panels>('routine');
  const panel = panels[active];

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-clip bg-[#F7F5F0] text-[#0E0E0E]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 px-5 py-5 sm:px-10 lg:px-[8%]">
        <Link to="/" className="font-serif text-2xl tracking-tight" aria-label="GreenSwap home">GreenSwap<span className="text-[#b64b2c]">.</span></Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center justify-end gap-3 text-xs sm:gap-5">
          <a href="#approach" className="hover:underline">Our approach</a>
          <Link to="/explore" className="hover:underline">Explore swaps</Link>
          <Link to="/onboarding" className="rounded-full bg-[#0E0E0E] px-5 py-3 text-[#F7F5F0] hover:bg-[#333]">Start building ↗</Link>
        </nav>
      </header>

      <section className="editorial-grain mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 overflow-hidden px-5 py-14 sm:px-10 md:grid-cols-12 md:gap-6 md:py-20 lg:px-[8%]">
        <div className="min-w-0 md:col-span-7">
          <p className="taxonomy-label mb-6 flex flex-wrap items-center gap-3"><span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#315b3d]" /> EVIDENCE-AWARE · INDIA-CALIBRATED · MADE FOR REAL LIFE</p>
          <div className="mb-6 flex flex-wrap gap-2" aria-label="Choose a focus">
            {([['routine', 'Everyday routine'], ['food', 'Food waste'], ['lowCost', 'Low-cost habits']] as const).map(([key, label]) => (
              <button key={key} type="button" onClick={() => setActive(key)} aria-pressed={active === key} className={`border px-3 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315b3d] ${active === key ? 'border-[#0E0E0E] bg-[#0E0E0E] text-[#F7F5F0]' : 'border-black/15 hover:border-black/40'}`}>{label}</button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <p className="taxonomy-label">{panel.label}</p>
              <h1 className="mt-4 max-w-3xl break-words font-serif text-5xl leading-[.96] tracking-[-.045em] sm:text-6xl lg:text-[82px]">Make a lighter footprint.<span className="block font-normal">Keep the good life.</span></h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-black/75">Practical swaps backed by DEFRA, CEA, EPA data.</p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-black/60">{panel.body}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/onboarding" className="inline-flex items-center gap-4 rounded-full bg-[#0E0E0E] px-6 py-4 text-sm text-white hover:bg-[#333]">Start building <span aria-hidden="true">→</span></Link>
            <Link to="/explore" className="inline-flex items-center border border-black/15 px-6 py-4 text-sm hover:border-black/40">Explore the swaps</Link>
          </div>
          <p className="mt-8 border-t border-black/10 pt-4 text-xs text-black/55">Small steps, clear reasoning. No guilt. Just useful next moves.</p>
        </div>
        <div className="min-w-0 md:col-span-5"><WireGlobe /></div>
      </section>

      <section id="approach" className="border-y border-black/10 bg-[#efede6] px-5 py-7 sm:px-10 lg:px-[8%]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div><p className="taxonomy-label">01 / FIT</p><h2 className="mt-3 font-serif text-2xl">Your life comes first.</h2><p className="mt-2 text-sm leading-6 text-black/60">Recommendations respect your budget, routine and available effort.</p></div>
          <div><p className="taxonomy-label">02 / EVIDENCE</p><h2 className="mt-3 font-serif text-2xl">Benefits, explained.</h2><p className="mt-2 text-sm leading-6 text-black/60">Understand why an alternative can help without invented personal savings.</p></div>
          <div><p className="taxonomy-label">03 / ACTION</p><h2 className="mt-3 font-serif text-2xl">One step is enough.</h2><p className="mt-2 text-sm leading-6 text-black/60">Build a practical starting point and adjust as your life changes.</p></div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl border-t border-black/10 pt-3 font-mono text-[9px] tracking-widest text-black/45">GREEN SWAP FIELD NOTES · RECOMMENDATIONS, NOT PERSONALIZED SCIENTIFIC MEASUREMENTS</p>
      </section>
      <footer className="border-t border-black/10 px-5 py-6 sm:px-10 lg:px-[8%]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <p className="font-mono text-[10px] tracking-wide text-black/55">© 2026 GreenSwap • Data: DEFRA • No cookies</p>
          <nav aria-label="Footer links" className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <Link to="/launch" className="underline underline-offset-4">Launch kit</Link>
            <Link to="/methodology" className="underline underline-offset-4">Methodology</Link>
            <Link to="/terms" className="underline underline-offset-4">Terms</Link>
            <Link to="/privacy" className="underline underline-offset-4">Privacy</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;
