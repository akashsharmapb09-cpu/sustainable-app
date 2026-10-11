"use client";

import { useMemo, useState } from "react";
import { Search, ArrowUpDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { swaps, categories, type SwapCategory } from "@/lib/swaps";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function CatalogueTable() {
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState<SwapCategory>("All");
  const [sortImpact,setSortImpact]=useState(false);
  const rows=useMemo(()=>swaps.filter(s=>(category==="All"||s.category===category)&&(s.title+" "+s.description).toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sortImpact?b.points-a.points:a.title.localeCompare(b.title)),[category,query,sortImpact]);
  return <Card className="overflow-hidden">
    <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center"><label className="relative min-w-0 flex-1"><span className="sr-only">Search catalogue</span><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a swap…" className="h-10 w-full rounded-xl border border-line pl-9 pr-3 text-sm outline-none focus:border-forest-500"/></label><select aria-label="Catalogue category" value={category} onChange={e=>setCategory(e.target.value as SwapCategory)} className="h-10 rounded-xl border border-line bg-white px-3 text-sm">{categories.map(c=><option key={c}>{c}</option>)}</select></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[660px] border-collapse text-left"><thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500"><tr><th scope="col" className="px-5 py-4 font-semibold">Swap</th><th scope="col" className="px-5 py-4 font-semibold">Category</th><th scope="col" className="px-5 py-4 font-semibold">Effort</th><th scope="col" className="px-5 py-4 font-semibold"><button type="button" className="inline-flex items-center gap-1.5" onClick={()=>setSortImpact(value=>!value)} aria-label="Sort by points">Green points <ArrowUpDown size={13}/></button></th><th scope="col" className="px-5 py-4 font-semibold">Impact</th><th scope="col" className="px-5 py-4"/></tr></thead><tbody className="divide-y divide-line">{rows.map(s=><tr key={s.id} className="transition hover:bg-gray-50/70"><td className="px-5 py-4"><p className="text-sm font-semibold">{s.title}</p><p className="mt-1 max-w-[290px] text-xs leading-5 text-gray-500">{s.description}</p></td><td className="px-5 py-4 text-sm text-gray-600">{s.category}</td><td className="px-5 py-4 text-sm text-gray-600">{s.difficulty}</td><td className="px-5 py-4 text-sm font-semibold text-forest-700">+{s.points}</td><td className="px-5 py-4"><Badge tone={s.impact==="High impact"?"green":"gray"}>{s.impact}</Badge></td><td className="px-5 py-4"><Link href="/dashboard/explore" aria-label={`Explore ${s.title}`} className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-ink"><ArrowUpRight size={15}/></Link></td></tr>)}</tbody></table></div>
    <div className="border-t border-line px-5 py-3 text-xs text-gray-500">Showing {rows.length} of {swaps.length} sample swaps. Points are demo values, not carbon measurements.</div>
  </Card>;
}
