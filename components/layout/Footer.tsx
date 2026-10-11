import Link from 'next/link';
import { ArrowUpRight, Leaf } from 'lucide-react';
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
      <div className="flex flex-wrap items-center gap-4 text-muted"><div className="flex items-center gap-3" aria-label="Social links">
        <Link aria-label="Open X" href="https://x.com/" target="_blank" rel="noreferrer" className="transition hover:text-ink"><SocialIcon name="x" /></Link>
        <Link aria-label="Open Instagram" href="https://instagram.com/" target="_blank" rel="noreferrer" className="transition hover:text-ink"><SocialIcon name="instagram" /></Link>
        <Link aria-label="Open LinkedIn" href="https://linkedin.com/" target="_blank" rel="noreferrer" className="transition hover:text-ink"><SocialIcon name="linkedin" /></Link>
      </div><span className="hidden h-4 w-px bg-line sm:block" /><span className="inline-flex items-center gap-2 text-[11px] font-medium text-ink"><span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,.12)]" />All systems operational</span></div>
    </div></div>
  </footer>;
}

function SocialIcon({ name }: { name: 'x' | 'instagram' | 'linkedin' }) {
  const paths = {
    x: <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.8L6.1 22H3l7.3-8.4L2.8 2h6.5l4.4 6.2zM17.8 20h1.7L8.2 3.9H6.4z" fill="currentColor" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.7" cy="6.5" r="1.1" fill="currentColor" /></>,
    linkedin: <><path d="M5 9.5v9.8M5 5.7v.1M10 19.3v-9.8h3v1.4c.7-1.1 1.8-1.7 3.2-1.7 2.5 0 3.8 1.6 3.8 4.3v5.8h-3v-5.2c0-1.4-.5-2.2-1.8-2.2-1.3 0-2.2 1-2.2 2.5v4.9z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="5" cy="5.8" r="1.3" fill="currentColor" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none">{paths[name]}</svg>;
}
