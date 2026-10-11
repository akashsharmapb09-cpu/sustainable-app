import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ArrowUpRight, Leaf, LogOut, Sparkles } from 'lucide-react';
import { DashboardSidebarNav } from '@/components/layout/DashboardSidebarNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies();
  if (store.get('greenswap_session')?.value !== 'demo-session-v1') redirect('/login?next=%2Fdashboard%2Fexplore');
  const pointsRaw = Number.parseInt(store.get('greenswap_points')?.value ?? '120', 10);
  const points = Number.isFinite(pointsRaw) ? pointsRaw : 120;

  return <div className="min-h-screen bg-white">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-[#eceee8] bg-[#fcfcfc] px-5 py-6 lg:flex">
      <Link href="/" className="mb-8 inline-flex items-center gap-2.5 px-2 font-serif text-[23px] tracking-editorial text-ink"><span className="grid h-8 w-8 place-items-center rounded-xl bg-moss-dark text-white"><Leaf size={16} /></span>GreenSwap<span className="text-moss">.</span></Link>
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-card"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-green-600 to-emerald-400 text-sm font-bold text-white shadow-lg shadow-green-600/15">G</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-ink">Green Member</span><span className="mt-1 block text-[11px] text-muted">Demo workspace</span></span><span className="grid h-7 w-7 place-items-center rounded-full bg-[#f0f4ed] text-moss"><Sparkles size={13} /></span></div>
      <div className="mb-5 rounded-2xl bg-moss-dark p-4 text-white"><div className="flex items-center justify-between"><span className="text-[11px] text-white/70">GREEN POINTS</span><Sparkles size={15} className="text-emerald-300" /></div><p className="mt-2 font-mono text-3xl tracking-tight">{points.toLocaleString('en-IN')}</p><p className="mt-1 text-[11px] text-white/65">Demo points · earn more with each swap</p></div>
      <DashboardSidebarNav />
      <div className="mt-auto space-y-4 pt-6"><div className="rounded-2xl border border-[#dce6d7] bg-[#f1f6ee] p-4"><div className="flex items-center gap-2 text-moss"><Sparkles size={15} /><span className="text-xs font-bold">GreenSwap Pro</span></div><p className="mt-2 text-xs leading-5 text-muted">More ways to plan, track and learn — with a clear view of what is demo-only.</p><Link href="/rewards" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-moss">Explore rewards <ArrowUpRight size={13} /></Link></div><Link href="/logout" className="flex min-h-11 items-center gap-3 rounded-full px-3.5 text-sm text-muted transition hover:bg-red-50 hover:text-red-600"><LogOut size={16} />Logout</Link><p className="px-2 font-mono text-[9px] text-[#9aa29a]">GREEN FIELD / EDITION 2026</p></div>
    </aside>
    <div className="min-h-screen min-w-0 lg:pl-[280px]"><div className="mx-auto max-w-[1440px] px-4 pb-12 pt-5 sm:px-6 sm:pt-7 lg:px-10 lg:pt-9">
      <div className="mb-5 flex items-center justify-between lg:hidden"><Link href="/" className="inline-flex items-center gap-2 font-serif text-xl"><Leaf size={20} className="text-moss" />GreenSwap.</Link><Link href="/logout" className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs text-muted"><LogOut size={14} />Logout</Link></div>
      <DashboardSidebarNav mobile />
      <Breadcrumb />{children}
    </div></div>
  </div>;
}
