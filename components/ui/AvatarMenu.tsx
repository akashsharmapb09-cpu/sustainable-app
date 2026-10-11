"use client";

import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Activity, ChevronDown, LayoutGrid, LogOut, Recycle, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutDemo } from "@/app/actions";

const links = [
  { label: "My account", href: "/dashboard/account", icon: UserRound },
  { label: "My activity", href: "/dashboard/activity", icon: Activity },
  { label: "Explore swaps", href: "/dashboard/explore", icon: Recycle },
  { label: "Catalogue", href: "/dashboard/catalogue", icon: LayoutGrid },
];

export default function AvatarMenu({ points = 120 }: { points?: number }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button type="button" aria-label="Open account menu" aria-haspopup="menu" className="focus-ring flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-gray-100">
          <Avatar className="h-10 w-10 border-0 bg-gradient-to-br from-green-700 to-emerald-400 text-sm font-bold text-white shadow-lg shadow-green-700/20">
            <AvatarFallback className="bg-transparent text-white">G</AvatarFallback>
          </Avatar>
          <ChevronDown size={14} className="text-gray-500" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={12} collisionPadding={12} className="avatar-menu z-50 w-72 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-soft">
          <DropdownMenu.Label className="rounded-xl bg-paper px-3 py-3 font-normal">
            <span className="block text-sm font-semibold text-ink">Green Member</span>
            <span className="mt-0.5 block text-xs text-gray-500">hello@greenswap.eco · demo account</span>
            <span className="mt-3 inline-flex rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-forest">✳ {points} Green Points</span>
          </DropdownMenu.Label>

          <div className="py-2">
            {links.map(({ label, href, icon: Icon }) => (
              <DropdownMenu.Item key={href} asChild>
                <Link href={href} className="focus-ring flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none transition hover:bg-gray-50 hover:text-ink data-[highlighted]:bg-gray-50">
                  <Icon size={16} aria-hidden="true" />{label}
                </Link>
              </DropdownMenu.Item>
            ))}
          </div>

          <DropdownMenu.Separator className="h-px bg-line" />
          <div className="py-2">
            <DropdownMenu.Item asChild>
              <Link href="/dashboard/settings" className="focus-ring flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none transition hover:bg-gray-50 hover:text-ink">
                <Settings size={16} aria-hidden="true" />Settings
              </Link>
            </DropdownMenu.Item>
          </div>

          <DropdownMenu.Separator className="h-px bg-line" />
          <form action={logoutDemo} className="pt-2">
            <DropdownMenu.Item asChild>
              <button type="submit" className="focus-ring flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 outline-none transition hover:bg-red-50 data-[highlighted]:bg-red-50">
                <LogOut size={16} aria-hidden="true" />Log out
              </button>
            </DropdownMenu.Item>
          </form>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
