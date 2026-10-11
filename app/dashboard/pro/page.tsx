import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import { ArrowRight, Check } from "lucide-react";

export const metadata = { title: "GreenSwap Pro" };

const features = [
  "More space to plan the swaps that fit your routine",
  "A clearer view of your saved demo activities",
  "Future premium features, once they are available",
];

export default function ProPage() {
  return (
    <>
      <Breadcrumb />
      <PageHeader title="More room for good habits." description="A premium experience preview. The current demo does not take payments or activate a subscription." action />
      <section className="max-w-4xl overflow-hidden rounded-3xl border border-line bg-white">
        <div className="grid md:grid-cols-[1.2fr_.8fr]">
          <div className="p-7 sm:p-10">
            <p className="eyebrow">GreenSwap Pro · Preview</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-.05em] sm:text-4xl">A calmer way to keep your momentum.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">This page shows how a paid tier could be presented. Pricing, subscriptions, billing and premium entitlements are not enabled.</p>
            <ul className="mt-7 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm leading-6">
                  <Check size={17} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />{feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between bg-paper p-7 sm:p-10">
            <div>
              <p className="text-sm font-semibold">Pro preview</p>
              <p className="mt-4 text-4xl font-semibold tracking-tight">Coming later</p>
              <p className="mt-2 text-sm leading-6 text-gray-500">No charge · no payment details requested</p>
            </div>
            <Link href="/dashboard/rewards" className="focus-ring mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest">
              Explore demo rewards <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
