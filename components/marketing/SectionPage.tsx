import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function SectionPage({eyebrow,title,description,children,cta="Explore swaps",href="/explore"}:{eyebrow:string;title:string;description:string;children:ReactNode;cta?:string;href?:string}) {
 return <main id="main-content" className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20"><p className="font-mono text-xs uppercase tracking-[.18em] text-forest-700">{eyebrow}</p><h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-.06em] sm:text-6xl">{title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-gray-500">{description}</p><div className="prose prose-gray mt-10 max-w-none prose-headings:tracking-tight prose-a:text-forest-700">{children}</div><Link href={href} className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-forest-700 px-5 text-sm font-semibold text-white transition hover:bg-forest-900">{cta}<ArrowRight size={15}/></Link></main>;
}
export function FeatureList({items}:{items:string[]}) {
 return <ul className="not-prose grid gap-3 sm:grid-cols-2">{items.map(item=><li key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-sm leading-6 text-gray-600"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-forest-600"/><span>{item}</span></li>)}</ul>;
}