/**
 * Ticket catalogue. Prices are stored in CENTS (integers) — never floats — so
 * totals stay exact and the values map 1:1 onto Stripe line items later.
 *
 * Order is ascending by price, which is also the order the checkout list and
 * the ticket page grid render in.
 */

export type TicketTierId = "early-bird" | "ermaessigt" | "regular" | "vip";

/** "closed" is derived from `availableUntil`, never set by hand. */
export type TicketStatus = "on-sale" | "sold-out" | "coming-soon" | "closed";

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
  /** Manual state. Flip to "sold-out" when a contingent is gone. */
  status: Exclude<TicketStatus, "closed">;
  /**
   * Sale deadline. Once it passes, `tierStatus()` reports "closed" and the
   * API refuses the tier — no manual switch-off needed.
   */
  availableUntil?: string;
  /**
   * Size of the contingent, where one exists. Display only: there is no stock
   * tracking yet, so a sold-out tier still has to be flipped by hand.
   */
  capacity?: number;
  /** Max quantity per order, enforced in the checkout flow. */
  maxPerOrder: number;
  /** Shown as a scarcity hint. Set to null when it should not be displayed. */
  note: string | null;
  /**
   * Set when the ticket is only valid together with proof of eligibility at
   * the door. Surfaced on the card, in the checkout and in the compare table.
   */
  proofRequired?: boolean;
};

/** Groups that qualify for the reduced ticket (confirmed 2026-08-16). */
export const REDUCED_ELIGIBILITY =
  "Studierende und Menschen mit Behinderung";

/** What happens when someone turns up without valid proof. */
export const REDUCED_NO_PROOF_RULE =
  "Ohne gültigen Nachweis ist das ermäßigte Ticket am Einlass ungültig — dann muss vor Ort ein Regular-Ticket gekauft werden.";

/** How the ticket reaches the buyer after a completed purchase. */
export const TICKET_DELIVERY =
  "Dein Ticket kommt direkt nach dem Kauf als PDF per E-Mail — dazu eine Wallet-Datei für Apple und Google Wallet.";

export const ticketTiers: TicketTier[] = [
  {
    id: "early-bird",
    name: "EARLY BIRD",
    priceCents: 1990,
    tagline: "Der günstigste Weg rein.",
    perks: [
      "Einlass zur Diamond Night",
      "Muhabbet live plus komplettes Vorprogramm",
      "Nur bis zum 15.10.2026 erhältlich",
    ],
    status: "on-sale",
    // Sale window ends after 15.10.2026 (CEST). Enforced by tierStatus().
    availableUntil: "2026-10-15T23:59:59+02:00",
    maxPerOrder: 10,
    note: "Nur bis 15.10.2026",
  },
  {
    id: "ermaessigt",
    name: "ERMÄSSIGT",
    priceCents: 1990,
    tagline: "Vergünstigt — nur mit gültigem Nachweis.",
    perks: [
      "Einlass zur Diamond Night",
      "Muhabbet live plus komplettes Vorprogramm",
      "Nachweis am Einlass erforderlich",
    ],
    status: "on-sale",
    maxPerOrder: 4,
    note: "Nur mit Nachweis",
    proofRequired: true,
  },
  {
    id: "regular",
    name: "REGULAR",
    priceCents: 2490,
    tagline: "Das Standard-Ticket für den Abend.",
    perks: [
      "Einlass zur Diamond Night",
      "Muhabbet live plus komplettes Vorprogramm",
      "Kein Nachweis nötig, freie Platzwahl im Stehbereich",
    ],
    featured: true,
    status: "on-sale",
    maxPerOrder: 10,
    note: null,
  },
  {
    id: "vip",
    name: "VIP",
    priceCents: 6490,
    tagline: "VIP-Bereich und Meet & Greet mit Muhabbet.",
    perks: [
      "Alles aus Regular",
      "Zugang zum VIP-Bereich",
      "Meet & Greet mit Muhabbet",
      "Bevorzugter Einlass",
      "Beste Sichtkategorie im Haus",
    ],
    status: "on-sale",
    capacity: 70,
    maxPerOrder: 6,
    note: "Nur 70 Tickets",
  },
];

export const getTier = (id: TicketTierId): TicketTier | undefined =>
  ticketTiers.find((t) => t.id === id);

