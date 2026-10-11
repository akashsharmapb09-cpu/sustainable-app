"use client";

import { startTransition, useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Circle, Leaf, Recycle } from "lucide-react";
import { readDemoActivity, type DemoActivity } from "@/lib/demo-store";

const seed: DemoActivity[]=[
{id:"sample-1",title:"Viewed the everyday swaps catalogue",body:"You explored food, home and transport ideas.",createdAt:"2026-10-10T12:00:00.000Z",status:"Explored"},
{id:"sample-2",title:"Planned a short walk",body:"A practical alternative for a suitable short journey.",createdAt:"2026-10-09T08:25:00.000Z",status:"Saved"},
{id:"sample-3",title:"Started your GreenSwap journey",body:"Your demo workspace was opened on this device.",createdAt:"2026-10-07T19:10:00.000Z",status:"Explored"}
];

export function ActivityTimeline(){
 const [events,setEvents]=useState<DemoActivity[]>(seed);
 useEffect(()=>{const local=readDemoActivity();if(local.length)startTransition(()=>setEvents(local))},[]);
 return <Card className="p-5 sm:p-7"><div className="mb-7 flex items-center justify-between"><div><h2 className="font-semibold tracking-tight">Your recent activity</h2><p className="mt-1 text-xs text-gray-500">Saved swap actions appear here from this browser.</p></div><Badge tone="green">{events.length} events</Badge></div><ol className="space-y-0">{events.map((event,index)=>{const Icon=event.status==="Saved"?Leaf:event.status==="Removed"?Circle:Recycle;const date=new Date(event.createdAt);const dateLabel=Number.isNaN(date.getTime())?"Recent":date.toLocaleString(undefined,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});return <li key={event.id} className="relative grid grid-cols-[40px_1fr] gap-4 pb-8 last:pb-0"><span className="relative z-10 grid h-10 w-10 place-items-center rounded-2xl border border-gray-100 bg-gray-50 text-forest-700"><Icon size={17}/></span>{index<events.length-1&&<span aria-hidden="true" className="absolute bottom-0 left-5 top-10 w-px bg-gray-200"/>}<div className="min-w-0 pt-0.5"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold">{event.title}</h3><Badge tone={event.status==="Saved"?"green":event.status==="Removed"?"red":"blue"}>{event.status}</Badge></div><p className="mt-1 text-sm leading-6 text-gray-500">{event.body}</p><time dateTime={event.createdAt} className="mt-2 block font-mono text-[10px] tracking-wide text-gray-400">{dateLabel}</time></div></li>})}</ol><p className="mt-6 border-t border-line pt-4 text-xs leading-5 text-gray-400">Activity is kept in this browser only. Sample starter entries are illustrative and are replaced once you record an action.</p></Card>;
}
