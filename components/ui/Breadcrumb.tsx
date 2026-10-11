'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const titles: Record<string, string> = { dashboard: 'Dashboard', explore: 'Explore', catalogue: 'Catalogue', activity: 'My Activity', account: 'My Account', settings: 'Settings' };

export function Breadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  const items = [{ title: 'Home', href: '/' }, ...parts.map((part, index) => ({ title: titles[part] ?? part.charAt(0).toUpperCase() + part.slice(1), href: '/' + parts.slice(0, index + 1).join('/') }))];
  return <nav aria-label="Breadcrumb" className="mb-7 flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap text-xs text-muted">
    {items.map((item, index) => <span className="inline-flex items-center gap-2" key={item.href}>
      {index > 0 && <ChevronRight aria-hidden="true" size={13} className="text-gray-300" />}
      {index === items.length - 1 ? <span aria-current="page" className="font-semibold text-ink">{index === 0 ? <Home size={13} /> : item.title}</span> : <Link href={item.href} className="transition hover:text-ink">{index === 0 ? <Home size={13} aria-label="Home" /> : item.title}</Link>}
    </span>)}
  </nav>;
}
