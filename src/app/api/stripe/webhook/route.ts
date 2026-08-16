import { NextResponse } from "next/server";

import { ensureTicketsForSession } from "@/lib/ticketing";

export const runtime = "nodejs";

/**
 * POST /api/stripe/webhook
 *
 * Stripe meldet hier abgeschlossene Zahlungen. Das ist der verlässliche Weg,
 * Tickets auszustellen: die Rückleitung auf die Bestätigungsseite kann
 * ausbleiben, wenn jemand den Browser schließt — der Webhook kommt trotzdem.
 *
 * Einrichtung:
 *   1. Endpoint in Stripe anlegen (Ereignis: checkout.session.completed)
 *   2. STRIPE_WEBHOOK_SECRET in .env.local setzen
 *   Lokal testen: stripe listen --forward-to localhost:3000/api/stripe/webhook
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!secret || !stripeKey) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET oder STRIPE_SECRET_KEY fehlt");
    return NextResponse.json({ error: "Webhook nicht konfiguriert." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signatur fehlt." }, { status: 400 });
  }

  // Rohtext, nicht das geparste JSON: die Signatur gilt für exakt diese Bytes.
  const payload = await request.text();

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(stripeKey);

  let event: import("stripe").Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    // Ungültige Signatur heißt: der Aufruf kam nicht von Stripe.
    console.error("[stripe-webhook] Signaturprüfung fehlgeschlagen", error);
    return NextResponse.json({ error: "Signatur ungültig." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // Quittieren, sonst versucht Stripe es endlos erneut.
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const session = event.data.object as import("stripe").Stripe.Checkout.Session;

  try {
    const issued = await ensureTicketsForSession(session.id);
    if (!issued) {
      console.warn("[stripe-webhook] Session ist nicht als bezahlt geführt", session.id);
      return NextResponse.json({ received: true, issued: 0 });
    }
    console.info(
      `[stripe-webhook] ${issued.tickets.length} Ticket(s) ausgestellt für ${session.id}`,
    );
    return NextResponse.json({ received: true, issued: issued.tickets.length });
  } catch (error) {
    // 500 zurückgeben, damit Stripe es erneut zustellt — die Ausgabe ist
    // idempotent, ein zweiter Versuch erzeugt keine doppelten Tickets.
    console.error("[stripe-webhook] Ticketausgabe fehlgeschlagen", error);
    return NextResponse.json({ error: "Ticketausgabe fehlgeschlagen." }, { status: 500 });
  }
}
