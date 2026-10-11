import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import SwapGrid from "@/components/dashboard/SwapGrid";
import { getDemoProgress } from "@/lib/demo-session";

export const metadata: Metadata = { title: "Swap catalogue" };
type SearchParams = Promise<{ q?: string | string[]; category?: string | string[] }>;

const categories = ["All", "Home", "Kitchen", "Travel", "Style"] as const;
function first(value?: string | string[]) { return Array.isArray(value) ? value[0] ?? "" : value ?? ""; }

export default async function CataloguePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = first(params.q);
  const requestedCategory = first(params.category);
  const category = categories.find((candidate) => candidate === requestedCategory) ?? "All";
  const progress = await getDemoProgress();

  return (
    <>
      <Breadcrumb />
      <PageHeader title="The swap catalogue." description="Browse the full collection by category, estimated impact, and points." />
      <SwapGrid catalogue query={query} category={category} completedIds={progress.completedIds} />
    </>
  );
}
