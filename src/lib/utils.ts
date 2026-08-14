/** Tiny class-name joiner. No dependency needed for this project's usage. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const euro = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

/** Formats integer cents as "18,50 €". */
export function formatPrice(cents: number) {
  return euro.format(cents / 100);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Two-digit padding for countdown segments. */
export function pad(n: number) {
  return n.toString().padStart(2, "0");
}
