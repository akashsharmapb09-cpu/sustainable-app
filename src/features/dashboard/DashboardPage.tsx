import { Link } from 'react-router-dom';

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#1a1a1a]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-[9px] tracking-widest border border-black/20 px-2 py-1 rounded-full">EDITION 2026 / VOL. 01</span>
          <span className="font-serif font-black text-xl">GreenSwap.</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-xs sm:gap-6 sm:text-[11px] sm:tracking-widest">
          <Link to="/dashboard" className="hover:text-[#2d4a22]">Explore Catalog</Link>
          <a href="#methodology" className="hover:text-[#2d4a22]">Methodology &amp; Citations</a>
          <Link to="/profile" className="rounded-full bg-[#e8eee3] px-4 py-2 font-semibold tracking-normal text-[#2d4a22] hover:bg-[#dbe6d3]">My profile ↗</Link>
        </nav>
      </header>
      <div className="max-w-[1280px] mx-auto px-5 py-8 sm:px-8 sm:py-10 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7">
          <div className="inline-flex items-center gap-2 text-[9px] tracking-widest border border-black/10 px-3 py-1 rounded-full mb-6"><span className="w-2 h-2 bg-green-600 rounded-full"></span> PRACTICAL • PERSONAL • BUILT FOR REAL LIFE</div>
          <h1 className="font-serif text-4xl font-black leading-[0.95] tracking-tight sm:text-[56px]">Your everyday choices.<br/><span className="text-[#2d4a22] font-light italic">Your kind of change.</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-black/60 sm:text-base">Explore realistic sustainable alternatives for food, travel, energy and waste—shaped around your habits, budget and priorities.</p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link to="/profile" className="group rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#2d4a22]/40 hover:shadow-sm">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#59704d]">01 · Personalise</span><h2 className="mt-3 font-serif text-2xl font-bold">Your lifestyle profile</h2><p className="mt-2 text-sm leading-6 text-black/60">Set your travel habits, diet, budget, food waste and interests so suggestions fit you.</p><span className="mt-4 inline-block text-sm font-semibold text-[#2d4a22]">Edit preferences →</span>
            </Link>
            <div className="rounded-2xl border border-black/10 bg-[#e8eee3] p-5"><span className="text-xs font-bold uppercase tracking-[0.15em] text-[#59704d]">02 · Start small</span><h2 className="mt-3 font-serif text-2xl font-bold">A more useful next step</h2><p className="mt-2 text-sm leading-6 text-black/65">Pick one change that suits your week—like planning leftovers, switching off idle devices or repairing before replacing.</p><Link to="/profile" className="mt-4 inline-block text-sm font-semibold text-[#2d4a22]">Tune your recommendations →</Link></div>
          </div>
          <section id="methodology" className="mt-10 border-t border-black/10 pt-6"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#59704d]">How recommendations work</p><h2 className="mt-2 font-serif text-2xl font-bold">Fit first. Perfection never.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">GreenSwap prioritises options that match your stated budget, effort level and interests. Environmental benefits are explained in plain language, without promising unsupported savings.</p></section>
        </div>
        <aside className="col-span-12 lg:col-span-5"><div className="rounded-[24px] border border-black/10 bg-[#f4f1eb] p-6 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#59704d]">Field note · 01</p><h2 className="mt-2 font-serif text-2xl font-bold">Try this this week</h2></div><span aria-hidden="true" className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#a8c69f] to-[#2d4a22] text-2xl">✳</span></div><div className="mt-6 rounded-xl border border-black/10 bg-white p-5"><span className="rounded-full bg-[#e8eee3] px-3 py-1 text-xs font-semibold text-[#2d4a22]">Food · No-cost</span><h3 className="mt-4 font-serif text-xl font-bold">Give leftovers a plan</h3><p className="mt-2 text-sm leading-6 text-black/60">Before shopping, check the fridge and plan one meal around food you already have. Store leftovers clearly and freeze what you will not eat in time.</p><p className="mt-4 border-t border-black/10 pt-4 text-sm leading-6"><strong>Why it helps:</strong> Preventing edible food from being discarded also avoids wasting the water, energy and resources used to produce it.</p></div><Link to="/profile" className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#2d4a22] px-5 py-3 text-sm font-semibold text-white hover:bg-[#203619]">Personalise my suggestions →</Link></div></aside>
      </div>
    </div>
  );
}
export default DashboardPage;
