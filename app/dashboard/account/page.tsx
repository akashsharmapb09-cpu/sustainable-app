import Breadcrumb from "@/components/ui/Breadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import { Flame, Leaf, Medal, TrendingDown } from "lucide-react";
import { getDemoProgress } from "@/lib/demo-session";

export const metadata = { title: "My account" };

export default async function AccountPage() {
  const progress = await getDemoProgress();
  const stats = [
    { label: "Green Points", value: String(progress.points), icon: Medal },
    { label: "Swaps completed", value: String(progress.completed.length), icon: Leaf },
    { label: "Estimated impact", value: progress.estimatedMonthlyKg.toFixed(1) + " kg", icon: TrendingDown },
    { label: "Categories tried", value: String(progress.categoriesTried), icon: Flame },
  ];

  return (
    <>
      <Breadcrumb />
      <PageHeader title="Your greener story." description="A clear view of the swaps you have marked as tried in this demo." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="rounded-2xl border border-line bg-white p-5">
              <Icon size={19} className="text-forest" aria-hidden="true" />
              <p className="mt-5 text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
            </article>
          );
        })}
      </div>
      <section className="mt-7 max-w-3xl rounded-3xl border border-line bg-white p-6 sm:p-8" aria-labelledby="profile-title">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-700 to-emerald-400 text-lg font-bold text-white" aria-hidden="true">G</span>
          <div className="min-w-0 flex-1">
            <h2 id="profile-title" className="text-lg font-semibold">Green Member</h2>
            <p className="mt-1 break-words text-sm text-gray-500">hello@greenswap.eco · demo profile</p>
          </div>
          <span className="rounded-full bg-mint px-3 py-1.5 text-xs font-semibold text-forest">Field explorer</span>
        </div>
        <div className="mt-7 border-t border-line pt-5">
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <span className="font-medium">Next demo milestone</span>
            <span className="text-gray-500">{progress.points} / 200 points</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100" role="progressbar" aria-valuemin={0} aria-valuemax={200} aria-valuenow={Math.min(progress.points, 200)} aria-label="Progress toward the next demo milestone">
            <div className="h-full rounded-full bg-forest transition-all" style={{ width: Math.min(progress.points / 200 * 100, 100) + "%" }} />
          </div>
          <p className="mt-3 text-xs leading-5 text-gray-500">Points and impact figures are demo estimates stored in this browser, not an independently verified account record.</p>
        </div>
      </section>
    </>
  );
}
