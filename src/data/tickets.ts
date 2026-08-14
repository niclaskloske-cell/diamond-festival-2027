/**
 * Ticket catalogue. Prices are stored in CENTS (integers) — never floats — so
 * totals stay exact and the values map 1:1 onto Stripe line items later.
 */

export type TicketTierId = "early-bird" | "regular" | "vip";

export type TicketTier = {
  id: TicketTierId;
  name: string;
  /** Price in euro cents. */
  priceCents: number;
  /** Marketing sub-line under the tier name. */
  tagline: string;
  perks: string[];
  /** Visually and functionally the recommended option. */
  featured?: boolean;
  /** Sold out / not yet on sale — disables the buy button with a real state. */
  status: "on-sale" | "sold-out" | "coming-soon";
  /** Max quantity per order, enforced in the checkout flow. */
  maxPerOrder: number;
  /** Shown as a scarcity hint. Set to null when it should not be displayed. */
  note: string | null;
};

export const ticketTiers: TicketTier[] = [
  {
    id: "early-bird",
    name: "EARLY BIRD",
    priceCents: 2000,
    tagline: "Der günstigste Weg rein.",
    perks: [
      "Einlass zur Diamond Night",
      "Zugang zur Sparkassen-Arena Landshut",
      "Streng limitiertes Kontingent",
    ],
    status: "on-sale",
    maxPerOrder: 10,
    note: "Limitiert",
  },
  {
    id: "regular",
    name: "REGULAR",
    priceCents: 2500,
    tagline: "Das Standard-Ticket für den Abend.",
    perks: [
      "Einlass zur Diamond Night",
      "Zugang zur Sparkassen-Arena Landshut",
    ],
    featured: true,
    status: "on-sale",
    maxPerOrder: 10,
    note: null,
  },
  {
    id: "vip",
    name: "VIP",
    priceCents: 6500,
    tagline: "Meet & Greet mit Muhabbet inklusive.",
    perks: [
      "Alles aus Regular",
      "Meet & Greet mit Muhabbet",
      "Bevorzugter Einlass",
      "Beste Sichtkategorie im Haus",
    ],
    status: "on-sale",
    maxPerOrder: 6,
    note: "Stark limitiert",
  },
];

export const getTier = (id: TicketTierId): TicketTier | undefined =>
  ticketTiers.find((t) => t.id === id);

/** Service fee model. TODO: confirm with the ticketing provider before launch. */
export const FEE_PERCENT = 0;
export const FEE_FIXED_CENTS = 0;

export function calculateOrderTotals(priceCents: number, quantity: number) {
  const subtotalCents = priceCents * quantity;
  const feeCents =
    Math.round((subtotalCents * FEE_PERCENT) / 100) + FEE_FIXED_CENTS * quantity;
  return {
    subtotalCents,
    feeCents,
    totalCents: subtotalCents + feeCents,
  };
}
