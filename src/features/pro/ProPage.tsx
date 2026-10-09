import { Link } from 'react-router-dom';

const plans = [
  { name: 'Free', price: '$0', note: 'A useful place to begin', features: ['Personalised starter ideas', 'Save up to 7 swaps', 'A practical weekly ritual', 'Privacy-friendly by default'] },
  { name: 'Pro', price: '$9', note: 'For a deeper practice', features: ['Unlimited saved swaps', 'More tailored idea collections', 'Expanded weekly planning', 'Early access to new tools'] },
];

export function ProPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F0] px-5 py-8 text-[#0E0E0E] sm:px-10 lg:px-[8%]">
      <header className="flex items-center justify-between border-b border-black/10 pb-5">
        <Link to="/" className="font-serif text-2xl">GreenSwap<span className="text-[#b64b2c]">.</span></Link>
        <Link to="/dashboard" className="text-sm underline underline-offset-4">Back to dashboard ↗</Link>
      </header>
      <section className="mx-auto max-w-5xl py-16">
        <p className="taxonomy-label">A QUIETER WAY TO GO FURTHER / 2026</p>
        <h1 className="mt-5 max-w-3xl font-serif text-6xl leading-[.95] tracking-tight sm:text-8xl">Good habits.<br/><em>Room to grow.</em></h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-black/60">Start free. Keep what works. Go Pro when you want more room to organise your sustainable swaps.</p>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {plans.map((plan, i) => <article key={plan.name} className={`premium-card relative flex flex-col ${i === 1 ? 'border-[#0E0E0E] bg-[#efede6]' : ''}`}>
            <p className="taxonomy-label">{i === 0 ? '01 / OPEN ACCESS' : '02 / MORE ROOM'}</p>
            <h2 className="mt-5 font-serif text-4xl">{plan.name}</h2>
            <p className="mt-2 text-sm text-black/55">{plan.note}</p>
            <p className="mt-7 font-serif text-6xl">{plan.price}<span className="font-sans text-sm"> / month</span></p>
            <ul className="my-7 space-y-3 border-t border-black/10 pt-5 text-sm">{plan.features.map(feature => <li key={feature} className="flex gap-3"><span aria-hidden="true">[ ]</span>{feature}</li>)}</ul>
            {i === 0 ? <Link to="/onboarding" className="mt-auto inline-flex justify-center rounded-full border border-black/20 px-5 py-3 text-sm hover:border-black/50">Start for free →</Link> : <button type="button" disabled className="mt-auto cursor-not-allowed rounded-full bg-[#0E0E0E] px-5 py-3 text-sm text-white opacity-80" aria-label="Pro checkout coming soon">Checkout · Coming soon</button>}
          </article>)}
        </div>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-black/45">Pricing concept only. No payment is collected; checkout is not connected.</p>
      </section>
      <footer className="border-t border-black/10 py-5 text-xs text-black/55">Built to make a lighter footprint. Keep the good life. — No tracking, just math.</footer>
    </main>
  );
}
export default ProPage;
