import Link from 'next/link';
import { ArrowLeft, Leaf } from 'lucide-react';

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-paper px-5 py-16"><div className="max-w-2xl text-center">
    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-moss-dark text-white"><Leaf size={26} /></span><p className="eyebrow mt-8">404 / WRONG BIN</p><h1 className="mt-4 font-serif text-6xl leading-none tracking-editorial sm:text-8xl">Lost in waste?</h1><p className="mx-auto mt-6 max-w-lg text-base leading-7 text-muted">This page has wandered off the map. Let’s get you back to useful swaps, clear data and small changes that fit real life.</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-moss-dark"><ArrowLeft size={16} />Back home</Link><Link href="/explore" className="inline-flex min-h-12 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold hover:border-moss/40">Explore swaps</Link></div>
  </div></main>;
}
