import Link from 'next/link';
import { ArrowUpRight, Leaf, Instagram, Linkedin, Twitter } from 'lucide-react';
import { subscribeNewsletter } from '@/app/actions';

const columns = [
  { title: 'Product', links: [{ label: 'Explore Swaps', href: '/dashboard/explore' }, { label: 'Catalogue', href: '/dashboard/catalogue' }, { label: 'Rewards', href: '/rewards' }] },
  { title: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'How it works', href: '/how-it-works' }, { label: 'Impact', href: '/impact' }] },
  { title: 'Resources', links: [{ label: 'FAQ', href: '/faq' }, { label: 'Blog', href: '/blog' }, { label: 'Community', href: '/community' }] },
  { title: 'Legal', links: [{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms & Conditions', href: '/terms' }, { label: 'Cookies', href: '/cookies' }, { label: 'Sitemap', href: '/sitemap.xml' }] },
];

export function Footer() {
  return <footer className="border-t border-line bg-white">
    <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-8 gap-y-12 px-5 py-14 sm:px-8 md:grid-cols-3 lg:grid-cols-5 lg:px-10 lg:py-16">
      <div className="col-span-2 max-w-sm md:col-span-3 lg:col-span-1">
        <Link href="/" className="inline-flex items-center gap-2 font-serif text-[25px] tracking-[-.05em] text-ink"><span className="grid h-8 w-8 place-items-center rounded-xl bg-moss-dark text-white"><Leaf size={16} /></span>GreenSwap<span className="text-moss">.</span></Link>
        <p className="mt-4 max-w-xs text-sm leading-6 text-muted">A lighter footprint, without giving up the good life. Small swaps that turn better intentions into everyday practice.</p>
        <form action={subscribeNewsletter} className="mt-5 flex w-full max-w-[360px] items-center gap-2 rounded-full border border-line bg-paper p-1.5 focus-within:border-moss/50 focus-within:ring-2 focus-within:ring-moss/10">
          <label htmlFor="footer-email" className="sr-only">Email address</label><input id="footer-email" type="email" name="email" required autoComplete="email" placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs outline-none placeholder:text-muted/80" />
          <button className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moss-dark text-white transition hover:bg-moss" aria-label="Submit newsletter email"><ArrowUpRight size={16} /></button>
        </form>
        <p className="mt-2 text-[10px] leading-4 text-muted">Newsletter preview. Delivery isn’t connected, and addresses aren’t stored.</p>
      </div>
      {columns.map((column) => <div key={column.title} className="min-w-0"><h2 className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-ink">{column.title}</h2><ul className="space-y-3.5">{column.links.map((item) => <li key={item.href}><Link href={item.href} className="group flex items-center gap-1 text-[14px] text-muted transition hover:translate-x-[2px] hover:text-ink">{item.label}<ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100" /></Link></li>)}</ul></div>)}
    </div>
    <div className="border-t border-line"><div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
      <p className="font-mono text-[10px] text-muted">© 2026 GreenSwap Inc. · Data: DEFRA / CEA / EPA</p>
      <div className="flex flex-wrap items-center gap-4 text-muted"><div className="flex items-center gap-3" aria-label="Social links"><Link aria-label="GreenSwap on X" href="https://twitter.com/" target="_blank" rel="noreferrer" className="transition hover:text-ink"><Twitter size={16} /></Link><Link aria-label="GreenSwap on Instagram" href="https://instagram.com/" target="_blank" rel="noreferrer" className="transition hover:text-ink"><Instagram size={16} /></Link><Link aria-label="GreenSwap on LinkedIn" href="https://linkedin.com/" target="_blank" rel="noreferrer" className="transition hover:text-ink"><Linkedin size={16} /></Link></div><span className="hidden h-4 w-px bg-line sm:block" /><span className="inline-flex items-center gap-2 text-[11px] font-medium text-ink"><span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,.12)]" />All systems operational</span></div>
    </div></div>
  </footer>;
}
