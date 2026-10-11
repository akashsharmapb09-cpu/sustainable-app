import Link from "next/link";
import { ArrowUpRight, Leaf, LogOut } from "lucide-react";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import { logoutDemo } from "@/app/actions";

export default function Sidebar({ points = 120 }: { points?: number }) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-line bg-[#fcfcfc] px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-[280px] lg:border-b-0 lg:border-r lg:px-5">
      <Link href="/" className="flex items-center gap-2.5 px-2" aria-label="GreenSwap home">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest text-white"><Leaf size={17} aria-hidden="true" /></span>
        <span className="text-base font-semibold tracking-[-.05em]">GreenSwap<span className="text-forest">.</span></span>
      </Link>
      <div className="mt-7 flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-700 to-emerald-400 font-bold text-white" aria-hidden="true">G</span>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">Green Member</p><p className="mt-0.5 text-xs text-gray-500">{points} Green Points</p></div>
        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-label="Demo session active" />
      </div>

      <DashboardNavigation />

      <div className="mt-5 hidden rounded-2xl bg-ink p-4 text-white lg:mt-auto lg:block">
        <div className="flex items-center justify-between"><span className="text-xs font-semibold">A little more room</span><ArrowUpRight size={15} aria-hidden="true" /></div>
        <p className="mt-2 text-xs leading-5 text-white/60">Explore more insights and make your good habits count.</p>
        <Link href="/dashboard/pro" className="mt-4 inline-flex rounded-full bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:bg-mint">Upgrade to Pro</Link>
      </div>
      <div className="mt-4 hidden border-t border-line pt-4 lg:block">
        <form action={logoutDemo}>
          <button type="submit" className="focus-ring flex w-full items-center gap-3 rounded-full px-3 py-2 text-left text-sm text-gray-500 transition hover:bg-red-50 hover:text-red-600">
            <LogOut size={16} aria-hidden="true" />Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
