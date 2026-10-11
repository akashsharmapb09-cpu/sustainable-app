"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import { publicLinks } from "@/lib/navigation";
import { AvatarDropdown } from "@/components/layout/AvatarDropdown";
import { cn } from "@/lib/utils";

export function Navbar(){
 const pathname=usePathname();
 return <header className="sticky top-0 z-40 h-[68px] border-b border-gray-100 bg-white/75 backdrop-blur-xl"><div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
 <Link href="/" aria-label="GreenSwap home" className="group flex shrink-0 items-center gap-2.5"><span className="relative block h-8 w-8"><Image src="/favicon.svg" width={32} height={32} alt="" priority className="rounded-xl"/><span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400"/></span><span className="text-[17px] font-semibold tracking-[-.04em]">GreenSwap<span className="text-forest-600">.</span></span><span className="ml-0.5 hidden h-2 w-2 animate-pulse-dot rounded-full bg-emerald-500 sm:block"/></Link>
 <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">{publicLinks.map(item=>{const active=pathname===item.href||(item.href!=="/"&&pathname.startsWith(item.href+"/"));return <Link key={item.href} href={item.href} className={cn("relative rounded-full px-4 py-2 text-sm transition-colors",active?"font-medium text-ink":"text-gray-500 hover:text-ink")}>{active&&<motion.span layoutId="public-nav-active" className="absolute inset-0 -z-10 rounded-full bg-gray-100" transition={{type:"spring",stiffness:420,damping:32}}/>}{item.label}</Link>})}</nav>
 <div className="flex shrink-0 items-center gap-1.5 sm:gap-3"><Link href="/explore" aria-label="Browse swaps" title="Browse swaps" className="hidden h-9 items-center gap-2 rounded-full border border-gray-200 px-3 text-xs text-gray-500 transition hover:border-gray-300 hover:text-ink lg:flex"><Search size={14}/><span>Find a swap</span></Link><Link href="/dashboard/activity" aria-label="View activity and updates" title="View activity and updates" className="relative grid h-10 w-10 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-ink"><Bell size={18}/><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-emerald-500"/></Link><AvatarDropdown/></div>
 </div></header>;
}