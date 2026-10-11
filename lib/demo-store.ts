export type DemoActivity = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  status: "Saved" | "Removed" | "Explored";
};

const SAVED_KEY = "greenswap-demo-saved-swaps";
const ACTIVITY_KEY = "greenswap-demo-activity";

export function readSavedSwaps(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
  } catch {
    return [];
  }
}

export function writeSavedSwaps(ids: string[]) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(SAVED_KEY, JSON.stringify(ids)); } catch { /* Storage may be unavailable. */ }
}

export function readDemoActivity(): DemoActivity[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(ACTIVITY_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((entry): entry is DemoActivity =>
      typeof entry === "object" && entry !== null
      && typeof (entry as DemoActivity).id === "string"
      && typeof (entry as DemoActivity).title === "string"
      && typeof (entry as DemoActivity).body === "string"
      && typeof (entry as DemoActivity).createdAt === "string"
      && ["Saved", "Removed", "Explored"].includes((entry as DemoActivity).status)
    );
  } catch {
    return [];
  }
}

export function recordDemoActivity(title: string, body: string, status: DemoActivity["status"]) {
  if (typeof window === "undefined") return;
  const event: DemoActivity = { id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title, body, createdAt: new Date().toISOString(), status };
  const next = [event, ...readDemoActivity()].slice(0, 20);
  try { window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next)); } catch { /* Local history is optional. */ }
}
