import Link from "next/link";
import { CheckCircle2, Instagram, Linkedin, Sprout } from "lucide-react";
import NewsletterForm from "@/components/layout/NewsletterForm";

const columns = [
  { title: "Product", links: [
    { label: "Explore swaps", href: "/dashboard/explore" },
    { label: "Catalogue", href: "/dashboard/catalogue" },
    { label: "Rewards", href: "/dashboard/rewards" },
  ]},
  { title: "Company", links: [
    { label: "About", href: "/about" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Impact", href: "/impact" },
  ]},
  { title: "Resources", links: [
    { label: "FAQ", href: "/faq" },
    { label: "Blog", href: "/blog" },
    { label: "Community", href: "/community" },
    { label: "Methodology", href: "/methodology" },
  ]},
  { title: "Legal", links: [
    { label: "Privacy policy", href: "/privacy-policy" },
    { label: "Terms & conditions", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
    { label: "Sitemap", href: "/sitemap" },
  ]},
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-wide py-14 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-lg font-semibold tracking-[-.04em]" aria-label="GreenSwap home">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest text-white"><Sprout size={17} aria-hidden="true" /></span>
              GreenSwap<span className="text-forest">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">The world’s first waste-to-reward network. Make better choices feel like second nature.</p>
            <NewsletterForm />
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold">{column.title}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="inline-block text-[15px] text-gray-500 transition hover:translate-x-[2px] hover:text-ink">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">© 2026 GreenSwap Inc.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link aria-label="GreenSwap on Instagram" href="https://instagram.com" className="transition hover:text-ink"><Instagram size={16} aria-hidden="true" /></Link>
            <Link aria-label="GreenSwap on LinkedIn" href="https://linkedin.com" className="transition hover:text-ink"><Linkedin size={16} aria-hidden="true" /></Link>
            <Link aria-label="GreenSwap on X" href="https://x.com" className="font-semibold transition hover:text-ink">𝕏</Link>
            <Link href="/status" className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 transition hover:border-emerald-200 hover:text-ink">
              <CheckCircle2 size={13} className="text-emerald-600" aria-hidden="true" />
              Status: All systems operational
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
