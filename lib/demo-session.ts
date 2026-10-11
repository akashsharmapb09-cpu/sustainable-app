import { cookies } from "next/headers";
import { swaps } from "@/lib/data";

const BASE_DEMO_POINTS = 120;
const COMPLETED_COOKIE = "greenswap_completed_swaps";

export async function getDemoProgress() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COMPLETED_COOKIE)?.value;
  let completedIds: string[] = [];

  try {
    const parsed: unknown = raw ? JSON.parse(decodeURIComponent(raw)) : [];
    if (Array.isArray(parsed)) {
      completedIds = parsed.filter((id): id is string => typeof id === "string");
    }
  } catch {
    completedIds = [];
  }

  const completed = swaps.filter((swap) => completedIds.includes(swap.id));
  const earnedPoints = completed.reduce((total, swap) => total + swap.points, 0);
  const estimatedMonthlyKg = completed.reduce((total, swap) => {
    const amount = Number(swap.impact.match(/[0-9]+(?:\.[0-9]+)?/)?.[0] ?? 0);
    return total + amount;
  }, 0);

  return {
    completed,
    completedIds: completed.map((swap) => swap.id),
    earnedPoints,
    points: BASE_DEMO_POINTS + earnedPoints,
    estimatedMonthlyKg,
    categoriesTried: new Set(completed.map((swap) => swap.category)).size,
  };
}
