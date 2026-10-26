"use client";

import { useState, type ChangeEvent } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  Droplets,
  Flame,
  LayoutDashboard,
  Leaf,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type AnalyticsCategory = {
  name: string;
  percent: number;
};

export type MonthlyAnalyticsSnapshot = {
  monthlyCo2eKg: number;
  waterLitres: number;
  netSavings: number;
  streak: number;
  categories: AnalyticsCategory[];
};

export type AnalyticsTabProps = {
  monthlyData?: Record<string, MonthlyAnalyticsSnapshot>;
  monthlyCo2eKg?: number;
  waterLitres?: number;
  netSavings?: number;
  streak?: number;
  weekly?: number[];
  categories?: AnalyticsCategory[];
  updatedAtLabel?: string;
  embedded?: boolean;
  onBack?: () => void;
};

type Metric = {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend: number;
  description: string;
  hint: string;
  featured?: boolean;
};

function getMonthKey(date: Date): string {
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
}

function getWeeklyCarbonData(month: string, totalKg: number): number[] {
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const weekDays = [7, 7, 7, Math.max(1, daysInMonth - 21)];
  const totalDays = weekDays.reduce((sum, days) => sum + days, 0);
  const total = Math.max(0, Math.round(Number.isFinite(totalKg) ? totalKg : 0));
  const exact = weekDays.map((days) => (total * days) / totalDays);
  const values = exact.map(Math.floor);
  const remainder = total - values.reduce((sum, value) => sum + value, 0);
  const order = exact.map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((left, right) => right.fraction - left.fraction);
  for (let index = 0; index < remainder; index += 1) values[order[index % order.length].index] += 1;
  return values;
}

function monthOptions(count = 12): Array<{ value: string; label: string }> {
  const current = new Date();
  current.setDate(1);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(current);
    date.setMonth(current.getMonth() - index);
    return { value: getMonthKey(date), label: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }) };
  });
}

const DEFAULT_CATEGORIES: AnalyticsCategory[] = [
  { name: "Transport", percent: 45 },
  { name: "Food", percent: 30 },
  { name: "Energy", percent: 20 },
  { name: "Shopping", percent: 5 },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "#overview" },
  { label: "Your routine", icon: Sparkles, href: "#routine" },
  { label: "Progress", icon: Activity, href: "#weekly" },
  { label: "Impact categories", icon: ShoppingBag, href: "#categories" },
  { label: "Methodology", icon: CircleHelp, href: "#methodology" },
];

function numberLabel(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  );
}

function matches(query: string, value: string): boolean {
  return !query.trim() || value.toLowerCase().includes(query.trim().toLowerCase());
}

