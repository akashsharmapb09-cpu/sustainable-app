import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';

export const metadata = { title: 'FAQ', description: 'Answers about GreenSwap, environmental estimates, demo points, data and privacy.' };

const questions = [
  { question: 'What is GreenSwap?', answer: 'GreenSwap is a practical field guide for lower-impact everyday choices across food, transport, home, shopping and waste. It helps you compare options that suit your routines and constraints.' },
  { question: 'How are environmental impacts estimated?', answer: 'GreenSwap uses published source factors and documented assumptions where available. Actual outcomes vary by region, product, distance, usage and what the new action replaces. Recommendations are directional, not a professional carbon audit.' },
  { question: 'Does “0.7t saved” represent my personal impact?', answer: 'No. The 0.7 tonne figure in the social artwork is explicitly illustrative. It is not calculated from your activities, and it is not a verified personal saving.' },
  { question: 'Which data sources does GreenSwap use?', answer: 'The product references sources such as DEFRA, India’s Central Electricity Authority (CEA) and the US Environmental Protection Agency (EPA), alongside other source documents where relevant. The methodology page explains the source trail and limits.' },
  { question: 'Are recommendations guarantees?', answer: 'No. They are decision support, not a guarantee or substitute for professional greenhouse-gas accounting. Read the assumptions and consider whether an option fits your situation.' },
  { question: 'Do I need an account?', answer: 'Public pages are available without signing in. Dashboard access uses a mock demo session in this release, not a production identity provider.' },
  { question: 'Where are demo preferences and activity saved?', answer: 'Recorded swaps, points and settings are stored in HTTP-only cookies for this browser demo. They are not an account database and are not synchronised across devices. Logging out clears the demo cookies.' },
  { question: 'Can I change my recommendations?', answer: 'Open the dashboard and use Settings to change your display name, region and preference markers. The current release does not use those settings to claim fully personalised scientific estimates.' },
  { question: 'Are newsletter and Pro checkout active?', answer: 'No. Newsletter delivery, reward redemption and paid Pro checkout are not connected. The newsletter form explains that the address is not saved when the service is unavailable.' },
  { question: 'Does “No cookies” mean the site stores no data?', answer: 'No. GreenSwap uses essential HTTP-only cookies for the demo session, activity, points and settings. Browser cookies differ from third-party advertising cookies; the privacy and cookies pages describe this demo setup.' },
];

export default function FAQPage() {
  return <section className="container-shell py-12 sm:py-16 lg:py-20">
    <p className="eyebrow">FIELD GUIDE / ANSWERS</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[.98] tracking-editorial sm:text-6xl lg:text-7xl">Good questions.<span className="text-moss"> Clear answers.</span></h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted">A clear explanation of estimates, demo settings and what is or is not enabled in this release.</p>
    <div className="mt-10 divide-y divide-line border-y border-line bg-white px-5 sm:px-8">{questions.map((item,index)=><details key={item.question} className="group py-5"><summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-1 marker:hidden"><span className="flex min-w-0 gap-4"><span className="pt-1 font-mono text-[10px] text-muted">{String(index+1).padStart(2,'0')}</span><span className="font-serif text-xl leading-7 sm:text-2xl">{item.question}</span></span><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-muted transition group-open:rotate-45 group-open:border-moss group-open:text-moss"><Plus size={15}/></span></summary><p className="ml-8 mt-3 max-w-3xl text-sm leading-7 text-muted">{item.answer}</p></details>)}</div>
    <div className="mt-9 flex flex-wrap gap-5 text-sm"><Link href="/methodology" className="inline-flex items-center gap-1.5 font-semibold text-moss">Review data sources <ArrowUpRight size={14}/></Link><Link href="/privacy" className="inline-flex items-center gap-1.5 font-semibold text-moss">Read privacy details <ArrowUpRight size={14}/></Link></div>
  </section>;
}
