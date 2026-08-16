import { NextResponse } from "next/server";

import { getTier, calculateOrderTotals, tierStatus } from "@/data/tickets";
import { validateCustomer, hasErrors } from "@/lib/orders";
import {
  CheckoutError,
  createCheckoutSession,
  type CheckoutRequest,
} from "@/lib/payments";

export const runtime = "nodejs";

/**
 * POST /api/checkout
 *
 * Re-validates everything the client sent (never trust client prices), then
 * delegates to the configured payment provider. Returns 503 while no provider
 * is connected — the UI surfaces that as a real state, not a fake success.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: "INVALID_REQUEST", message: "Ungültiger Request-Body." },
      { status: 400 },
    );
  }

  const { items, customer } = (body ?? {}) as Partial<CheckoutRequest>;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { code: "INVALID_REQUEST", message: "Es wurde kein Ticket ausgewählt." },
      { status: 400 },
    );
  }

  const fieldErrors = validateCustomer(customer ?? {});
  if (hasErrors(fieldErrors)) {
    return NextResponse.json(
      {
        code: "INVALID_REQUEST",
        message: "Bitte prüfe deine Angaben.",
        fieldErrors,
      },
      { status: 422 },
    );
  }

  // Prices come from the server-side catalogue, never from the request body.
  const priced = [];
  for (const item of items) {
    // tierStatus(), not tier.status: a tier whose sale window has closed must
    // be refused even if the buyer still has an old page open.
    const tier = getTier(item.tierId);
    if (!tier || tierStatus(tier) !== "on-sale") {
      return NextResponse.json(
        {
          code: "TIER_UNAVAILABLE",
          message: "Dieses Ticket ist aktuell nicht verfügbar.",
        },
        { status: 409 },
      );
    }
    const quantity = Math.floor(Number(item.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > tier.maxPerOrder) {
      return NextResponse.json(
        {
          code: "INVALID_REQUEST",
          message: `Bitte zwischen 1 und ${tier.maxPerOrder} Tickets wählen.`,
        },
        { status: 422 },
      );
    }
    priced.push({
      tierId: tier.id,
      unitPriceCents: tier.priceCents,
      quantity,
    });
  }

  const origin = new URL(request.url).origin;
  const totals = calculateOrderTotals(
    priced[0].unitPriceCents,
    priced[0].quantity,
  );

  try {
    const session = await createCheckoutSession({
      items: priced,
      customer: customer!,
      successUrl: `${origin}/tickets/success`,
      cancelUrl: `${origin}/tickets`,
      idempotencyKey: request.headers.get("x-idempotency-key") ?? undefined,
    });
    return NextResponse.json({ ...session, totals });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: error.status },
      );
    }
    console.error("[checkout] unexpected error", error);
    return NextResponse.json(
      {
        code: "PROVIDER_ERROR",
        message:
          "Die Zahlung konnte nicht gestartet werden. Bitte versuche es später erneut.",
      },
      { status: 500 },
    );
  }
}
