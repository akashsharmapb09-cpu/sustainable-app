import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "A directory of GreenSwap public pages and demo areas.",
};

const sections = [
  { title: "Explore GreenSwap", links: [
    { label: "Home", href: "/" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Impact", href: "/impact" },
    { label: "Methodology & data sources", href: "/methodology" },
  ]},
  { title: "Company & resources", links: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Community", href: "/community" },
    { label: "FAQ", href: "/faq" },
    { label: "System status", href: "/status" },
  ]},
  { title: "Legal", links: [
    { label: "Privacy policy", href: "/privacy-policy" },
    { label: "Terms & conditions", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ]},
  { title: "Demo dashboard", links: [
    { label: "Explore swaps", href: "/dashboard/explore" },
    { label: "Catalogue", href: "/dashboard/catalogue" },
    { label: "My activity", href: "/dashboard/activity" },
    { label: "My account", href: "/dashboard/account" },
    { label: "Settings", href: "/dashboard/settings" },
    { label: "Rewards", href: "/dashboard/rewards" },
    { label: "Pro preview", href: "/dashboard/pro" },
  ]},
];

export default function SitemapPage() {
  return (
    <section className="container-wide py-16 sm:py-24">
      <p className="eyebrow">Find your way</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-[-.065em] sm:text-7xl">Sitemap</h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-gray-500">All public pages and the main areas in the GreenSwap demo. Dashboard links require a demo session.</p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="border-b border-line pb-3 text-sm font-semibold">{section.title}</h2>
            <ul className="mt-4 space-y-3">
              {section.links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-block text-sm text-gray-500 transition hover:translate-x-[2px] hover:text-forest">{item.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-12 border-t border-line pt-5 text-xs leading-5 text-gray-400">Machine-readable sitemap: <Link href="/sitemap.xml" className="underline underline-offset-2 hover:text-ink">/sitemap.xml</Link></p>
    </section>
  );
}
