/**
 * TICKET-AUSGABE
 * ==============
 * Verkauft wird hier, aber die Wahrheit über gültige Tickets liegt in der
 * Eventplattform: dort scannt die Security am Einlass. Nach einer bezahlten
 * Bestellung meldet dieser Shop sie über die Ticket-API dorthin und bekommt
 * die Codes zurück, die in die QR-Codes wandern.
 *
 * Idempotent auf beiden Seiten: derselbe `paymentReference` erzeugt niemals
 * einen zweiten Satz Codes — egal ob der Aufruf vom Stripe-Webhook oder von
 * der Bestätigungsseite kommt.
 */

import { festival } from "@/data/festival";
import { orderNumber } from "@/lib/orders";
import { getPaidOrder, type PaidOrderSummary } from "@/lib/payments";
import { getTier } from "@/data/tickets";

export type IssuedTicket = { code: string; position: number };

export class TicketingError extends Error {
  constructor(
    readonly code: "NOT_CONFIGURED" | "PLATFORM_ERROR",
    message: string,
  ) {
    super(message);
    this.name = "TicketingError";
  }
}

/** Slug der Veranstaltung in der Eventplattform. */
export const PLATFORM_EVENT_SLUG =
  process.env.PLATFORM_EVENT_SLUG ?? "diamond-night-2026";

/**
 * Meldet eine bezahlte Bestellung an die Plattform und liefert die Ticketcodes.
 * Wirft nicht, wenn die Tickets schon existieren — die API gibt dann dieselben
 * Codes zurück.
 */
export async function issueTickets(
  order: PaidOrderSummary,
): Promise<IssuedTicket[]> {
  const baseUrl = process.env.PLATFORM_API_URL;
  const token = process.env.TICKET_API_TOKEN;

  if (!baseUrl || !token) {
    throw new TicketingError(
      "NOT_CONFIGURED",
      "PLATFORM_API_URL oder TICKET_API_TOKEN fehlt — Tickets können nicht ausgestellt werden.",
    );
  }

  const tier = getTier(order.tierId);
  const response = await fetch(`${baseUrl}/api/tickets/issue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      paymentReference: order.reference,
      orderNumber: orderNumber(order.reference),
      eventSlug: PLATFORM_EVENT_SLUG,
      tierId: order.tierId,
      tierName: order.tierName,
      quantity: order.quantity,
      // Käufer/in — die Person, die am Ticket steht, kommt aus `holders`.
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
      phone: order.phone || undefined,
      totalCents: (tier?.priceCents ?? 0) * order.quantity,
      holders: order.holders,
    }),
    // Der Einlass hängt daran: lieber laut scheitern als stumm hängen.
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new TicketingError(
      "PLATFORM_ERROR",
      `Plattform antwortete mit ${response.status}: ${detail.slice(0, 300)}`,
    );
  }

  const data = (await response.json()) as { tickets?: IssuedTicket[] };
  if (!Array.isArray(data.tickets) || data.tickets.length === 0) {
    throw new TicketingError("PLATFORM_ERROR", "Plattform lieferte keine Ticketcodes.");
  }
  return data.tickets;
}

/**
 * Holt die bezahlte Bestellung beim Zahlungsanbieter und stellt die Tickets
 * aus. Rückgabe `null`, wenn die Session nicht bezahlt ist — dann gibt es
 * nichts auszustellen.
 */
export async function ensureTicketsForSession(sessionId: string): Promise<{
  order: PaidOrderSummary;
  tickets: IssuedTicket[];
} | null> {
  const order = await getPaidOrder(sessionId);
  if (!order) return null;

  const tickets = await issueTickets(order);
  return { order, tickets };
}

/** Was im QR-Code steht. Bewusst nur der Code — kein Name, kein Geburtsdatum. */
export function qrPayload(code: string): string {
  return code;
}

export const EVENT_LABEL = `${festival.name} · ${festival.dateLabelShort}`;
