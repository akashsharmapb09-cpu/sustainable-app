import Link from "next/link";
import { Search, Sprout } from "lucide-react";
import ActiveNavigation from "@/components/layout/ActiveNavigation";
import AvatarMenu from "@/components/ui/AvatarMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 h-[68px] border-b border-gray-100 bg-white/75 backdrop-blur-xl">
      <div className="container-wide flex h-full items-center justify-between gap-4">
        <Link href="/" aria-label="GreenSwap home" className="focus-ring flex shrink-0 items-center gap-2.5 rounded-lg">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-forest text-white">
            <Sprout size={18} aria-hidden="true" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse-soft rounded-full border-2 border-white bg-lime-400" />
          </span>
          <span className="text-[17px] font-semibold tracking-[-.055em]">GreenSwap<span className="text-forest">.</span></span>
        </Link>
        <ActiveNavigation />
        <div className="flex items-center gap-2 sm:gap-3">
          <Link aria-label="Search swaps" href="/dashboard/explore" className="focus-ring hidden items-center gap-2 rounded-full border border-line px-3 py-2 text-xs text-gray-500 transition hover:bg-gray-50 sm:flex">
            <Search size={14} aria-hidden="true" /><span>Search</span><kbd className="rounded border border-gray-200 px-1 py-0.5 text-[10px]">⌘ K</kbd>
          </Link>
          <span aria-label="Notifications" title="Notifications" className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-line sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-400 ring-2 ring-white" />
          </span>
          <AvatarMenu points={120} />
        </div>
      </div>
    </header>
  );
}
