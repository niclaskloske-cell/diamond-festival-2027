import { NextResponse } from "next/server";

import { getPaidOrder } from "@/lib/payments";
import { issueTickets } from "@/lib/ticketing";
import { orderNumber } from "@/lib/orders";
import { generateTicketsPdf } from "@/lib/ticketPdf";

export const runtime = "nodejs";

/**
 * GET /api/tickets/pdf?order=<Stripe-Session-ID>
 *
 * Erzeugt das Ticket-PDF live bei jedem Aufruf — nichts liegt vorgehalten auf
 * der Platte. Wie die Bestätigungsseite selbst vertraut das nur der
 * Zahlungsbestätigung von Stripe, nie Angaben aus der URL: `getPaidOrder`
 * liest die Bestellung serverseitig zurück, `issueTickets` ist idempotent —
 * ein erneuter Aufruf für dieselbe Bestellung liefert dieselben Codes.
 */
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("order");
  if (!sessionId) {
    return NextResponse.json({ error: "Fehlender Parameter 'order'." }, { status: 400 });
  }

  const order = await getPaidOrder(sessionId);
  if (!order) {
    return NextResponse.json({ error: "Keine bezahlte Bestellung gefunden." }, { status: 404 });
  }

  let tickets;
  try {
    tickets = await issueTickets(order);
  } catch (error) {
    console.error("[tickets/pdf] Ticketausgabe fehlgeschlagen", error);
    return NextResponse.json(
      { error: "Die Tickets sind noch nicht bereit. Bitte versuche es gleich erneut." },
      { status: 503 },
    );
  }

  const num = orderNumber(order.reference);
  const pdfBytes = await generateTicketsPdf(order, num, tickets);

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="diamond-night-${num}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
