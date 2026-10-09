import { Link } from 'react-router-dom';

const shots = [
  { src: '/launch-home.jpg', alt: 'GreenSwap home page with the main headline and routine preview', title: '01 / HOME', description: 'A clear starting point for practical everyday swaps.' },
  { src: '/launch-explore.jpg', alt: 'GreenSwap alternative catalog with category filters and recommendation cards', title: '02 / EXPLORE', description: 'Browse transport, food, energy, waste and shopping alternatives.' },
  { src: '/launch-methodology.jpg', alt: 'GreenSwap methodology view with cited environmental data sources', title: '03 / METHODOLOGY', description: 'See the sources behind the guidance and estimates.' },
];

export function LaunchPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7F5F0] text-[#0E0E0E]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 px-5 py-5 sm:px-8 lg:px-[8%]">
        <Link to="/" className="inline-flex min-w-0 items-center gap-3" aria-label="GreenSwap home">
          <img src="/favicon.svg" alt="" width="38" height="38" className="h-9 w-9 shrink-0" />
          <span className="font-serif text-2xl">GreenSwap<span className="text-[#b64b2c]">.</span></span>
        </Link>
        <nav aria-label="Launch navigation" className="flex flex-wrap items-center justify-end gap-3 text-xs sm:gap-5">
          <Link to="/" className="underline underline-offset-4">Live site</Link>
          <Link to="/explore" className="underline underline-offset-4">Explore swaps</Link>
          <Link to="/onboarding" className="bg-[#173a29] px-4 py-3 text-white">Start building ↗</Link>
        </nav>
      </header>
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_.9fr] lg:px-12">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-black/55">GREENSWAP / LAUNCH KIT 2026</p>
          <h1 className="mt-5 max-w-3xl break-words font-serif text-5xl leading-[.96] tracking-[-.045em] sm:text-6xl lg:text-7xl">Make a lighter footprint.<span className="block">Keep the good life.</span></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-black/70">Sustainable living made simple: practical swaps for food, travel, energy and reuse that fit real life.</p>
          <p className="mt-4 text-sm leading-6 text-black/55">Practical swaps backed by DEFRA, CEA, EPA data.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="bg-[#173a29] px-5 py-3 text-sm text-white">Open GreenSwap ↗</Link>
            <Link to="/methodology" className="border border-black/20 px-5 py-3 text-sm">See the sources</Link>
          </div>
          <div className="mt-10 border-t border-black/15 pt-5"><p className="font-mono text-xs tracking-wide text-black/60">© 2026 GreenSwap • Data: DEFRA • No cookies</p></div>
        </div>
        <a href="/og-image.png" className="block min-w-0" aria-label="Open the GreenSwap social share image">
          <img src="/og-image.png" alt="GreenSwap social image reading 0.7t saved, labelled as an illustrative example rather than a personal result" className="w-full border border-black/10" width="1200" height="630" />
          <span className="mt-2 block font-mono text-[10px] uppercase tracking-widest text-black/50">SOCIAL PREVIEW / 1200 × 630</span>
        </a>
      </section>
      <section className="border-y border-black/10 bg-[#efede6] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-black/55">PRODUCT SCREENS</p><h2 className="mt-2 font-serif text-4xl">A look around GreenSwap.</h2></div>
            <p className="max-w-sm text-sm leading-6 text-black/60">Three views of the product, from first impression to catalog and source notes.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {shots.map(shot => (
              <article key={shot.src} className="min-w-0 border border-black/10 bg-[#F7F5F0] p-3">
                <img src={shot.src} alt={shot.alt} width="640" height="310" loading="lazy" className="block aspect-[640/310] w-full object-cover" />
                <div className="px-2 pb-2 pt-4"><p className="font-mono text-[10px] tracking-widest text-black/50">{shot.title}</p><p className="mt-2 text-sm leading-6 text-black/65">{shot.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <footer className="px-5 py-7 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><p className="font-mono text-[10px] tracking-wide text-black/55">© 2026 GreenSwap • Data: DEFRA • No cookies</p><nav aria-label="Launch footer" className="flex flex-wrap gap-x-5 gap-y-3 text-xs"><Link to="/terms" className="underline underline-offset-4">Terms</Link><Link to="/privacy" className="underline underline-offset-4">Privacy</Link><Link to="/cookies" className="underline underline-offset-4">Cookies</Link></nav></div></footer>
    </main>
  );
}
export default LaunchPage;