function safe(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function BrandMark() {
  return (
    <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[11px] border border-green-800/10 bg-[#e2f0e2] text-[#287a48]">
      <Leaf className="h-[22px] w-[22px]" strokeWidth={1.7} />
    </span>
  );
}

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const Icon = metric.icon;
  const neutral = metric.trend <= 0;
  return (
    <article className="group relative min-w-0 overflow-hidden rounded-[15px] border border-black/[0.09] bg-[#FFFEF9] p-[17px] text-[#101310] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green-800/25 sm:p-[19px]">
      <div className="relative z-[1] flex min-h-[38px] items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-[21px] font-semibold leading-tight text-[#555c52]">
          <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[9px] bg-[#e5f2e6] text-[#287a48]">
            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span>{metric.label}</span>
        </div>
        <span className="shrink-0 font-mono text-[18px] tracking-wide text-[#969b91]">{String(index + 1).padStart(2, "0")} / 04</span>
      </div>
      <p className="relative mt-5 flex min-w-0 flex-wrap items-baseline gap-x-1 text-[40px] font-bold leading-none tracking-[-0.055em] text-[#101310]">
        <span>{metric.value}</span>
        {metric.unit ? <span className="font-serif text-[24px] font-normal tracking-tight text-[#777e72]">{metric.unit}</span> : null}
      </p>
      <div className="mt-4 flex min-h-[26px] items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 whitespace-nowrap text-[18px] font-bold text-[#297a49]">
          {neutral ? null : <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.6} />}
          {metric.trend > 0 ? "+" + numberLabel(metric.trend) + "% vs last month" : "0% vs last month"}
        </span>
        <svg className="h-[26px] w-[68px] shrink-0" viewBox="0 0 64 23" fill="none" aria-hidden="true">
          <path d="M1 19L9 16L16 17L24 10L31 13L40 7L48 9L56 3L63 5" stroke="#53a96a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="mt-3 border-t border-black/[0.08] pt-[11px] text-[18px] leading-[1.5] text-[#62695f]">{metric.description}</div>
      <p className="mt-2 text-[18px] text-[#74796f]">{metric.hint}</p>
    </article>
  );
}

export function AnalyticsTab({
  monthlyData,
  monthlyCo2eKg = 630,
  waterLitres = 0,
  netSavings = 5600,
  streak = 1,
  categories = DEFAULT_CATEGORIES,
  updatedAtLabel = "Updated today, 9:12 AM",
  embedded = false,
  onBack,
}: AnalyticsTabProps = {}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const options = monthOptions();
  const currentMonth = getMonthKey(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const selectedSnapshot = monthlyData?.[selectedMonth];
  const isCurrentMonth = selectedMonth === currentMonth;

  const co2 = Math.max(0, safe(selectedSnapshot?.monthlyCo2eKg ?? (isCurrentMonth ? monthlyCo2eKg : 0)));
  const water = Math.max(0, safe(selectedSnapshot?.waterLitres ?? (isCurrentMonth ? waterLitres : 0)));
  const savings = safe(selectedSnapshot?.netSavings ?? (isCurrentMonth ? netSavings : 0));
  const days = Math.max(0, safe(selectedSnapshot?.streak ?? (isCurrentMonth ? streak : 0)));
  const weeklyValues = getWeeklyCarbonData(selectedMonth, co2);
  const peak = Math.max(0, ...weeklyValues);
  const peakWeek = Math.max(0, weeklyValues.indexOf(peak)) + 1;
  const chartMax = Math.max(180, peak);
  const selectedCategories = selectedSnapshot?.categories ?? (isCurrentMonth ? categories : []);
  const categoryValues = selectedCategories.map((item) => ({
    name: item.name || "Other",
    percent: Math.min(100, Math.max(0, safe(item.percent))),
  }));
  const totalPercent = categoryValues.reduce((sum, item) => sum + item.percent, 0);

  const metrics: Metric[] = [
    { label: "Carbon avoided", value: numberLabel(co2), unit: "kg CO₂e", icon: Leaf, trend: co2 > 0 ? 12 : 0, description: "Carbon emissions reduced in " + (options.find((option) => option.value === selectedMonth)?.label ?? selectedMonth), hint: "Your biggest climate lever" },
    { label: "Water saved", value: numberLabel(water), unit: "litres", icon: Droplets, trend: water > 0 ? 12 : 0, description: water > 0 ? "Water conserved through your swaps" : "No water-saving actions logged yet", hint: "Every litre matters" },
    { label: "Net savings", value: "₹" + numberLabel(savings), icon: Wallet, trend: savings > 0 ? 12 : 0, description: "Net savings generated this month", hint: "Good habits can save money" },
    { label: "Habit streak", value: numberLabel(days), unit: days === 1 ? "day" : "days", icon: Flame, trend: days > 0 ? 12 : 0, description: days > 0 ? "One small action can start a lasting habit" : "Start a small habit today", hint: "Consistency beats perfection" },
  ];
  const visibleMetrics = metrics.filter((item) => matches(searchQuery, item.label + " " + item.description + " " + item.hint));
  const visibleCategories = categoryValues.filter((item) => matches(searchQuery, item.name + " impact category contribution reduction"));
  const showWeekly = matches(searchQuery, "weekly carbon reduction trend momentum weeks carbon curve");
  const showCategories = matches(searchQuery, "categories contribution distribution impact") || visibleCategories.length > 0;
  const hasMatch = visibleMetrics.length > 0 || showWeekly || showCategories;

  function exportReport() {
    if (typeof window === "undefined") return;
    const rows = [
      ["GreenSwap Routine Analytics", options.find((option) => option.value === selectedMonth)?.label ?? selectedMonth],
      ["Metric", "Value"],
      ["Carbon avoided", numberLabel(co2) + " kg CO2e"],
      ["Water saved", numberLabel(water) + " litres"],
      ["Net savings", "INR " + numberLabel(savings)],
      ["Habit streak", numberLabel(days) + " day(s)"],
      ...weeklyValues.map((value, index) => ["Week " + (index + 1) + " carbon reduction", numberLabel(value) + " kg"]),
      ...categoryValues.map((item) => [item.name, numberLabel(item.percent) + "%"]),
    ];
    const csv = rows.map((row) => row.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "greenswap-routine-analytics.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setExportMessage("Analytics exported as a CSV snapshot.");
    window.setTimeout(() => setExportMessage(""), 2600);
  }

  return (
    <main id="overview" className="min-h-screen bg-[#f7f5f0] text-[#101310]" style={{ fontFamily: 'Inter, "Geist Sans", ui-sans-serif, system-ui, sans-serif' }}>
      <div className={"mx-auto grid min-h-screen w-full " + (embedded ? "max-w-none grid-cols-1" : "max-w-[1680px] grid-cols-1 lg:grid-cols-[236px_minmax(0,1fr)]")}>
        {!embedded ? (
          <aside className="hidden min-h-screen flex-col border-r border-black/[0.10] bg-[#f2efe8] px-[17px] py-[26px] lg:flex" aria-label="Main navigation">
            <a href="#overview" className="mb-8 flex items-center gap-[10px] px-2 text-[#101310] no-underline">
              <BrandMark />
              <span className="text-[28px] font-extrabold tracking-[-1.2px]">Green<span className="font-serif font-medium italic">Swap</span></span>
            </a>
            <p className="mb-3 px-3 font-mono text-[14px] font-semibold uppercase tracking-[0.16em] text-[#92958b]">Workspace</p>
            <nav className="flex flex-col gap-1" aria-label="Workspace navigation">
              {navItems.slice(0, 4).map((item, index) => {
                const Icon = item.icon;
                return <a key={item.label} href={item.href} className={"flex h-[42px] items-center gap-3 rounded-[9px] px-3 text-[16px] no-underline transition-colors " + (index === 0 ? "bg-[#111611] font-semibold text-[#fffefa]" : "font-medium text-[#676c62] hover:bg-[#eae8df] hover:text-[#101310]")}><Icon className={"h-[17px] w-[17px] shrink-0 " + (index === 0 ? "text-[#9be1ae]" : "")} strokeWidth={1.7} /><span>{item.label}</span></a>;
              })}
            </nav>
            <div className="h-7 shrink-0" />
            <p className="mb-3 px-3 font-mono text-[14px] font-semibold uppercase tracking-[0.16em] text-[#92958b]">Your account</p>
            <nav className="flex flex-col gap-1" aria-label="Account navigation">
              {navItems.slice(4).map((item) => {
                const Icon = item.icon;
                return <a key={item.label} href={item.href} className="flex h-[42px] items-center gap-3 rounded-[9px] px-3 text-[16px] font-medium text-[#676c62] no-underline hover:bg-[#eae8df]"><Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.7} /><span>{item.label}</span></a>;
              })}
            </nav>
            <div className="mt-auto">
              <div className="mb-[18px] rounded-xl border border-black/[0.09] bg-[#faf9f5] p-[13px]">
                <div className="mb-2 flex items-center gap-2 text-[15px] font-bold"><span className="h-[7px] w-[7px] rounded-full bg-[#379456]" />Grounded in data</div>
                <p className="m-0 text-[14px] leading-[1.55] text-[#787c72]">Practical swaps. Transparent environmental data. A lighter footprint.</p>
                <span className="mt-2 block font-mono text-[14px] tracking-wide text-[#343a32]">DEFRA / CEA / EPA</span>
              </div>
              <div className="flex items-center gap-2.5 border-t border-black/[0.09] px-1 pt-4">
                <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#dbe9d8] text-[14px] font-extrabold tracking-wide text-[#285a37]">GS</span>
                <span className="min-w-0 flex-1"><span className="block text-[14px] font-bold">GreenSwap member</span><span className="mt-1 block text-[14px] text-[#8f9388]">Everyday impact</span></span>
                <ChevronRight className="h-4 w-4 text-[#888d82]" />
              </div>
            </div>
          </aside>
        ) : null}

        <div className="min-w-0 px-4 pb-7 sm:px-6 lg:px-[clamp(24px,3.2vw,46px)]">
          <header className="flex h-[68px] items-center justify-between gap-3 border-b border-black/[0.10]">
            <div className="flex items-center gap-2 font-mono text-[14px] font-semibold uppercase tracking-[0.1em] text-[#9b9e95]">
              {embedded && onBack ? <button type="button" onClick={onBack} className="mr-1 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 font-sans text-[15px] font-semibold normal-case tracking-normal text-[#4f5a4c] transition hover:bg-[#e7e8df]"><ArrowLeft className="h-3.5 w-3.5" />Back to routine</button> : <><span>Workspace</span><ChevronRight className="h-3 w-3" /></>}
              <strong className="text-[#454a41]">Analytics</strong>
            </div>
            <div className="relative flex items-center gap-1.5 sm:gap-2">
              {searchOpen ? <input autoFocus value={searchQuery} onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") { setSearchQuery(""); setSearchOpen(false); } }} placeholder="Find a metric or category…" aria-label="Search analytics" className="absolute right-[118px] top-0 z-10 h-9 w-[min(300px,55vw)] rounded-lg border border-black/15 bg-[#fffefa] px-3 text-[18px] text-[#101310] shadow-sm outline-none focus:border-green-700" /> : null}
              <button type="button" onClick={() => { setSearchOpen((open) => !open); setAccountOpen(false); setNoticeOpen(false); }} aria-label="Search analytics" title="Search" className="grid h-9 w-9 place-items-center rounded-[10px] text-[#686d64] transition hover:bg-[#fffefa] hover:text-[#101310]"><Search className="h-[17px] w-[17px]" strokeWidth={1.7} /></button>
              <button type="button" onClick={() => { setNoticeOpen((open) => !open); setAccountOpen(false); }} aria-label="Notifications" title="Notifications" className="relative grid h-9 w-9 place-items-center rounded-[10px] text-[#686d64] transition hover:bg-[#fffefa] hover:text-[#101310]"><Bell className="h-[17px] w-[17px]" strokeWidth={1.7} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#379456]" /></button>
              <span className="mx-1 h-6 w-px bg-black/[0.10]" />
              <button type="button" onClick={() => { setAccountOpen((open) => !open); setNoticeOpen(false); }} aria-label="GreenSwap account" className="grid h-[34px] w-[34px] place-items-center rounded-full border border-[#ceddca] bg-[#dfecdc] text-[14px] font-extrabold text-[#285837]">GS</button>
              {(noticeOpen || accountOpen) ? <div className="absolute right-0 top-12 z-20 w-[240px] rounded-xl border border-black/10 bg-[#fffefa] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.12)]" role="status"><p className="m-0 text-[15px] font-bold text-[#20271f]">{noticeOpen ? "You’re all caught up" : "Your GreenSwap account"}</p><p className="mb-0 mt-2 text-[14px] leading-relaxed text-[#777c72]">{noticeOpen ? "Your latest routine metrics are ready to review." : "Everyday choices add up. Keep building your routine."}</p></div> : null}
            </div>
          </header>

          <section id="routine" aria-labelledby="pageTitle">
            <div className="flex flex-col items-start justify-between gap-5 border-b border-black/[0.08] py-7 sm:flex-row sm:items-end sm:py-8">
              <div>
                <div className="mb-3 flex items-center gap-2.5 font-mono text-[14px] font-semibold uppercase tracking-[0.14em] text-[#757a70]"><span className="h-px w-[23px] bg-[#438c54]" />Personal impact report <span className="text-[#b1b4ab]">/ 01</span></div>
                <h1 id="pageTitle" className="m-0 text-[clamp(38px,4vw,53px)] font-medium leading-[.99] tracking-[-.055em] text-[#101310]" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>Your routine, <em className="font-medium text-[#36794a]">in balance.</em></h1>
                <p className="mb-0 mt-3 text-[16px] leading-relaxed text-[#7a7e74]">Real-time insights into your sustainable habits <span className="px-1 text-[#a4a79e]">·</span> {updatedAtLabel}</p>
              </div>
              <div className="relative z-10 flex items-center gap-2 self-start xl:self-auto">
                <label htmlFor="analytics-month" className="sr-only">Select analytics month</label>
                <select id="analytics-month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} aria-label="Filter analytics by month" className="relative z-10 h-10 min-w-[185px] cursor-pointer appearance-auto rounded-[9px] border border-black/[0.14] bg-[#fffefa] px-3 text-[18px] font-semibold text-[#30372e] shadow-sm outline-none focus:border-[#438c54] focus:ring-2 focus:ring-[#438c54]/20">
                  {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <button type="button" onClick={exportReport className="flex h-9 items-center gap-2 rounded-[9px] border border-[#111611] bg-[#111611] px-3 text-[14px] font-semibold text-[#fffefa] transition hover:-translate-y-px hover:bg-[#2b362c]"><ArrowDownToLine className="h-[14px] w-[14px]" />Export report</button>
              </div>
            </div>

            <div className="mb-3 mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="m-0 font-mono text-[14px] font-semibold uppercase tracking-[0.13em] text-[#8c9086]">Your impact at a glance</p>
              <p className="m-0 flex items-center gap-2 text-[14px] text-[#85897f]"><span className="h-[7px] w-[7px] rounded-full bg-[#399558]" />{embedded ? "Connected to routine data" : "Preview values"}</p>
            </div>

            <section className="grid grid-cols-1 gap-[13px] sm:grid-cols-2 xl:grid-cols-4" aria-label="Impact overview">
              {visibleMetrics.map((metric, index) => <MetricCard key={metric.label} metric={metric} index={index} />)}
            </section>

            <section className="mt-5 grid grid-cols-1 gap-[14px] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]" aria-label="Impact analytics">
              {showWeekly ? <article id="weekly" className="min-w-0 rounded-[15px] border border-black/[0.09] bg-[#fffefa] p-5 shadow-[0_12px_32px_rgba(22,30,22,0.055),0_2px_5px_rgba(22,30,22,0.025)] sm:p-[22px]">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="mb-2 font-mono text-[14px] uppercase tracking-[0.12em] text-[#979a90]">Momentum / 04 weeks</p><h2 className="m-0 text-[24px] font-bold tracking-[-0.045em] text-[#101310]">Your carbon curve</h2><p className="mb-0 mt-2 text-[14px] leading-relaxed text-[#858980]">Weekly carbon reduction is moving in the right direction.</p></div>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-black/[0.08] bg-[#fbfaf6] px-2 py-[7px] text-[14px] text-[#5f655b]"><span className="h-1.5 w-1.5 rounded-full bg-[#399558]" />Peak <strong className="text-[15px] text-[#101310]">{numberLabel(peak)} kg</strong></span>
                </div>
                <div className="relative mt-6 h-[176px] pt-2">
                  <div className="pointer-events-none absolute inset-x-0 top-2 flex h-[139px] flex-col justify-between" aria-hidden="true">{[0, 1, 2, 3].map((item) => <span key={item} className="border-t border-dashed border-black/[0.08]" />)}</div>
                  <div className="relative z-[1] grid h-full grid-cols-4 gap-3 sm:gap-6">
                    {weeklyValues.map((value, index) => {
                      const height = value <= 0 ? 0 : Math.max(4, (value / chartMax) * 100);
                      const isPeak = index + 1 === peakWeek;
                      return <div key={"week-" + index} className="flex min-w-0 flex-col items-center justify-end"><span className="mb-2 font-mono text-[14px] text-[#636b60]">{numberLabel(value)} kg</span><div className="flex h-[118px] w-full items-end justify-center"><div className={"w-full max-w-[49px] rounded-t-[7px] rounded-b-[2px] transition-[height] duration-500 " + (isPeak ? "bg-gradient-to-b from-[#77ce8b] to-[#247442] shadow-[0_5px_13px_rgba(40,122,72,0.18)]" : "bg-gradient-to-b from-[#a2dfac] via-[#3c9a58] to-[#287a48]")} style={{ height: String(height) + "%" }} title={"Week " + (index + 1) + ": " + numberLabel(value) + " kg"} /></div><span className="mt-2.5 whitespace-nowrap text-[14px] text-[#767b71]">Week {String(index + 1).padStart(2, "0")}</span></div>;
                    })}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.08] pt-4"><span className="flex items-center gap-2 text-[14px] text-[#81857b]"><span className="h-[7px] w-[7px] rounded-[2px] bg-[#3c9a58]" />Carbon reduced per week</span><span className="text-[14px] font-bold text-[#267342]">Peak in Week {peakWeek}: {numberLabel(peak)} kg</span></div>
              </article> : null}

              {showCategories ? <article id="categories" className="min-w-0 rounded-[15px] border border-black/[0.09] bg-[#fffefa] p-5 shadow-[0_12px_32px_rgba(22,30,22,0.055),0_2px_5px_rgba(22,30,22,0.025)] sm:p-[22px]">
                <div><p className="mb-2 font-mono text-[14px] uppercase tracking-[0.12em] text-[#979a90]">Contribution / {String(categoryValues.length).padStart(2, "0")} categories</p><h2 className="m-0 text-[24px] font-bold tracking-[-0.045em] text-[#101310]">Where impact happens</h2><p className="mb-0 mt-2 text-[14px] leading-relaxed text-[#858980]">Your routine’s reduction, by everyday category.</p></div>
                <div className="mt-6 grid grid-cols-[minmax(86px,1fr)_minmax(70px,1.2fr)_38px] gap-3 border-b border-black/[0.08] pb-2 font-mono text-[14px] uppercase tracking-[0.1em] text-[#9b9e94]"><span>Category</span><span>Contribution</span><span className="text-right">Share</span></div>
                <div>{visibleCategories.map((item, index) => {
                  const colors = ["#287a48", "#5a9e68", "#8ab58c", "#b6cfb2"];
                  const color = colors[index % colors.length];
                  return <div key={item.name} className="grid grid-cols-[minmax(86px,1fr)_minmax(70px,1.2fr)_38px] items-center gap-3 border-b border-black/[0.065] py-[17px] last:border-b-0 last:pb-3"><span className="flex min-w-0 items-center gap-2 text-[15px] font-semibold text-[#4d534a]"><span className="h-[7px] w-[7px] shrink-0 rounded-[2px]" style={{ backgroundColor: color }} />{item.name}</span><div className="h-[7px] min-w-0 overflow-hidden rounded-full bg-[#ebece6]" role="progressbar" aria-label={item.name + " impact"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.percent}><div className="h-full rounded-full transition-[width] duration-500" style={{ width: String(item.percent) + "%", backgroundColor: color }} /></div><strong className="text-right font-mono text-[15px] text-[#292e28]">{numberLabel(item.percent)}%</strong></div>;
                })}</div>
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-black/[0.08] pt-4 text-[14px] text-[#858980]"><span>Distribution of total impact reduction</span><span className="whitespace-nowrap"><strong className="text-[16px] text-[#282e27]">{numberLabel(totalPercent)}%</strong> allocated</span></div>
              </article> : null}
            </section>

            {!hasMatch && searchQuery ? <p className="mt-4 rounded-xl border border-dashed border-black/20 p-4 text-[18px] text-[#777a72]">No matching analytics found. Try “carbon”, “water”, “savings”, “transport”, or “energy”.</p> : null}

            <section id="methodology" className="mt-5 flex flex-col items-start justify-between gap-3 rounded-[11px] border border-black/[0.08] bg-[#eef0e8] px-4 py-3.5 sm:flex-row sm:items-center sm:px-[17px]">
              <div className="flex min-w-0 items-center gap-2.5"><span className="grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[9px] bg-[#dcebdc] text-[#2d7946]"><ShieldCheck className="h-[16px] w-[16px]" strokeWidth={1.7} /></span><div><p className="m-0 text-[14px] font-bold text-[#242b23]">Impact should be useful, not opaque.</p><p className="mb-0 mt-1 text-[14px] leading-relaxed text-[#73786e]">Practical swaps, transparent environmental data references.</p></div></div>
              <a href="#methodology" className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-bold text-[#2f7848] no-underline hover:underline">Data methodology <ArrowUpRight className="h-[13px] w-[13px]" /></a>
            </section>
            <footer className="mt-6 flex flex-col justify-between gap-2 text-[14px] text-[#a1a398] sm:flex-row sm:items-center"><span>© 2026 GreenSwap <span className="px-1 text-[#c1c2ba]">·</span> Make a lighter footprint. Keep the good life.</span><span className="font-mono text-[14px] uppercase tracking-[0.08em]">DEFRA · CEA · EPA / ROUTINE ANALYTICS</span></footer>
          </section>
        </div>
      </div>
      {exportMessage ? <div className="fixed bottom-5 right-5 z-30 flex max-w-[calc(100vw-32px)] items-center gap-2.5 rounded-[11px] bg-[#151a15] px-4 py-3 text-[15px] text-[#fffefa] shadow-[0_16px_40px_rgba(0,0,0,0.18)]" role="status" aria-live="polite"><span className="text-[#a8e8b7]">✓</span>{exportMessage}</div> : null}
    </main>
  );
}

export default AnalyticsTab;
