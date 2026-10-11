"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Bookmark, ArrowUpRight, Check, Leaf } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { swaps, categories, type SwapCategory } from "@/lib/swaps";
import { readSavedSwaps, recordDemoActivity, writeSavedSwaps } from "@/lib/demo-store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = { Wrench:Leaf,Coffee:Leaf,Salad:Leaf,Shirt:Leaf,Footprints:Leaf,CookingPot:Leaf,Wind:Leaf,CarFront:Leaf };

export function ExploreGrid() {
  const [category,setCategory]=useState<SwapCategory>("All");
  const [query,setQuery]=useState("");
  const [saved,setSaved]=useState<string[]>([]);
  const [onlyEasy,setOnlyEasy]=useState(false);

  useEffect(()=>{startTransition(()=>setSaved(readSavedSwaps()))},[]);
  const filtered=useMemo(()=>swaps.filter(swap=>(category==="All"||swap.category===category)&&(!onlyEasy||swap.difficulty==="Easy")&&(swap.title+" "+swap.description+" "+swap.category).toLowerCase().includes(query.toLowerCase())),[category,query,onlyEasy]);
  function toggleSaved(id:string){
    const swap=swaps.find(item=>item.id===id);
    const wasSaved=saved.includes(id);
    const next=wasSaved?saved.filter(value=>value!==id):[...saved,id];
    setSaved(next);
    writeSavedSwaps(next);
    if(swap)recordDemoActivity(wasSaved?`Removed “${swap.title}” from saved swaps`:`Saved “${swap.title}”`,wasSaved?"Removed from your saved list.":"Added to your next-step list.",wasSaved?"Removed":"Saved");
  }

  return <div>
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative min-w-0 flex-1"><span className="sr-only">Search swaps</span><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search swaps, categories or habits…" className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm outline-none transition focus:border-forest-500 focus:bg-white"/></label>
        <button type="button" aria-pressed={onlyEasy} onClick={()=>setOnlyEasy(value=>!value)} className={cn("inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm transition",onlyEasy?"border-forest-200 bg-forest-50 text-forest-700":"border-gray-200 text-gray-600 hover:bg-gray-50")}><SlidersHorizontal size={15}/>Easy to try{onlyEasy&&<Check size={14}/>}</button>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Filter by category">{categories.map(item=><button key={item} type="button" onClick={()=>setCategory(item)} aria-pressed={category===item} className={cn("rounded-full px-4 py-2 text-xs font-medium transition",category===item?"bg-black text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200")}>{item}</button>)}</div>
    </div>
    <div className="mt-5 flex items-center justify-between text-xs text-gray-500"><p>{filtered.length} practical swaps</p><p className="font-mono">{saved.length} saved on this device</p></div>
    <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {filtered.map((swap,index)=>{const Icon=iconMap[swap.icon]??Leaf;const isSaved=saved.includes(swap.id);return <Card key={swap.id} className={cn("group flex min-w-0 flex-col overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:border-forest-100 hover:shadow-panel",index===0?"sm:row-span-2 sm:p-6":"")}>
        <div className="flex items-start justify-between gap-3"><span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl",swap.accent)}><Icon size={19}/></span><button type="button" aria-label={isSaved?`Unsave ${swap.title}`:`Save ${swap.title}`} aria-pressed={isSaved} onClick={()=>toggleSaved(swap.id)} className={cn("grid h-9 w-9 place-items-center rounded-full border transition",isSaved?"border-forest-200 bg-forest-50 text-forest-700":"border-gray-200 text-gray-400 hover:text-ink")}><Bookmark size={15} fill={isSaved?"currentColor":"none"}/></button></div>
        <div className="mt-5 flex flex-wrap gap-2"><Badge tone={swap.impact==="High impact"?"green":swap.impact==="Good start"?"blue":"gray"}>{swap.impact}</Badge><Badge>{swap.category}</Badge></div>
        <h2 className={cn("mt-4 font-semibold tracking-tight",index===0?"text-2xl sm:text-3xl":"text-lg")}>{swap.title}</h2><p className="mt-2 text-sm leading-6 text-gray-500">{swap.description}</p>
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4"><span className="text-xs text-gray-500">{swap.difficulty} · {swap.impactValue} impact</span><span className="inline-flex items-center gap-1 text-sm font-semibold text-forest-700">+{swap.points} pts <ArrowUpRight size={14}/></span></div>
      </Card>})}
    </div>
    {filtered.length===0&&<div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-12 text-center"><p className="font-semibold">No swaps match that search.</p><p className="mt-2 text-sm text-gray-500">Try another keyword or clear a filter.</p><button type="button" className="mt-4 text-sm font-semibold text-forest-700 underline" onClick={()=>{setQuery("");setCategory("All");setOnlyEasy(false)}}>Reset filters</button></div>}
  </div>;
}
