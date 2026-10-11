import Link from 'next/link';
import { ArrowUpRight, Gift, Leaf, Sparkles, TicketCheck } from 'lucide-react';

export const metadata = { title: 'Rewards', description: 'Learn how GreenSwap demo points work and what is planned next.' };

export default function RewardsPage() {
  return <section className="container-shell py-12 sm:py-16 lg:py-20">
    <p className="eyebrow">REWARDS / GOOD HABITS, GENTLE NUDGES</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[.98] tracking-editorial sm:text-6xl lg:text-7xl">Reward the habit. Don’t turn it into a score.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted">GreenSwap’s current demo points make the product journey tangible. They are not cash, a carbon offset, a verified climate impact or a promise of a future reward.</p>
    <div className="mt-10 grid gap-4 md:grid-cols-3">{[{icon:Leaf,title:'Make a swap',copy:'Record a practical action, such as repairing an item or planning a lower-waste meal.'},{icon:Sparkles,title:'Earn demo points',copy:'Each recorded swap adds illustrative points to your browser-based demo balance.'},{icon:Gift,title:'See what comes next',copy:'Real reward partners, redemption and payment flows are future work, not active features today.'}].map((item)=>{const Icon=item.icon;return <article className="card-edge p-6" key={item.title}><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eef4ea] text-moss"><Icon size={20}/></span><h2 className="mt-5 font-serif text-2xl">{item.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{item.copy}</p></article>;})}</div>
    <div className="mt-8 rounded-3xl bg-moss-dark p-7 text-white sm:p-9"><div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10"><TicketCheck size={21}/></span><div><p className="eyebrow text-emerald-200">CURRENT STATUS / DEMO ONLY</p><h2 className="mt-3 font-serif text-3xl">No checkout. No redemption promises.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Points are saved with the mock session. No partner rewards or paid Pro checkout are connected in this release.</p><Link href="/dashboard/explore" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink">Try the demo <ArrowUpRight size={14}/></Link></div></div></div>
  </section>;
}
