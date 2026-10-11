"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { publicLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function PrimaryNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
      {publicLinks.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm transition-colors",
              active ? "font-medium text-ink" : "text-gray-500 hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId="public-nav-active"
                className="absolute inset-0 -z-10 rounded-full bg-gray-100"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
