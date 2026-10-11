'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('GreenSwap page error', error); }, [error]);
  return <main className="grid min-h-[70vh] place-items-center px-5 py-16"><div className="max-w-lg text-center">
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-700"><AlertTriangle size={22} /></span><h1 className="mt-5 font-serif text-4xl">A small detour.</h1><p className="mt-3 text-sm leading-6 text-muted">Something interrupted this page. Your saved demo activity has not been intentionally cleared.</p>
    <div className="mt-6 flex justify-center gap-3"><button onClick={() => reset()} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Try again</button><Link href="/" className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold">Back home</Link></div>
  </div></main>;
}
