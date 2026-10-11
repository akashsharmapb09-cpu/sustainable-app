"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  explore: "Explore",
  catalogue: "Catalogue",
  activity: "My Activity",
  account: "My Account",
  settings: "Settings",
  faq: "FAQ",
  "how-it-works": "How it works",
  "privacy": "Privacy",
  "terms": "Terms",
  "cookies": "Cookies",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: "Home", href: "/" }, ...parts.map((part, index) => ({
    label: labels[part] ?? part.replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase()),
    href: "/" + parts.slice(0, index + 1).join("/"),
  }))];

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex min-w-0 items-center gap-2 overflow-hidden text-xs text-muted">
      {crumbs.map((crumb, index) => (
        <span className="flex min-w-0 items-center gap-2" key={crumb.href}>
          {index > 0 && <ChevronRight size={13} aria-hidden="true" />}
          {index === 0 ? <Home size={13} aria-hidden="true" /> : null}
          {index === crumbs.length - 1
            ? <span aria-current="page" className="truncate font-medium text-ink">{crumb.label}</span>
            : <Link href={crumb.href} className="truncate transition hover:text-ink">{crumb.label}</Link>}
        </span>
      ))}
    </nav>
  );
}
