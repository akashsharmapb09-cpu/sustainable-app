"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, ChevronDown, LayoutGrid, LogOut, Recycle, Settings, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const accountItems = [
  { label: "My Account", href: "/dashboard/account", icon: UserRound },
  { label: "My Activity", href: "/dashboard/activity", icon: Activity },
  { label: "Explore Swaps", href: "/dashboard/explore", icon: Recycle },
  { label: "Catalogue", href: "/dashboard/catalogue", icon: LayoutGrid },
];

export function AvatarDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function logout() {
    document.cookie = "greenswap-session=; Path=/; Max-Age=0; SameSite=Lax";
    setOpen(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={rootRef}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(value => !value)} className="flex items-center gap-2 rounded-full p-0.5 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-green-600 to-emerald-400 text-sm font-semibold text-white shadow-lg shadow-green-600/20">G</span>
        <ChevronDown size={14} className="hidden text-gray-400 sm:block" />
      </button>
      <AnimatePresence>
        {open && <motion.div role="menu" initial={{ opacity: 0, y: 7, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: .98 }} transition={{ duration: .15, ease: "easeOut" }} className="absolute right-0 top-[calc(100%+12px)] z-50 w-[290px] origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_16px_50px_rgba(15,23,15,.15)]">
          <div className="rounded-xl bg-gray-50 px-3 py-3">
            <p className="font-semibold tracking-tight">GreenSwap Member</p>
            <p className="mt-0.5 truncate text-xs text-gray-500">hello@greenswap.app</p>
            <div className="mt-3"><Badge tone="green"><span className="mr-1">✦</span>120 Green Points</Badge></div>
          </div>
          <div className="px-1 py-2">
            {accountItems.map(item => {
              const Icon = item.icon;
              return <Link key={item.href} role="menuitem" onClick={() => setOpen(false)} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-ink"><Icon size={16} strokeWidth={1.8}/>{item.label}</Link>;
            })}
          </div>
          <div className="border-t border-gray-100 px-1 py-2">
            <Link role="menuitem" onClick={() => setOpen(false)} href="/dashboard/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-ink"><Settings size={16} strokeWidth={1.8}/>Settings</Link>
          </div>
          <div className="border-t border-gray-100 px-1 pt-2">
            <button role="menuitem" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"><LogOut size={16}/>Log out</button>
          </div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
