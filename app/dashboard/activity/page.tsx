import Link from "next/link";
import { ArrowRight, CheckCircle2, Leaf } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import { getDemoProgress } from "@/lib/demo-session";

export const metadata = { title: "My activity" };

export default async function ActivityPage() {
  const progress = await getDemoProgress();

  return (
    <>
      <Breadcrumb />
      <PageHeader
        title="Your progress, in motion."
        description="Every completed demo swap appears here, with its estimated impact and points."
      />
      <section className="max-w-3xl overflow-hidden rounded-3xl border border-line bg-white p-5 sm:p-8" aria-labelledby="activity-title">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <div>
            <p id="activity-title" className="text-sm font-semibold">Recent activity</p>
            <p className="mt-1 text-xs leading-5 text-gray-500">Saved in this demo browser. Nothing is synced to an account backend.</p>
          </div>
          <span className="rounded-full bg-mint px-3 py-1.5 text-xs font-semibold text-forest">
            {progress.points} Green Points
          </span>
        </div>

        {progress.completed.length > 0 ? (
          <ol className="divide-y divide-line">
            {progress.completed.map((swap) => (
              <li key={swap.id} className="flex min-w-0 gap-4 py-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint text-forest">
                  <CheckCircle2 size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold tracking-wider text-gray-400">COMPLETED · DEMO SESSION</p>
                  <h2 className="mt-1 text-sm font-semibold">{swap.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">{swap.description}</p>
                  <p className="mt-2 text-xs text-forest">{swap.impact} · estimate</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-forest">+{swap.points} pts</span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="py-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-paper text-forest">
              <Leaf size={22} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">Your first swap starts here.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Explore the collection and mark a swap as tried. Your choice will appear in this timeline.
            </p>
            <Link href="/dashboard/explore" className="focus-ring mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest">
              Explore swaps <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-xs text-gray-500">
          <span>{progress.completed.length} completed {progress.completed.length === 1 ? "swap" : "swaps"}</span>
          <span>{progress.estimatedMonthlyKg.toFixed(1)} kg CO₂e/month estimated impact from selected examples</span>
        </div>
      </section>
    </>
  );
}
