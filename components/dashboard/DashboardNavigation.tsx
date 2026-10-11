"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutGrid, Recycle, Settings, UserRound } from "lucide-react";

const groups = [
  { title: "MAIN", items: [
    { label: "Explore swaps", href: "/dashboard/explore", icon: Recycle },
    { label: "Catalogue", href: "/dashboard/catalogue", icon: LayoutGrid },
  ]},
  { title: "TRACK", items: [
    { label: "My activity", href: "/dashboard/activity", icon: Activity, badge: "3 new" },
  ]},
  { title: "ACCOUNT", items: [
    { label: "My account", href: "/dashboard/account", icon: UserRound },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ]},
];

export default function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard navigation" className="mt-8 flex gap-1 overflow-x-auto lg:block lg:space-y-7">
      {groups.map((group) => (
        <div key={group.title} className="min-w-max lg:min-w-0">
          <p className="mb-2 hidden px-3 text-[10px] font-bold tracking-[.16em] text-gray-400 lg:block">{group.title}</p>
          {group.items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}
                className={"flex items-center gap-3 rounded-full px-3 py-2.5 text-sm transition " + (
                  active ? "bg-black font-medium text-white" : "text-gray-500 hover:bg-gray-100 hover:text-black"
                )}>
                <Icon size={17} aria-hidden="true" /><span>{item.label}</span>
                {"badge" in item && item.badge && <span className={"ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold " + (
                  active ? "bg-white/15 text-white" : "bg-mint text-forest"
                )}>{item.badge}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
