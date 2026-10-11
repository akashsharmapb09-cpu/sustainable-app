import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Search } from "lucide-react";
import { setSwapCompletion } from "@/app/actions";
import { swaps } from "@/lib/data";

const categories = ["All", "Home", "Kitchen", "Travel", "Style"] as const;
type Category = (typeof categories)[number];

function getFilteredItems(query: string, category: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return swaps.filter((swap) => (
    (category === "All" || swap.category === category)
    && (swap.title + " " + swap.description + " " + swap.category).toLowerCase().includes(normalizedQuery)
  ));
}

export default function SwapGrid({
  catalogue = false,
  query = "",
  category = "All",
  completedIds = [],
}: {
  catalogue?: boolean;
  query?: string;
  category?: Category;
  completedIds?: string[];
}) {
  const items = getFilteredItems(query, category);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <form action={catalogue ? "/dashboard/catalogue" : "/dashboard/explore"} method="get" className="focus-within:border-forest flex min-w-0 flex-1 items-center gap-2 rounded-full border border-line px-4 py-3 transition">
          <Search size={16} className="shrink-0 text-gray-400" aria-hidden="true" />
          <label htmlFor="swap-search" className="sr-only">Search swaps</label>
          <input id="swap-search" name="q" type="search" defaultValue={query} placeholder="Search a better way…" className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-400" />
          <input type="hidden" name="category" value={category} />
          <button type="submit" className="rounded-full px-2 py-1 text-xs font-semibold text-forest transition hover:bg-mint">Search</button>
        </form>
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-1" aria-label="Filter swaps by category">
          {categories.map((item) => (
            <form key={item} action={catalogue ? "/dashboard/catalogue" : "/dashboard/explore"} method="get">
              <input type="hidden" name="q" value={query} />
              <button type="submit" name="category" value={item} aria-pressed={category === item} className={"shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition " + (
                category === item ? "bg-ink text-white" : "border border-line text-gray-500 hover:bg-gray-50 hover:text-ink"
              )}>
                {item}
              </button>
            </form>
          ))}
        </div>
      </div>

      {catalogue ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="grid grid-cols-[minmax(0,1fr)_62px_36px] gap-2 bg-paper px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:grid-cols-[minmax(0,1fr)_90px_130px_72px] sm:gap-4 sm:px-5">
            <span>Swap</span><span>Type</span><span className="hidden sm:block">Monthly estimate</span><span className="sr-only sm:not-sr-only">Status</span>
          </div>
          {items.map((swap) => {
            const completed = completedIds.includes(swap.id);
            return (
              <div key={swap.id} className="grid grid-cols-[minmax(0,1fr)_62px_36px] items-center gap-2 border-t border-line px-3 py-4 text-xs sm:grid-cols-[minmax(0,1fr)_90px_130px_72px] sm:gap-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-paper">
                    <Image src={swap.image} alt="" fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{swap.title}</p>
                    <p className="mt-1 truncate text-gray-400">{swap.cost} · {swap.points} pts</p>
                  </div>
                </div>
                <span className="truncate text-gray-500">{swap.category}</span>
                <span className="hidden text-forest sm:block">{swap.impact}</span>
                <form action={setSwapCompletion}>
                  <input type="hidden" name="swapId" value={swap.id} />
                  <input type="hidden" name="completed" value={completed ? "0" : "1"} />
                  <button type="submit" aria-label={(completed ? "Undo " : "Mark as tried: ") + swap.title} className={"flex h-8 w-8 items-center justify-center rounded-full transition focus-ring " + (
                    completed ? "bg-forest text-white" : "border border-line text-gray-400 hover:border-forest hover:text-forest"
                  )}>
                    <Check size={15} aria-hidden="true" />
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="columns-1 gap-5 sm:columns-2 xl:columns-3">
          {items.map((swap) => {
            const completed = completedIds.includes(swap.id);
            return (
              <article key={swap.id} className="group mb-5 break-inside-avoid overflow-hidden rounded-3xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-soft">
                <div className="relative h-48 bg-paper">
                  <Image src={swap.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold backdrop-blur">{swap.tag}</span>
                  {completed && <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-forest text-white" aria-label="Already tried"><Check size={16} aria-hidden="true" /></span>}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                    <span>{swap.category}</span>
                    <span className="shrink-0 rounded-full bg-mint px-2.5 py-1 font-semibold text-forest">+{swap.points} pts</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold tracking-tight">{swap.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{swap.description}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-xs">
                    <span className="font-semibold text-forest">{swap.impact}</span>
                    <span className="text-gray-400">{swap.cost}</span>
                  </div>
                  <form action={setSwapCompletion} className="mt-4">
                    <input type="hidden" name="swapId" value={swap.id} />
                    <input type="hidden" name="completed" value={completed ? "0" : "1"} />
                    <button type="submit" className={"inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition " + (
                      completed ? "border-forest bg-mint text-forest" : "border-line text-gray-600 hover:border-forest hover:text-forest"
                    )}>
                      {completed ? "Tried · Undo" : "Mark as tried"}
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line py-12 text-center text-sm text-gray-500">
          No swaps match that search. Try another word or category.
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
        <p>{items.length} ideas · Impact figures are illustrative estimates.</p>
        {completedIds.length > 0 && (
          <Link href="/dashboard/activity" className="focus-ring inline-flex items-center gap-2 font-semibold text-forest hover:text-ink">
            View my activity ({completedIds.length}) <ArrowRight size={14} aria-hidden="true" />
          </Link>
        )}
      </div>
    </>
  );
}
