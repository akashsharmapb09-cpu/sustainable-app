"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export function SubscribeForm(){
 const [email,setEmail]=useState("");
 const [submitted,setSubmitted]=useState(false);
 function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const clean=email.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean))return;try{window.localStorage.setItem("greenswap-demo-newsletter",clean)}catch{/* Storage can be disabled. */}setSubmitted(true);setEmail("")}
 return submitted?<p role="status" className="mt-4 flex items-center gap-2 text-xs text-forest-200"><CheckCircle2 size={15}/>Saved in this browser. Email delivery isn’t connected yet.</p>:<form onSubmit={submit} className="mt-4 flex max-w-sm items-center rounded-full border border-white/15 bg-white/[.06] p-1 focus-within:border-emerald-400/60"><label className="sr-only" htmlFor="footer-email">Email address</label><input id="footer-email" type="email" required value={email} onChange={event=>setEmail(event.target.value)} placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs text-white outline-none placeholder:text-white/40"/><button aria-label="Join the newsletter preview" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-400 text-forest-900 transition hover:bg-emerald-300" type="submit"><ArrowUpRight size={16}/></button></form>;
}