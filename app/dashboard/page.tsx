"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, House, Compass, Map, Settings2, ChevronDown, Bike,
  Leaf, Trash2, Lightbulb, Wallet, Clock3, Sprout, ArrowUpRight,
  Menu as MenuIcon, X, Check, Sun, Coffee, ShoppingBag, Droplets,
  Heart, Footprints, Recycle, CircleHelp
} from "lucide-react";

const navPrimary = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Home", icon: House },
  { label: "Discover", icon: Compass },
  { label: "Explore", icon: Map },
];
const navInside = ["Your routine", "What works for you", "Topics you care"];
const topics = ["Low-waste living", "Food & cooking", "Getting around", "Energy at home", "Mindful shopping", "Water", "Community", "Nature"];

type Choice = { title: string; value: string; icon: typeof Bike; options: string[]; note?: string };
const lifestyleChoices: Choice[] = [
  { title: "Travel habits", value: "Mostly walk or cycle", icon: Bike, options: ["Mostly walk or cycle", "Public transport", "A mix of driving and transit", "Mostly drive"] },
  { title: "Food choices", value: "Mixed diet", icon: Leaf, options: ["Plant-based", "Mostly vegetarian", "Mixed diet", "Everything, no set pattern"] },
  { title: "Food waste at home", value: "Often", icon: Trash2, options: ["Rarely", "Sometimes", "Often", "I'm working on it"] },
  { title: "Electricity use", value: "Medium", icon: Lightbulb, options: ["Low", "Medium", "High", "Not sure yet"] },
];
const personalChoices: Choice[] = [
  { title: "Budget for changes", value: "Medium, some flexibility", icon: Wallet, options: ["Little to spend", "Medium, some flexibility", "Happy to invest more"] },
  { title: "Effort level", value: "Moderate, build a new habit", icon: Clock3, options: ["Easy wins only", "Moderate, build a new habit", "Ready for a bigger change"] },
  { title: "Main priority", value: "Meaningful environmental impact", icon: Sprout, options: ["Save money", "Save time", "Meaningful environmental impact", "A little of everything"] },
];

