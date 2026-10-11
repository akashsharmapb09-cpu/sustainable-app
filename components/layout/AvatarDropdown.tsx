'use client';

import type { ReactNode } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { Activity, ChevronDown, LayoutGrid, LogOut, Recycle, Settings, UserRound, BellDot } from 'lucide-react';

export function AvatarDropdown() {
  return <div className="flex items-center gap-2">
    <span className="relative grid h-10 w-10 place-items-center rounded-full text-muted" aria-label="Notifications: three updates" title="Three updates">
      <BellDot size={19} strokeWidth={1.7} /><span className="absolute right-[7px] top-[6px] h-2 w-2 rounded-full bg-clay ring-2 ring-white" />
    </span>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild><button className="group flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-moss" aria-label="Open user menu">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-green-600 to-emerald-400 text-sm font-bold text-white shadow-lg shadow-green-600/20">G</span>
        <ChevronDown size={14} className="hidden text-muted transition group-data-[state=open]:rotate-180 sm:block" />
      </button></DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={10} align="end" className="z-[100] w-[288px] rounded-2xl border border-line bg-white p-2 shadow-[0_18px_60px_rgba(23,36,27,.16)] data-[state=open]:animate-[dropdown-in_150ms_ease-out]">
          <div className="px-3 pb-3 pt-2"><p className="text-sm font-semibold text-ink">GreenSwap Member</p><p className="mt-1 text-xs text-muted">demo@greenswap.app</p><span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#eff6ee] px-2.5 py-1 text-[11px] font-semibold text-moss"><span className="h-1.5 w-1.5 rounded-full bg-moss" />120 Green Points <span className="ml-1 text-[9px] uppercase tracking-wider text-moss/70">Demo</span></span></div>
          <DropdownMenu.Separator className="my-1 h-px bg-line" />
          <div className="p-1">
            <MenuLink href="/dashboard/account" icon={<UserRound size={16} />}>My Account</MenuLink>
            <MenuLink href="/dashboard/activity" icon={<Activity size={16} />}>My Activity</MenuLink>
            <MenuLink href="/dashboard/explore" icon={<Recycle size={16} />}>Explore Swaps</MenuLink>
            <MenuLink href="/dashboard/catalogue" icon={<LayoutGrid size={16} />}>Catalogue</MenuLink>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-line" />
          <div className="p-1"><MenuLink href="/dashboard/settings" icon={<Settings size={16} />}>Settings</MenuLink></div>
          <DropdownMenu.Separator className="my-1 h-px bg-line" />
          <DropdownMenu.Item asChild><Link href="/logout" className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 outline-none transition hover:bg-red-50 focus:bg-red-50"><LogOut size={16} />Logout</Link></DropdownMenu.Item>
          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </div>;
}

function MenuLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  return <DropdownMenu.Item asChild><Link href={href} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink outline-none transition hover:bg-paper focus:bg-paper"><span className="text-muted">{icon}</span>{children}</Link></DropdownMenu.Item>;
}
