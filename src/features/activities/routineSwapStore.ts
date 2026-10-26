export type RoutineCategory =
  | "Transport"
  | "Energy"
  | "Food"
  | "Shopping & Waste";

export interface RoutineSwap {
  id: string;
  title: string;
  category: RoutineCategory;
  /** Estimated CO₂e saved per month, in kilograms. */
  co2Saved: number;
  /** Positive values mean money saved per month; negative values mean extra cost. */
  costDiff: number;
  /** Estimated water saved per month, in litres. */
  waterSaved: number;
  createdAt: string;
  lastActiveAt?: string;
}

export const ROUTINE_SWAPS_KEY = "green-swap-routine";
const ROUTINE_SWAPS_EVENT = "greenswap:routine-swaps-updated";

type CatalogSwap = {
  id: string;
  title: string;
  category: string;
};

const CATALOG_IMPACTS: Record<
  string,
  { co2Saved: number; costDiff: number; waterSaved: number }
> = {
  bike: { co2Saved: 200, costDiff: 2400, waterSaved: 0 },
  metro: { co2Saved: 250, costDiff: 3200, waterSaved: 0 },
  "ev-2w": { co2Saved: 180, costDiff: 0, waterSaved: 0 },
  carpool: { co2Saved: 120, costDiff: 0, waterSaved: 0 },
  plant: { co2Saved: 300, costDiff: 1200, waterSaved: 0 },
  "food-waste": { co2Saved: 150, costDiff: 0, waterSaved: 0 },
  "local-produce": { co2Saved: 100, costDiff: 0, waterSaved: 0 },
  "meatless-monday": { co2Saved: 80, costDiff: 0, waterSaved: 0 },
  led: { co2Saved: 100, costDiff: 0, waterSaved: 0 },
  "ac-setpoint": { co2Saved: 160, costDiff: 680, waterSaved: 0 },
  "bldc-fan": { co2Saved: 80, costDiff: 0, waterSaved: 0 },
  "solar-rooftop": { co2Saved: 450, costDiff: 0, waterSaved: 0 },
  secondhand: { co2Saved: 50, costDiff: 0, waterSaved: 0 },
  "reusable-totes": { co2Saved: 30, costDiff: 0, waterSaved: 0 },
  "repair-first": { co2Saved: 120, costDiff: 0, waterSaved: 0 },
  compost: { co2Saved: 80, costDiff: 0, waterSaved: 0 },
  "water-aerators": { co2Saved: 40, costDiff: 0, waterSaved: 0 },
  "shorter-shower": { co2Saved: 60, costDiff: 0, waterSaved: 600 },
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function asNumber(value: unknown, unit: "co2" | "money" | "water"): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;

  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return 0;

  const amount = Number(match[0]);
  if (!Number.isFinite(amount)) return 0;
  if (unit === "co2" && /(?:^|\s)t(?:\s|$| CO2| CO₂|CO2e|CO₂e)/i.test(value)) {
    return amount * 1000;
  }
  return amount;
}

export function normalizeRoutineCategory(value: unknown): RoutineCategory {
  const category = String(value ?? "").toLowerCase();
  if (category.includes("transport") || category.includes("travel")) return "Transport";
  if (category.includes("energy") || category.includes("electric")) return "Energy";
  if (category.includes("food")) return "Food";
  return "Shopping & Waste";
}

function normalizeSwap(value: unknown): RoutineSwap | null {
  const row = asRecord(value);
  if (!row) return null;

  const id = asString(row.id) ?? asString(row.swapId) ?? asString(row.alternative_id);
  if (!id) return null;

  const createdAt =
    asString(row.createdAt) ??
    asString(row.created_at) ??
    asString(row.adoptedAt) ??
    asString(row.adopted_at) ??
    "1970-01-01T00:00:00.000Z";
  const lastActiveAt =
    asString(row.lastActiveAt) ??
    asString(row.last_active_at) ??
    asString(row.lastActiveDate) ??
    undefined;

  return {
    id,
    title: asString(row.title) ?? asString(row.name) ?? asString(row.label) ?? "Sustainable swap",
    category: normalizeRoutineCategory(row.category),
    co2Saved: asNumber(row.co2Saved ?? row.co2_saved ?? row.co2, "co2"),
    costDiff: asNumber(row.costDiff ?? row.cost_diff ?? row.moneySaved ?? row.money_saved, "money"),
    waterSaved: asNumber(row.waterSaved ?? row.water_saved ?? row.water, "water"),
    createdAt,
    ...(lastActiveAt ? { lastActiveAt } : {}),
  };
}

export function getRoutineSwaps(): RoutineSwap[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ROUTINE_SWAPS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeSwap).filter((swap): swap is RoutineSwap => swap !== null);
  } catch {
    return [];
  }
}

export function saveRoutineSwaps(swaps: RoutineSwap[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ROUTINE_SWAPS_KEY, JSON.stringify(swaps));
  window.dispatchEvent(new Event(ROUTINE_SWAPS_EVENT));
}

export function addRoutineSwapFromCatalog(item: CatalogSwap): RoutineSwap {
  const current = getRoutineSwaps();
  const existing = current.find((swap) => swap.id === item.id);
  if (existing) return existing;

  const now = new Date().toISOString();
  const impact = CATALOG_IMPACTS[item.id] ?? { co2Saved: 0, costDiff: 0, waterSaved: 0 };
  const swap: RoutineSwap = {
    id: item.id,
    title: item.title,
    category: normalizeRoutineCategory(item.category),
    co2Saved: impact.co2Saved,
    costDiff: impact.costDiff,
    waterSaved: impact.waterSaved,
    createdAt: now,
    lastActiveAt: now,
  };

  saveRoutineSwaps([swap, ...current]);
  return swap;
}

export function removeRoutineSwap(id: string): void {
  saveRoutineSwaps(getRoutineSwaps().filter((swap) => swap.id !== id));
}

export function subscribeToRoutineSwaps(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key === ROUTINE_SWAPS_KEY || event.key === null) onChange();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(ROUTINE_SWAPS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(ROUTINE_SWAPS_EVENT, onChange);
  };
}
