import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpenCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Methodology & data sources",
  description: "How GreenSwap frames impact estimates and which public sources inform the demo.",
};

const sources = [
  {
    name: "UK Department for Energy Security and Net Zero · greenhouse gas conversion factors",
    publisher: "DEFRA / DESNZ",
    description: "Official conversion-factor datasets are a reference for emissions reporting. Check the applicable year and boundary before using a factor for formal accounting.",
    href: "https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting",
  },
  {
    name: "Central Electricity Authority of India",
    publisher: "CEA",
    description: "Electricity-sector reports and grid-emissions publications provide India-specific context when estimating the emissions associated with electricity use.",
    href: "https://cea.nic.in/",
  },
  {
    name: "Greenhouse Gas Equivalencies Calculator",
    publisher: "US Environmental Protection Agency",
    description: "EPA explains common greenhouse-gas equivalencies and their assumptions. These are contextual comparisons, not a substitute for a product-level lifecycle assessment.",
    href: "https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator",
  },
  {
    name: "WRAP · resource efficiency and circular living",
    publisher: "WRAP",
    description: "Research and guidance on waste prevention, reuse, textiles, food waste and circular-economy practices can inform the context for everyday swaps.",
    href: "https://www.wrap.ngo/",
  },
];

export default function MethodologyPage() {
  return (
    <section className="container-wide py-16 sm:py-24">
      <p className="eyebrow">Sources · assumptions · limitations</p>
      <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-.065em] sm:text-7xl">Good decisions start with clear assumptions.</h1>
      <p className="mt-6 max-w-3xl text-base leading-7 text-gray-500 sm:text-lg">
        GreenSwap presents practical choices, not a formal carbon audit. The public datasets below are useful references; a citation to an organisation does not mean every displayed demo number comes directly from that source.
      </p>

      <div className="mt-9 flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <BookOpenCheck size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p><strong>Demo limitation.</strong> The impacts and point values in this version are illustrative product examples. They are not verified personal savings, and they should not be reused for reporting, procurement, or scientific claims without validating the underlying activity data, factor, year, geography and lifecycle boundary.</p>
      </div>

      <div className="mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
        {sources.map((source, index) => (
          <article key={source.name} className="surface p-6 sm:p-7">
            <p className="font-mono text-[10px] font-bold tracking-[.15em] text-gray-400">SOURCE / {String(index + 1).padStart(2, "0")}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-forest">{source.publisher}</p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">{source.name}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">{source.description}</p>
            <Link href={source.href} target="_blank" rel="noreferrer" className="focus-ring mt-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-forest transition hover:text-ink">
              Read source <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-12 max-w-3xl border-t border-line pt-6">
        <h2 className="text-xl font-semibold">How to interpret an estimate</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7 text-gray-500">
          <li>Start with the activity definition, unit, geography, year and lifecycle boundary.</li>
          <li>Multiply an appropriate factor by the activity amount and frequency; avoid mixing incompatible units.</li>
          <li>Compare the baseline and alternative using the same assumptions, and show uncertainty where material.</li>
          <li>Keep cost and CO₂e estimates separate from points. Points are a demo reward concept, not an environmental measurement.</li>
        </ol>
        <Link href="/faq" className="focus-ring mt-7 inline-flex rounded-full border border-line px-5 py-3 text-sm font-semibold transition hover:border-forest hover:text-forest">Read the FAQ</Link>
      </div>
    </section>
  );
}