/**
 * Effective status at a point in time. Always go through this instead of
 * reading `tier.status` — it is what closes the Early Bird after its deadline,
 * and `/api/checkout` uses the same function so an expired tier cannot be
 * bought through a stale page.
 */
export function tierStatus(tier: TicketTier, now: Date = new Date()): TicketStatus {
  if (tier.status !== "on-sale") return tier.status;
  if (tier.availableUntil && now.getTime() > new Date(tier.availableUntil).getTime()) {
    return "closed";
  }
  return "on-sale";
}

export type TicketStatusMap = Record<TicketTierId, TicketStatus>;

/**
 * Statuses for every tier, resolved once on the server and passed into the
 * client components — so the markup React hydrates cannot disagree with the
 * markup the server sent.
 */
export function currentTicketStatuses(now: Date = new Date()): TicketStatusMap {
  return Object.fromEntries(
    ticketTiers.map((tier) => [tier.id, tierStatus(tier, now)]),
  ) as TicketStatusMap;
}

/**
 * Cheapest tier a buyer without any proof of eligibility can actually get —
 * this drives the "ab X €" copy and the default tier in the closing CTA.
 * Reduced tickets are excluded on purpose: advertising their price as the
 * entry price would understate what most people pay.
 */
export function cheapestAvailableTier(now: Date = new Date()): TicketTier {
  const open = ticketTiers.filter(
    (t) => !t.proofRequired && tierStatus(t, now) === "on-sale",
  );
  const pool = open.length > 0 ? open : ticketTiers.filter((t) => !t.proofRequired);
  return pool.reduce((min, t) => (t.priceCents < min.priceCents ? t : min), pool[0]);
}

/* -------------------------------------------------------------------------- */
/* Comparison matrix                                                           */
/* -------------------------------------------------------------------------- */

/** `true`/`false` renders a check/dash, a string renders as text. */
export type TicketFeatureValue = boolean | string;

export type TicketFeature = {
  id: string;
  label: string;
  values: Record<TicketTierId, TicketFeatureValue>;
};

/** Row model for the compare table on the ticket page. */
export const ticketComparison: TicketFeature[] = [
  {
    id: "einlass",
    label: "Einlass zur Diamond Night",
    values: { "early-bird": true, ermaessigt: true, regular: true, vip: true },
  },
  {
    id: "programm",
    label: "Muhabbet live plus Vorprogramm",
    values: { "early-bird": true, ermaessigt: true, regular: true, vip: true },
  },
  {
    id: "vip-bereich",
    label: "Zugang zum VIP-Bereich",
    values: { "early-bird": false, ermaessigt: false, regular: false, vip: true },
  },
  {
    id: "meet-greet",
    label: "Meet & Greet mit Muhabbet",
    values: { "early-bird": false, ermaessigt: false, regular: false, vip: true },
  },
  {
    id: "einlass-bevorzugt",
    label: "Bevorzugter Einlass",
    values: { "early-bird": false, ermaessigt: false, regular: false, vip: true },
  },
  {
    id: "sicht",
    label: "Beste Sichtkategorie im Haus",
    values: { "early-bird": false, ermaessigt: false, regular: false, vip: true },
  },
  {
    id: "nachweis",
    label: "Nachweis am Einlass nötig",
    values: {
      "early-bird": false,
      ermaessigt: "Ja",
      regular: false,
      vip: false,
    },
  },
  {
    id: "verfuegbarkeit",
    label: "Verfügbarkeit",
    values: {
      "early-bird": "bis 15.10.2026",
      ermaessigt: "unbegrenzt",
      regular: "unbegrenzt",
      vip: "70 Tickets",
    },
  },
  {
    id: "max",
    label: "Maximal pro Bestellung",
    values: {
      "early-bird": "10",
      ermaessigt: "4",
      regular: "10",
      vip: "6",
    },
  },
];

/**
 * Diamond Events charges no service fee of its own. Whatever the payment
 * provider adds is shown by the provider at the payment step, so it is not
 * modelled here.
 */
export const FEE_PERCENT = 0;
export const FEE_FIXED_CENTS = 0;
export const FEE_NOTE =
  "Wir erheben keine eigene Servicegebühr. Gebühren des jeweiligen Zahlungsanbieters können hinzukommen und werden vor dem Bezahlen angezeigt.";

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
