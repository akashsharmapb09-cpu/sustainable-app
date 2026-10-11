import Link from 'next/link';
import { ArrowUpRight, Leaf } from 'lucide-react';
import { NavbarLinks } from './NavbarLinks';
import { AvatarDropdown } from './AvatarDropdown';

export function Navbar() {
  return <header className="sticky top-0 z-50 h-[68px] border-b border-gray-100 bg-white/70 backdrop-blur-xl">
    <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
      <Link href="/" className="group inline-flex shrink-0 items-center gap-2.5" aria-label="GreenSwap home">
        <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-moss-dark text-white shadow-sm"><Leaf size={17} strokeWidth={1.9} /><span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400 motion-safe:animate-pulse" /></span>
        <span className="font-serif text-[22px] tracking-[-.045em] text-ink">GreenSwap<span className="text-moss">.</span></span>
      </Link>
      <NavbarLinks />
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Link href="/dashboard/explore" className="hidden items-center gap-1.5 rounded-full border border-line px-3.5 py-2.5 text-xs font-semibold text-ink transition hover:border-moss/30 hover:bg-white lg:inline-flex">Go to dashboard <ArrowUpRight size={14} /></Link>
        <AvatarDropdown />
      </div>
    </div>
  </header>;
}
