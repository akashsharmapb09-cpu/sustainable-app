import Link from 'next/link';
import { Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { startDemoSession } from '@/app/actions';

export const metadata = { title: 'Enter the GreenSwap demo', description: 'Open the GreenSwap demo workspace.' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const submittedNext = params.next ?? '/dashboard/explore';
  const next = submittedNext.startsWith('/dashboard/') && !submittedNext.startsWith('//') ? submittedNext : '/dashboard/explore';

  return <main className="grid min-h-screen bg-paper lg:grid-cols-2">
    <section className="relative hidden overflow-hidden bg-moss-dark p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <Link href="/" className="inline-flex items-center gap-2 font-serif text-2xl"><Leaf size={22} />GreenSwap.</Link>
      <div className="max-w-xl"><p className="eyebrow text-emerald-200">FIELD GUIDE / DEMO ACCESS</p><h1 className="mt-5 font-serif text-6xl leading-[.97] tracking-editorial">Make room for better habits.</h1><p className="mt-6 max-w-md text-sm leading-7 text-white/70">Try the product flow with a demo profile. Swaps, points and settings stay in secure, HTTP-only demo cookies in this browser.</p></div>
      <p className="font-mono text-[10px] text-white/50">DEMO MODE · NO REAL ACCOUNT AUTHENTICATION</p>
      <div aria-hidden="true" className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full border border-white/10"><div className="absolute inset-10 rounded-full border border-white/10"><div className="absolute inset-10 rounded-full border border-white/10" /></div></div>
    </section>
    <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8"><div className="w-full max-w-md">
      <Link href="/" className="mb-12 inline-flex items-center gap-2 font-serif text-2xl lg:hidden"><Leaf size={22} className="text-moss" />GreenSwap.</Link>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#edf3e9] text-moss"><Sparkles size={22} /></span><p className="eyebrow mt-7">WELCOME / DEMO WORKSPACE</p><h2 className="mt-3 font-serif text-4xl tracking-editorial">Good to have you here.</h2><p className="mt-3 text-sm leading-6 text-muted">Continue with the demo profile to explore swaps, record an activity and see the points flow.</p>
      <form action={startDemoSession} className="mt-8 space-y-4"><input type="hidden" name="next" value={next} /><button type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-moss-dark">Enter demo workspace <span aria-hidden="true">→</span></button></form>
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-line bg-white p-4"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-moss" /><p className="text-xs leading-5 text-muted">This is a mock session, not real authentication. Don’t use real personal information. Production accounts require a configured identity provider.</p></div>
      <p className="mt-8 text-center text-xs text-muted">New here? <Link href="/explore" className="font-semibold text-moss underline underline-offset-4">Browse public swaps</Link></p>
    </div></section>
  </main>;
}