function SelectCard({ choice, index, onChange }: { choice: Choice; index: number; onChange: (value: string) => void }) {
  const Icon = choice.icon;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(choice.value);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.14 + index * 0.06 }} className="relative">
      <button type="button" onClick={() => setOpen(!open)} onBlur={() => window.setTimeout(() => setOpen(false), 150)} aria-expanded={open} className="group flex min-h-[112px] w-full flex-col justify-between rounded-xl border border-black/[0.09] bg-white/85 p-4 text-left shadow-[0_2px_10px_rgba(25,25,20,0.025)] transition duration-200 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-[0_8px_24px_rgba(25,25,20,0.06)] focus:outline-none focus:ring-2 focus:ring-[#e94e3c]/30">
        <span className="flex w-full items-center justify-between">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f2eb] text-[#3b4939]"><Icon size={16} strokeWidth={1.7} /></span>
          <ChevronDown size={15} className={`text-black/40 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
        <span className="mt-4 block">
          <span className="block text-[11px] font-medium tracking-[0.04em] text-black/45">{choice.title}</span>
          <span className="mt-1 block text-[13px] font-medium leading-snug text-[#252720]">{value}</span>
        </span>
      </button>
      {open && <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-black/10 bg-white p-1.5 shadow-xl">{choice.options.map((option) => <button key={option} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setValue(option); onChange(option); setOpen(false); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs text-black/75 transition hover:bg-[#f7f4ed]">{option}{value === option && <Check size={14} className="text-[#e94e3c]" />}</button>)}</div>}
    </motion.div>
  );
}

function Sidebar({ active, setActive, mobileOpen, setMobileOpen }: { active: string; setActive: (value: string) => void; mobileOpen: boolean; setMobileOpen: (value: boolean) => void }) {
  return (
    <>
      {mobileOpen && <button aria-label="Close navigation overlay" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] md:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-black/[0.09] bg-[#fffbf5] px-5 pb-5 pt-7 transition-transform duration-300 md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-3">
          <a href="#" className="font-serif text-[29px] font-bold tracking-[-1.6px] text-[#20221c]">GreenSwap<span className="text-[#e94e3c]">.</span></a>
          <button className="rounded-full p-2 text-black/50 hover:bg-black/5 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={17} /></button>
        </div>
        <div className="mt-12 px-3 text-[10px] font-semibold uppercase tracking-[0.19em] text-black/35">Menu</div>
        <nav className="mt-3 space-y-1" aria-label="Main navigation">
          {navPrimary.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActive(label); setMobileOpen(false); }} className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-[13px] font-medium transition-all duration-200 ${active === label ? "bg-[#242720] text-white shadow-sm" : "text-black/60 hover:bg-black/[0.045] hover:text-black"}`}><Icon size={16} strokeWidth={1.7} />{label}{label === "Dashboard" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#e94e3c]" />}</button>)}
        </nav>
        <div className="mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.19em] text-black/35">Inside dashboard</div>
        <nav className="ml-5 mt-4 space-y-1 border-l border-black/10 pl-4" aria-label="Dashboard sections">
          {navInside.map((label, i) => <button key={label} onClick={() => { setActive(label); setMobileOpen(false); document.getElementById(["routine", "works", "topics"][i])?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className={`block w-full rounded-full px-3 py-2.5 text-left text-[12px] transition hover:bg-black/[0.045] ${active === label ? "font-medium text-black" : "text-black/48"}`}>{label}</button>)}
        </nav>
        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-black/[0.08] bg-[#f6f2e9] p-4">
            <div className="flex items-center gap-2 text-[#4b6245]"><Sprout size={15} /><span className="text-[10px] font-semibold uppercase tracking-[0.14em]">A little goes far</span></div>
            <p className="mt-2 font-serif text-[19px] leading-tight text-[#292d25]">Better habits, not perfect ones.</p>
            <p className="mt-2 text-[11px] leading-relaxed text-black/50">Small, thoughtful swaps add up over time.</p>
          </div>
          <button onClick={() => setActive("Settings")} className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-[13px] transition hover:bg-black/[0.045] ${active === "Settings" ? "bg-black/[0.05]" : "text-black/60"}`}><Settings2 size={16} />Settings</button>
          <div className="mt-4 flex items-center gap-3 border-t border-black/[0.08] px-2 pt-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9e4d9] font-serif text-sm text-[#4a5141]">G</div>
            <div><p className="text-xs font-medium text-black/80">Your green corner</p><p className="mt-0.5 text-[10px] text-black/40">A work in progress</p></div>
            <CircleHelp size={15} className="ml-auto text-black/35" />
          </div>
        </div>
      </aside>
    </>
  );
}

export default function DashboardPage() {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["Low-waste living", "Food & cooking", "Energy at home"]);
  const [saved, setSaved] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const updateAnswer = (title: string, value: string) => setAnswers((current) => ({ ...current, [title]: value }));

  return (
    <div className="min-h-screen bg-[#fffbf5] text-[#24251f] selection:bg-[#e94e3c]/15">
      <Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="min-h-screen md:ml-[260px]">
        <div className="mx-auto max-w-[1500px] px-5 pb-24 pt-5 sm:px-8 sm:pt-8 lg:px-12 lg:pb-16 lg:pt-10">
          <div className="mb-8 flex items-center justify-between md:hidden">
            <button onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10"><MenuIcon size={18} /></button>
            <span className="font-serif text-xl font-bold tracking-tight">GreenSwap<span className="text-[#e94e3c]">.</span></span>
            <span className="w-10" />
          </div>
          <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="relative border-b border-black/10 pb-9 sm:pb-12">
            <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-black/40 sm:text-[10px]"><span>Field notes</span><span className="text-[#e94e3c]">/</span><span>Edition 2024</span><span className="text-black/20">—</span><span>Fig. 01</span></div>
            <div className="mt-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
              <div>
                <h1 className="font-serif text-[clamp(3.25rem,7.2vw,6rem)] leading-[0.91] tracking-[-0.065em] text-[#22241e]">Your dashboard<span className="text-[#e94e3c]">.</span></h1>
                <p className="mt-5 max-w-[530px] text-[13px] leading-6 text-black/55 sm:text-[14px]">A practical starting point for a lighter routine. Keep what fits, leave what doesn’t.</p>
              </div>
              <div className="flex items-center gap-3 self-start xl:self-auto">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60"><Sun size={17} strokeWidth={1.5} /></div>
                <div><p className="text-[10px] uppercase tracking-[0.16em] text-black/40">Your pace</p><p className="mt-1 text-xs font-medium">Slow, steady, yours.</p></div>
              </div>
            </div>
            <div className="absolute right-0 top-0 hidden items-center gap-2 text-[10px] text-black/35 lg:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#8c9d77]" />PERSONAL SPACE / 001</div>
          </motion.header>

          <motion.section id="routine" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }} className="scroll-mt-8 pt-9 sm:pt-11">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div><p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.19em] text-black/40">Personalise / your routine</p><h2 className="font-serif text-[clamp(1.9rem,3vw,2.55rem)] leading-tight tracking-[-0.045em]">Your everyday choices<span className="text-[#e94e3c]">.</span></h2></div>
              <p className="max-w-[300px] text-[11px] leading-5 text-black/45">A snapshot, not a scorecard. Start where you are.</p>
            </div>
            <div className="mt-7 grid gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:gap-12">
              <section>
                <div className="mb-4 flex items-center justify-between"><h3 className="font-serif text-[22px] tracking-[-0.035em]">Everyday lifestyle</h3><span className="text-[10px] text-black/35">01 — 04</span></div>
                <p className="mb-4 max-w-[340px] text-[11px] leading-5 text-black/50">Choose what most closely fits your current routine.</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{lifestyleChoices.map((choice, index) => <SelectCard key={choice.title} choice={{ ...choice, value: answers[choice.title] ?? choice.value }} index={index} onChange={(value) => updateAnswer(choice.title, value)} />)}</div>
              </section>
              <section id="works" className="scroll-mt-8">
                <div className="mb-4 flex items-center justify-between"><h3 className="font-serif text-[22px] tracking-[-0.035em]">What works for you?</h3><span className="text-[10px] text-black/35">05 — 07</span></div>
                <p className="mb-4 max-w-[340px] text-[11px] leading-5 text-black/50">Keep suggestions realistic for your budget, time and priorities.</p>
                <div className="space-y-3">{personalChoices.map((choice, index) => <SelectCard key={choice.title} choice={{ ...choice, value: answers[choice.title] ?? choice.value }} index={index + 4} onChange={(value) => updateAnswer(choice.title, value)} />)}</div>
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#e8e2d6] bg-[#f6f2e9]/75 p-4"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#65765a]"><Heart size={15} /></div><div><p className="text-[11px] font-medium">There’s no one-size-fits-all.</p><p className="mt-1 text-[11px] leading-5 text-black/50">Your best next step is the one that fits your actual life.</p></div></div>
              </section>
            </div>
          </motion.section>

          <motion.section id="topics" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="scroll-mt-8 mt-12 border-t border-black/10 pt-8 sm:mt-14 sm:pt-10">
            <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12">
              <div><p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.19em] text-black/40">Follow your curiosity</p><h2 className="font-serif text-[clamp(1.9rem,3vw,2.5rem)] leading-tight tracking-[-0.045em]">Topics you care about<span className="text-[#e94e3c]">.</span></h2><p className="mt-3 max-w-[300px] text-[11px] leading-5 text-black/50">Pick the things you’d like to make a little lighter. Change them anytime.</p></div>
              <div>
                <div className="flex flex-wrap gap-2">{topics.map((topic, i) => { const chosen = selectedTopics.includes(topic); const TopicIcon = [Recycle, Coffee, Footprints, Lightbulb, ShoppingBag, Droplets, Heart, Leaf][i]; return <button key={topic} type="button" aria-pressed={chosen} onClick={() => setSelectedTopics((current) => chosen ? current.filter((item) => item !== topic) : [...current, topic])} className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-[11px] transition-all duration-200 hover:-translate-y-0.5 ${chosen ? "border-[#292c24] bg-[#292c24] text-white" : "border-black/10 bg-white/55 text-black/60 hover:border-black/25 hover:bg-white"}`}><TopicIcon size={14} strokeWidth={1.6} />{topic}{chosen && <Check size={12} className="ml-0.5 text-[#ef887b]" />}</button>; })}</div>
                <div className="mt-5 flex flex-col justify-between gap-4 border-t border-black/[0.08] pt-5 sm:flex-row sm:items-center"><p className="text-[10px] text-black/40">{selectedTopics.length} topics selected <span className="mx-1.5">·</span> Curiosity is a good place to start.</p><button onClick={() => setSaved(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e94e3c] px-5 py-3 text-[11px] font-medium text-white transition hover:bg-[#d94333] focus:outline-none focus:ring-2 focus:ring-[#e94e3c]/40 focus:ring-offset-2">{saved ? "Preferences saved" : "Save my preferences"}{saved ? <Check size={14} /> : <ArrowUpRight size={14} />}</button></div>
              </div>
            </div>
          </motion.section>
          <footer className="mt-14 flex flex-col justify-between gap-2 border-t border-black/10 pt-5 text-[9px] uppercase tracking-[0.15em] text-black/35 sm:flex-row"><span>GreenSwap® — A lighter way, one choice at a time.</span><span>Made for real life, not perfection.</span></footer>
        </div>
      </main>
    </div>
  );
}
