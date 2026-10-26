/**
 * Normalize a CO₂e value to kilograms.
 *
 * Untagged numeric values below 10 are assumed to be tonnes for legacy swap
 * records. Values with explicit units always take precedence, so "1.5 kg"
 * remains 1.5 kg while "1.5 tonne" becomes 1500 kg.
 *
 * Pass known kilogram values with an explicit "kg" suffix when normalizing
 * computed values, because emission factors can legitimately be less than 10.
 */
export function parseCO2ToKg(value: unknown): number {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return 0;
    return value >= 0 && value < 10 ? value * 1000 : value;
  }

  if (typeof value !== "string" || value.trim() === "") return 0;

  const normalized = value.trim().replace(/,/g, "");
  const numberMatch = normalized.match(/[+-]?(?:\d+(?:\.\d*)?|\.\d+)/);
  if (!numberMatch) return 0;

  const amount = Number(numberMatch[0]);
  if (!Number.isFinite(amount)) return 0;

  // Explicit tonne units, including common "t CO2e" and "tonnes/month" forms.
  if (
    /\b(?:metric\s*)?tonnes?\b/i.test(normalized) ||
    /\btons?\b/i.test(normalized) ||
    /\d(?:\.\d+)?\s*t\b/i.test(normalized)
  ) {
    return amount * 1000;
  }

  // Explicit kilogram values should never be re-interpreted as tonnes.
  if (/\bkg\b/i.test(normalized) || /\bkilograms?\b/i.test(normalized)) {
    return amount;
  }

  // Convert grams into kilograms.
  if (/\b(?:grams?|g)\b/i.test(normalized)) {
    return amount / 1000;
  }

  // Legacy unit-less strings follow the same assumption as unit-less numbers.
  return amount >= 0 && amount < 10 ? amount * 1000 : amount;
}
