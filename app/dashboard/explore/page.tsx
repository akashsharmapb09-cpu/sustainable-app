import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import SwapGrid from "@/components/dashboard/SwapGrid";
import { getDemoProgress } from "@/lib/demo-session";

export const metadata: Metadata = { title: "Explore swaps" };
type SearchParams = Promise<{ q?: string | string[]; category?: string | string[] }>;

const categories = ["All", "Home", "Kitchen", "Travel", "Style"];
function first(value?: string | string[]) { return Array.isArray(value) ? value[0] ?? "" : value ?? ""; }

export default async function ExplorePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = first(params.q);
  const requestedCategory = first(params.category);
  const category = categories.includes(requestedCategory) ? requestedCategory : "All";
  const progress = await getDemoProgress();

  return (
    <>
      <Breadcrumb />
      <PageHeader title="Make a little difference." description="A hand-picked set of swaps that make everyday sustainability feel doable." />
      <SwapGrid query={query} category={category} completedIds={progress.completedIds} />
    </>
  );
}
