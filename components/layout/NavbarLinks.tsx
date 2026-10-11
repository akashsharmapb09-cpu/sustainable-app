'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const links = [{ href: '/explore', label: 'Explore' }, { href: '/catalogue', label: 'Catalogue' }, { href: '/how-it-works', label: 'How it works' }];

export function NavbarLinks() {
  const pathname = usePathname();
  return <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
    {links.map((item) => {
      const active = pathname === item.href || pathname.startsWith(item.href + '/');
      return <Link href={item.href} key={item.href} aria-current={active ? 'page' : undefined} className={'relative rounded-full px-4 py-2.5 text-[13px] transition ' + (active ? 'font-semibold text-ink' : 'text-muted hover:text-ink')}>
        {active && <motion.span layoutId="greenswap-active-nav" className="absolute inset-0 -z-0 rounded-full bg-[#eef2eb]" transition={{ type: 'spring', stiffness: 430, damping: 34 }} />}
        <span className="relative z-10">{item.label}</span>
      </Link>;
    })}
  </nav>;
}
