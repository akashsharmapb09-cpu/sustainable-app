import Breadcrumb from "@/components/ui/Breadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import { Gift, Leaf, Star } from "lucide-react";
import { getDemoProgress } from "@/lib/demo-session";

export const metadata = { title: "Rewards" };

export default async function RewardsPage() {
  const progress = await getDemoProgress();
  const rewards = [
    { title: "Green starter", cost: "50 points", icon: Leaf, description: "A badge for building your first sustainable habits." },
    { title: "Community champion", cost: "150 points", icon: Star, description: "Celebrate showing up and keeping your streak going." },
    { title: "Local goodie", cost: "300 points", icon: Gift, description: "A concept reward for future community partners." },
  ];

  return (
    <>
      <Breadcrumb />
      <PageHeader title="Good choices deserve a little joy." description="A transparent preview of the Green Points rewards concept." />
      <section className="rounded-3xl bg-ink p-7 text-white sm:p-10" aria-labelledby="rewards-balance">
        <p className="eyebrow !text-emerald-300">Demo balance</p>
        <p id="rewards-balance" className="mt-3 text-5xl font-semibold tracking-tight">{progress.points} <span className="text-lg font-normal text-white/60">points</span></p>
        <p className="mt-3 max-w-lg text-sm leading-6 text-white/60">Points are a local demo mechanic. Rewards below are examples, not redeemable offers or live partner benefits.</p>
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {rewards.map((reward) => {
          const Icon = reward.icon;
          return (
            <article key={reward.title} className="surface p-6">
              <Icon className="text-forest" size={22} aria-hidden="true" />
              <h2 className="mt-5 font-semibold">{reward.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">{reward.description}</p>
              <p className="mt-5 text-xs font-semibold text-forest">{reward.cost}</p>
            </article>
          );
        })}
      </div>
    </>
  );
}
