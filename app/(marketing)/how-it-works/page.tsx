import Link from 'next/link';
import { ArrowRight, BookOpenCheck, Compass, Footprints, Gauge, ShieldCheck } from 'lucide-react';

export const metadata = { title: 'How GreenSwap works', description: 'Explore, choose, record and learn with clear context for sustainable swaps.' };

const steps = [
  { n: '01', icon: Compass, title: 'Explore ideas', copy: 'Browse actions across food, transport, home, shopping and waste. Start with the routines you already have.' },
  { n: '02', icon: BookOpenCheck, title: 'Understand the context', copy: 'Read the assumptions and source notes. Environmental outcomes vary, so we avoid promising personal savings from a headline figure.' },
  { n: '03', icon: Footprints, title: 'Record one swap', copy: 'Choose an action, record it in the demo and see it appear in your activity timeline.' },
  { n: '04', icon: Gauge, title: 'Build a repeatable habit', copy: 'Use demo points as a light touch to keep moving, not as proof of a verified environmental result.' },
];

export default function HowItWorksPage() {
  return <section className="container-shell py-12 sm:py-16 lg:py-20">
    <p className="eyebrow">THE METHOD / FOUR SIMPLE STEPS</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[.98] tracking-editorial sm:text-6xl lg:text-7xl">Useful guidance, without the guilt.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted">GreenSwap is designed to make the next good move easier to see and easier to repeat.</p>
    <div className="mt-12 grid gap-4 md:grid-cols-2">{steps.map((step) => { const Icon = step.icon; return <article className="card-edge p-6 sm:p-8" key={step.n}><div className="flex items-center justify-between"><span className="eyebrow">{step.n} / THE JOURNEY</span><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eef4ea] text-moss"><Icon size={20} /></span></div><h2 className="mt-7 font-serif text-3xl tracking-tight">{step.title}</h2><p className="mt-3 max-w-lg text-sm leading-7 text-muted">{step.copy}</p></article>; })}</div>
    <div className="mt-8 flex flex-wrap items-center gap-3 rounded-3xl bg-moss-dark p-6 text-white sm:p-8"><ShieldCheck size={24} className="shrink-0 text-emerald-200" /><p className="min-w-0 flex-1 text-sm leading-6 text-white/80">A note on accuracy: demo points are illustrative, and the “0.7t saved” artwork is explicitly an example, not a personal measurement.</p><Link href="/methodology" className="inline-flex items-center gap-1.5 text-sm font-semibold">Read methodology <ArrowRight size={15} /></Link></div>
    <Link href="/dashboard/explore" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-moss-dark">Try the demo journey <ArrowRight size={15} /></Link>
  </section>;
}
