export interface DailyRitual {
  id: string;
  label: string;
  category: string;
  saving: string;
  completed: boolean;
}

/**
 * The shared daily checklist used by both Your Routine and the Dashboard
 * Ritual completion gauge. Keep this single list as the source of truth.
 */
export const DEFAULT_DAILY_RITUALS: DailyRitual[] = [
  { id: '1', label: 'Use a reusable water bottle', category: 'Shopping', saving: '-1.5 kg CO₂e', completed: true },
  { id: '2', label: 'Try a plant-based meal', category: 'Food', saving: '-2.8 kg CO₂e', completed: true },
  { id: '3', label: 'Walk or cycle for short trips', category: 'Transport', saving: '-4.2 kg CO₂e', completed: true },
  { id: '4', label: 'Avoid food waste', category: 'Food', saving: '-3.0 kg CO₂e', completed: true },
  { id: '5', label: 'Use LED bulbs', category: 'Energy', saving: '-1.8 kg CO₂e', completed: false },
  { id: '6', label: 'Choose second-hand', category: 'Shopping', saving: '-2.2 kg CO₂e', completed: false },
  { id: '7', label: 'Take shorter showers', category: 'Home', saving: '-2.0 kg CO₂e', completed: false },
];

const STORAGE_PREFIX = 'greenswap:daily-rituals:v1:';
export const DAILY_RITUALS_CHANGED_EVENT = 'greenswap:daily-rituals-changed';

function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function storageKey(date = new Date()): string {
  return STORAGE_PREFIX + localDateKey(date);
}

/** Read today's completed ritual check-ins, with the existing starter state as fallback. */
export function getDailyRituals(date = new Date()): DailyRitual[] {
  if (typeof window === 'undefined') return DEFAULT_DAILY_RITUALS.map((ritual) => ({ ...ritual }));

  try {
    const raw = window.localStorage.getItem(storageKey(date));
    if (!raw) return DEFAULT_DAILY_RITUALS.map((ritual) => ({ ...ritual }));

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return DEFAULT_DAILY_RITUALS.map((ritual) => ({ ...ritual }));
    }

    const completedById = parsed as Record<string, unknown>;
    return DEFAULT_DAILY_RITUALS.map((ritual) => ({
      ...ritual,
      completed: typeof completedById[ritual.id] === 'boolean'
        ? completedById[ritual.id] as boolean
        : ritual.completed,
    }));
  } catch {
    return DEFAULT_DAILY_RITUALS.map((ritual) => ({ ...ritual }));
  }
}

/** Persist today's checklist and notify other mounted screens in this tab. */
export function saveDailyRituals(rituals: DailyRitual[], date = new Date()): void {
  if (typeof window === 'undefined') return;

  const completionState = Object.fromEntries(
    rituals.map((ritual) => [ritual.id, Boolean(ritual.completed)]),
  );

  try {
    window.localStorage.setItem(storageKey(date), JSON.stringify(completionState));
    window.dispatchEvent(new Event(DAILY_RITUALS_CHANGED_EVENT));
  } catch {
    // Keep the in-page interaction usable if browser storage is unavailable or full.
  }
}

/** True for a storage event that belongs to today's ritual checklist. */
export function isDailyRitualStorageEvent(key: string | null, date = new Date()): boolean {
  return key === storageKey(date);
}
