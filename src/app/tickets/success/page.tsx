import type { Metadata } from "next";
import QRCode from "qrcode";

import { SuccessExperience } from "@/components/sections/success/SuccessExperience";
import { EmptyOrderState } from "@/components/sections/success/EmptyOrderState";
import { orderNumber } from "@/lib/orders";
import { getPaidOrder } from "@/lib/payments";
import { issueTickets, qrPayload } from "@/lib/ticketing";

export const metadata: Metadata = { title: "Bestellbestätigung", robots: { index: false } };

type SearchParams = Promise<{ order?: string }>;

/**
 * Reached after the payment provider redirects back (`successUrl` in
 * src/lib/payments.ts). The session id from the URL is the only thing trusted
 * here — the order is read back from the provider and rendered only if it is
 * actually paid, so a hand-crafted URL cannot produce a confirmation.
 *
 * Tickets are issued here as well as in the Stripe webhook. Both paths are
 * idempotent, and doing it here puts the codes on screen immediately instead
 * of waiting for the webhook to land.
 */
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { order: sessionId } = await searchParams;
  const order = sessionId ? await getPaidOrder(sessionId) : null;
  if (!order) return <EmptyOrderState />;

  // Bezahlt ist bezahlt: wenn die Plattform gerade nicht erreichbar ist, zeigt
  // die Seite die Bestellung trotzdem an und weist auf die Nachlieferung hin.
  // Der Webhook stellt die Tickets dann später aus.
  let tickets: { code: string; position: number }[] = [];
  try {
    tickets = await issueTickets(order);
  } catch (error) {
    console.error("[success] Ticketausgabe fehlgeschlagen", error);
  }

  const codes = await Promise.all(
    tickets.map(async (ticket) => ({
      code: ticket.code,
      position: ticket.position,
      qrSvg: await QRCode.toString(qrPayload(ticket.code), {
        type: "svg",
        errorCorrectionLevel: "M",
        margin: 0,
        color: { dark: "#050505", light: "#ffffff" },
      }),
    })),
  );

  return (
    <SuccessExperience
      order={order}
      orderNumber={orderNumber(order.reference)}
      tickets={codes}
    />
  );
}
