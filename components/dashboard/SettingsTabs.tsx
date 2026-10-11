"use client";

import { useState, type ReactNode } from "react";
import { Bell, Eye, ShieldCheck, SlidersHorizontal, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Tab = "General" | "Notifications" | "Privacy";
const tabs: { label: Tab; icon: typeof SlidersHorizontal }[] = [{label:"General",icon:SlidersHorizontal},{label:"Notifications",icon:Bell},{label:"Privacy",icon:ShieldCheck}];

export function SettingsTabs() {
  const [active,setActive]=useState<Tab>("General");
  const [name,setName]=useState("GreenSwap Member");
  const [digest,setDigest]=useState(false);
  const [productUpdates,setProductUpdates]=useState(true);
  const [privateActivity,setPrivateActivity]=useState(true);
  const [saved,setSaved]=useState(false);
  function save(){setSaved(true);window.setTimeout(()=>setSaved(false),2500)}
  const toggle=(label:string,checked:boolean,onChange:(value:boolean)=>void,description:string)=> <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 transition hover:bg-gray-50"><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} className="mt-1 h-4 w-4 accent-forest-700"/><span><span className="block text-sm font-medium">{label}</span><span className="mt-1 block text-xs leading-5 text-gray-500">{description}</span></span></label>;

  let content: ReactNode;
  if(active==="General") content=<div className="space-y-6"><div><label htmlFor="display-name" className="text-sm font-medium">Display name</label><input id="display-name" value={name} onChange={e=>setName(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-forest-500"/></div><div><p className="text-sm font-medium">Language</p><select aria-label="Language" defaultValue="English" className="mt-2 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm"><option>English</option><option disabled>More languages coming later</option></select></div><div><p className="text-sm font-medium">Demo data</p><p className="mt-1 text-xs leading-5 text-gray-500">Changes in this version are kept in the current browser session or local device only. Cloud sync is not enabled in the demo.</p></div></div>;
  else if(active==="Notifications") content=<div className="space-y-3">{toggle("Product notes",productUpdates,setProductUpdates,"Occasional updates about features and practical guides.")}{toggle("Weekly digest",digest,setDigest,"A weekly reminder of saved ideas. Delivery is not connected in this demo.")}</div>;
  else content=<div className="space-y-3"><div className="mb-4 flex items-start gap-3 rounded-xl bg-forest-50 p-4 text-forest-900"><Eye size={18} className="mt-0.5 shrink-0"/><p className="text-sm leading-6">Privacy controls here describe demo preferences; they do not change a cloud account or backend policy.</p></div>{toggle("Keep activity private",privateActivity,setPrivateActivity,"Hide activity details from public-facing profile views. This demo does not publish activity.")}</div>;

  return <Card className="overflow-hidden"><div role="tablist" aria-label="Settings categories" className="flex gap-1 overflow-x-auto border-b border-line bg-gray-50/70 p-2">{tabs.map(tab=>{const Icon=tab.icon;return <button key={tab.label} type="button" role="tab" aria-selected={active===tab.label} onClick={()=>setActive(tab.label)} className={cn("inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-sm transition",active===tab.label?"bg-white font-semibold text-ink shadow-sm":"text-gray-500 hover:text-ink")}><Icon size={15}/>{tab.label}</button>})}</div><div role="tabpanel" className="p-5 sm:p-7"><h2 className="text-lg font-semibold tracking-tight">{active} settings</h2><p className="mt-1 mb-6 text-sm text-gray-500">{active==="General"?"Basic profile and experience choices.":active==="Notifications"?"Choose the updates you’d like to see.":"Understand and manage local demo preferences."}</p>{content}<div className="mt-7 flex items-center gap-3 border-t border-line pt-5"><Button type="button" onClick={save}>Save settings</Button>{saved&&<span role="status" className="inline-flex items-center gap-1.5 text-xs text-forest-700"><Check size={14}/>Preferences saved in this session</span>}</div></div></Card>;
}
