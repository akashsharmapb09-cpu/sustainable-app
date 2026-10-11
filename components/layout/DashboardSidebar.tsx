"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, ArrowUpRight, Compass, Crown, LayoutGrid, LogOut, Settings, UserRound, Leaf } from "lucide-react";
import { dashboardLinks } from "@/lib/navigation";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const icons = { compass: Compass, layout: LayoutGrid, activity: Activity, user: UserRound, settings: Settings };

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    document.cookie = "greenswap-session=; Path=/; Max-Age=0; SameSite=Lax";
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-gray-100 bg-[#fcfcfc] px-4 py-5">
      <Link href="/" className="mb-7 flex items-center gap-2 px-2 text-lg font-semibold tracking-[-.04em]"><span className="grid h-8 w-8 place-items-center rounded-xl bg-forest-700 text-white"><Leaf size={16}/></span>GreenSwap<span className="text-forest-600">.</span></Link>
      <div className="mb-7 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-green-600 to-emerald-400 text-sm font-semibold text-white">G</span>
        <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">GreenSwap Member</span><span className="mt-0.5 block truncate text-xs text-gray-500">hello@greenswap.app</span></span>
        <Badge tone="green" className="px-2">120</Badge>
      </div>

      <nav aria-label="Dashboard sidebar" className="flex-1 space-y-6">
        {dashboardLinks.map(section=><div key={section.section}>
          <h2 className="mb-2 px-3 text-[10px] font-semibold tracking-[.18em] text-gray-400">{section.section}</h2>
          <ul className="space-y-1">{section.items.map(item=>{
            const Icon = icons[item.icon];
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
            return <li key={item.href}><Link href={item.href} className={cn("flex min-h-10 items-center gap-3 rounded-full px-3 text-[13px] font-medium transition duration-150",active?"bg-black text-white shadow-sm":"text-gray-500 hover:bg-gray-100 hover:text-black")}><Icon size={16}/><span className="flex-1">{item.label}</span>{"badge" in item && item.badge ? <span className={cn("rounded-full px-2 py-0.5 text-[10px]",active?"bg-white/15 text-white":"bg-forest-50 text-forest-700")}>{item.badge}</span>:null}</Link></li>
          })}</ul>
        </div>)}
      </nav>

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-forest-900 to-[#22583a] p-4 text-white">
        <div className="flex items-center gap-2 text-sm font-semibold"><Crown size={15} className="text-emerald-300"/>GreenSwap Pro</div>
        <p className="mt-2 text-xs leading-5 text-white/65">More room to track your everyday wins.</p>
        <Link href="/dashboard/account" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200 hover:text-white">Explore benefits <ArrowUpRight size={13}/></Link>
      </div>
      <button onClick={logout} className="mt-4 flex h-10 items-center gap-3 rounded-full px-3 text-sm text-gray-500 transition hover:bg-red-50 hover:text-red-600"><LogOut size={16}/>Log out</button>
    </aside>
  );
}
