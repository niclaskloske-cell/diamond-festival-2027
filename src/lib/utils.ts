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

/** Formats an ISO date ("1998-04-27") as "27.04.1998". Empty input stays empty. */
export function formatDate(isoDate: string) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Two-digit padding for countdown segments. */
export function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/**
 * The public-facing origin a request actually arrived on. Not the same as
 * `new URL(request.url).origin` behind every host: Vercel's edge preserves
 * the real Host header, but Render's proxy forwards to the app with an
 * internal Host like `localhost:10000` — using `request.url` there silently
 * built Stripe redirect URLs pointing at "localhost". `x-forwarded-host` /
 * `x-forwarded-proto` are the standard reverse-proxy headers and are set
 * correctly by both, so they're checked first.
 */
export function resolveOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
    // Can be a comma-separated list when the request passed multiple proxies.
    const host = forwardedHost.split(",")[0].trim();
    const proto = forwardedProto.split(",")[0].trim();
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}
