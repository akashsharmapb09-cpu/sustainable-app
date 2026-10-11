"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navItems } from "@/lib/data";

export default function ActiveNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
      {navItems.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}
            className={"relative rounded-full px-4 py-2 text-[13px] font-medium transition " + (active ? "text-ink" : "text-gray-500 hover:text-ink")}>
            {item.label}
            {active && (
              <motion.span layoutId="public-nav-indicator" className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-forest"
                transition={{ type: "spring", stiffness: 380, damping: 32 }} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
