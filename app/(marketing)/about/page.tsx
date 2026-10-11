import Link from 'next/link';
import { ArrowUpRight, Compass, HandHeart, Sprout } from 'lucide-react';

export const metadata = { title: 'About GreenSwap', description: 'Why GreenSwap focuses on useful, evidence-aware sustainable habits.' };

export default function AboutPage() {
  return <section className="container-shell py-12 sm:py-16 lg:py-20"><p className="eyebrow">ABOUT / THE INTENTION</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[.98] tracking-editorial sm:text-6xl lg:text-7xl">Better choices should feel possible.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-muted">GreenSwap is a practical field guide for people who care about their footprint but still have jobs, budgets, busy weeks and a real life to live.</p>
    <div className="mt-12 grid gap-4 md:grid-cols-3">{[{icon:Compass,title:'Context over perfection',copy:'Good guidance starts with real routines, available choices and clear assumptions.'},{icon:Sprout,title:'Progress that repeats',copy:'Small actions become useful when they are realistic enough to do again.'},{icon:HandHeart,title:'Respect without guilt',copy:'We aim to invite people into changes, not shame them for the systems around them.'}].map((item) => { const Icon=item.icon; return <article key={item.title} className="card-edge p-6"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eef4ea] text-moss"><Icon size={20}/></span><h2 className="mt-5 font-serif text-2xl">{item.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{item.copy}</p></article>; })}</div>
    <div className="mt-12 max-w-3xl border-l-2 border-moss pl-6"><p className="font-serif text-2xl leading-snug sm:text-3xl">“Make the better option easier to understand, easier to try, and easier to keep.”</p><p className="mt-3 text-xs text-muted">GreenSwap product principle</p></div>
    <p className="mt-8 max-w-2xl text-sm leading-7 text-muted">GreenSwap’s current live journey is a demo: points and account settings are stored in browser cookies, while live authentication, paid rewards and email delivery are not enabled.</p><Link href="/explore" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-moss">Explore the field guide <ArrowUpRight size={15}/></Link>
  </section>;
}
