import { useEffect, useMemo, useState } from "react";
import { Calendar, Droplets, Flame, TrendingDown, Wallet } from "lucide-react";
import {
  getRoutineSwaps,
  normalizeRoutineCategory,
  subscribeToRoutineSwaps,
  type RoutineSwap,
} from "./routineSwapStore";

const CATEGORY_NAMES = ["Transport", "Energy", "Food", "Shopping & Waste"] as const;

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function safeDate(value: string | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(value);
}

function formatRupees(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function activityDate(swap: RoutineSwap): string | null {
  const date = safeDate(swap.lastActiveAt) ?? safeDate(swap.createdAt);
  return date ? localDateKey(date) : null;
}

function getHabitStreak(activityDates: Set<string>, today: Date): number {
  const anchor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayKey = localDateKey(anchor);
  if (!activityDates.has(todayKey)) {
    anchor.setDate(anchor.getDate() - 1);
    if (!activityDates.has(localDateKey(anchor))) return 0;
  }

  let streak = 0;
  while (activityDates.has(localDateKey(anchor))) {
    streak += 1;
    anchor.setDate(anchor.getDate() - 1);
  }
  return streak;
}

export function Analytics() {
  const [swaps, setSwaps] = useState<RoutineSwap[]>([]);
  const [today, setToday] = useState<Date>(() => new Date());

  useEffect(() => {
    const refresh = () => {
      setSwaps(getRoutineSwaps());
      setToday(new Date());
    };
    refresh();
    return subscribeToRoutineSwaps(refresh);
  }, []);

  const analytics = useMemo(() => {
    const monthlyCO2Saved = swaps.reduce((total, swap) => total + swap.co2Saved, 0);
    const netExpenditure = swaps.reduce((total, swap) => total + swap.costDiff, 0);
    const waterConserved = swaps.reduce((total, swap) => total + swap.waterSaved, 0);

    const activityDates = new Set(
      swaps.map(activityDate).filter((date): date is string => Boolean(date)),
    );
    const habitStreak = getHabitStreak(activityDates, today);

    const weeklyTotals = [0, 0, 0, 0];
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    for (const swap of swaps) {
      const date = safeDate(swap.createdAt);
      if (!date || date.getFullYear() !== currentYear || date.getMonth() !== currentMonth) continue;
      const weekIndex = Math.min(3, Math.floor((date.getDate() - 1) / 7));
      weeklyTotals[weekIndex] += swap.co2Saved;
    }

    const categoryTotals: Record<(typeof CATEGORY_NAMES)[number], number> = {
      Transport: 0,
      Energy: 0,
      Food: 0,
      "Shopping & Waste": 0,
    };
    for (const swap of swaps) {
      categoryTotals[normalizeRoutineCategory(swap.category)] += swap.co2Saved;
    }

    const recentDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + index);
      const key = localDateKey(date);
      return {
        key,
        date,
        label: date.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 1),
        active: activityDates.has(key),
        isToday: key === localDateKey(today),
      };
    });

    return {
      monthlyCO2Saved,
      netExpenditure,
      waterConserved,
      habitStreak,
      weeklyTotals,
      categoryTotals,
      recentDays,
      totalCategoryCO2: Object.values(categoryTotals).reduce((sum, value) => sum + value, 0),
    };
  }, [swaps, today]);

  const maxWeekly = Math.max(...analytics.weeklyTotals, 0);
  const monthLabel = today.toLocaleDateString("en-IN", { month: "short", year: "numeric" });

  return (
    <div className="routine-analytics-view">
      <div className="analytics-kpi-grid">
        <div className="routine-card kpi-card">
          <div className="kpi-icon-wrap bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div>
            <span className="kpi-label">MONTHLY CO₂E SAVED</span>
            <strong className="kpi-value">{formatNumber(analytics.monthlyCO2Saved)} <span>kg</span></strong>
            <span className="kpi-sub">Across active swaps</span>
          </div>
        </div>

        <div className="routine-card kpi-card">
          <div className="kpi-icon-wrap bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <span className="kpi-label">NET EXPENDITURE SAVINGS</span>
            <strong className="kpi-value">{formatRupees(analytics.netExpenditure)} <span>/ mo</span></strong>
            <span className="kpi-sub">Estimated monthly balance</span>
          </div>
        </div>

        <div className="routine-card kpi-card">
          <div className="kpi-icon-wrap bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <span className="kpi-label">WATER CONSERVED</span>
            <strong className="kpi-value">{formatNumber(analytics.waterConserved)} <span>Litres</span></strong>
            <span className="kpi-sub">Recorded water savings</span>
          </div>
        </div>

        <div className="routine-card kpi-card">
          <div className="kpi-icon-wrap bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="kpi-label">HABIT STREAK</span>
            <strong className="kpi-value">{analytics.habitStreak} <span>Days</span></strong>
            <span className="kpi-sub">Consecutive active days</span>
          </div>
        </div>
      </div>

      {swaps.length === 0 && (
        <p className="analytics-empty-state">Start adding swaps to see impact</p>
      )}

      <div className="analytics-charts-split">
        <div className="routine-card chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Weekly Carbon Reduction Trend</h3>
              <p className="chart-sub">Kilograms of CO₂e avoided each week</p>
            </div>
            <span className="chart-period-badge">{monthLabel}</span>
          </div>

          <div className="weekly-bars-display">
            {analytics.weeklyTotals.map((kg, index) => (
              <div key={index} className="weekly-bar-col">
                <span className="bar-kg-label">{formatNumber(kg)} kg</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ height: maxWeekly > 0 ? ((Math.max(0, kg) / maxWeekly) * 100) + "%" : "0%" }}
                  />
                </div>
                <span className="bar-week-label">{"Week " + (index + 1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="routine-card breakdown-card">
          <h3 className="chart-title">Impact by Category</h3>
          <p className="chart-sub">Where your footprint savings come from</p>

          <div className="category-bars-list">
            {CATEGORY_NAMES.map((name, index) => {
              const co2 = analytics.categoryTotals[name];
              const pct = analytics.totalCategoryCO2 > 0
                ? Math.round((Math.max(0, co2) / analytics.totalCategoryCO2) * 100)
                : 0;
              const categoryColor = ["#123826", "#2b7a4b", "#a35a38", "#848E86"][index];
              return (
                <div key={name} className="cat-breakdown-row">
                  <div className="cat-breakdown-info">
                    <span className="cat-name">{name}</span>
                    <strong className="cat-kg">{formatNumber(co2)} kg ({pct}%)</strong>
                  </div>
                  <div className="cat-progress-track">
                    <div
                      className="cat-progress-fill"
                      style={{ width: pct + "%", backgroundColor: categoryColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="streak-bubble-row">
            <span className="streak-bubble-title">
              <Calendar className="h-3.5 w-3.5 inline mr-1" />
              Recent Daily Activity:
            </span>
            <div className="streak-dots">
              {analytics.recentDays.map((day) => (
                <div
                  key={day.key}
                  className={"streak-dot" + (day.active ? " is-complete" : "") + (day.active && day.isToday ? " is-today" : "")}
                  title={day.date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
                  aria-label={day.date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" }) + (day.active ? ", activity recorded" : ", no activity recorded")}
                >
                  {day.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
