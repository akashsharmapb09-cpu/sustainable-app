'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, LayoutGrid, Recycle, Settings, UserRound } from 'lucide-react';

const sections = [
  { title: 'MAIN', links: [{ href: '/dashboard/explore', label: 'Explore Swaps', icon: Recycle }, { href: '/dashboard/catalogue', label: 'Catalogue', icon: LayoutGrid }] },
  { title: 'TRACK', links: [{ href: '/dashboard/activity', label: 'My Activity', icon: Activity, badge: '3 new' }] },
  { title: 'ACCOUNT', links: [{ href: '/dashboard/account', label: 'My Account', icon: UserRound }, { href: '/dashboard/settings', label: 'Settings', icon: Settings }] },
];

export function DashboardSidebarNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  if (mobile) return <nav aria-label="Dashboard mobile navigation" className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
    {sections.flatMap((section) => section.links).map((item) => {
      const Icon = item.icon;
      const active = pathname === item.href || pathname.startsWith(item.href + '/');
      return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-3.5 text-xs font-semibold transition ' + (active ? 'bg-ink text-white' : 'border border-line bg-white text-muted hover:text-ink')}><Icon size={14} />{item.label}</Link>;
    })}
  </nav>;

  return <nav aria-label="Dashboard sidebar" className="space-y-6">
    {sections.map((section) => <div key={section.title}><p className="mb-2.5 px-3 font-mono text-[9px] font-semibold tracking-[.16em] text-[#9aa29a]">{section.title}</p><div className="space-y-1">
      {section.links.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={'group flex min-h-11 items-center gap-3 rounded-full px-3.5 text-[13px] font-medium transition ' + (active ? 'bg-ink text-white' : 'text-gray-500 hover:bg-[#f1f2ee] hover:text-black')}><Icon size={17} strokeWidth={1.8} /><span className="flex-1">{item.label}</span>{'badge' in item && item.badge && <span className={'rounded-full px-2 py-1 text-[9px] font-semibold ' + (active ? 'bg-white/15 text-white' : 'bg-[#f0f4ed] text-moss')}>{item.badge}</span>}</Link>;
      })}
    </div></div>)}
  </nav>;
}
