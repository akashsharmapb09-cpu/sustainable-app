import Link from "next/link";
import { Plus } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export function PageHeader({ title, description, actionHref = "/dashboard/explore", actionLabel = "New Swap" }: { title: string; description: string; actionHref?: string; actionLabel?: string }) {
  return <div className="mb-8">
    <Breadcrumb/>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="min-w-0"><h1 className="text-3xl font-semibold tracking-[-.055em] sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">{description}</p></div>
      <Link href={actionHref} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-black px-4 text-sm font-semibold text-white transition hover:bg-forest-700"><Plus size={15}/>{actionLabel}</Link>
    </div>
  </div>;
}
