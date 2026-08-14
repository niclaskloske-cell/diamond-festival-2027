/**
 * PAYMENT ABSTRACTION
 * ===================
 * The UI never talks to a payment provider directly. It calls
 * `POST /api/checkout`, which resolves a `PaymentProvider` from configuration
 * and delegates to it.
 *
 * Nothing here fakes a payment. With no provider configured, checkout fails
 * loudly with `PAYMENT_NOT_CONFIGURED` and the UI shows a real, honest state.
 *
 * To go live:
 *   1. `npm i stripe`
 *   2. set STRIPE_SECRET_KEY + PAYMENT_PROVIDER=stripe in .env.local
 *   3. implement `stripeProvider.createCheckoutSession` (skeleton below)
 *   4. add the webhook route that turns a paid session into an Order
 */

import type { TicketTierId } from "@/data/tickets";

/* -------------------------------------------------------------------------- */
/* Contracts                                                                   */
/* -------------------------------------------------------------------------- */

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type CheckoutLineItem = {
  tierId: TicketTierId;
  /** Snapshot of the price at purchase time, in cents. */
  unitPriceCents: number;
  quantity: number;
};

export type CheckoutRequest = {
  items: CheckoutLineItem[];
  customer: Customer;
  /** Absolute URLs the provider redirects back to. */
  successUrl: string;
  cancelUrl: string;
  /** Optional idempotency key so a double-submit cannot double-charge. */
  idempotencyKey?: string;
};

export type CheckoutSession = {
  /** Provider-side session id, stored on the order. */
  sessionId: string;
  /** Hosted payment page to redirect the customer to. */
  redirectUrl: string;
};

export interface PaymentProvider {
  readonly id: string;
  createCheckoutSession(req: CheckoutRequest): Promise<CheckoutSession>;
}

/* -------------------------------------------------------------------------- */
/* Errors                                                                      */
/* -------------------------------------------------------------------------- */

export type CheckoutErrorCode =
  | "PAYMENT_NOT_CONFIGURED"
  | "INVALID_REQUEST"
  | "TIER_UNAVAILABLE"
  | "PROVIDER_ERROR";

export class CheckoutError extends Error {
  constructor(
    readonly code: CheckoutErrorCode,
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}

/* -------------------------------------------------------------------------- */
/* Providers                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Default provider while no payment system is connected. It refuses to create a
 * session rather than pretending one exists.
 */
const unconfiguredProvider: PaymentProvider = {
  id: "unconfigured",
  async createCheckoutSession() {
    throw new CheckoutError(
      "PAYMENT_NOT_CONFIGURED",
      "Es ist noch kein Zahlungsanbieter angebunden. Der Ticketverkauf startet, sobald die Zahlungsabwicklung freigeschaltet ist.",
      503,
    );
  },
};

/**
 * TODO(stripe): implement once `stripe` is installed and keys are set.
 *
 *   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
 *   const session = await stripe.checkout.sessions.create({
 *     mode: "payment",
 *     line_items: req.items.map((i) => ({
 *       quantity: i.quantity,
 *       price_data: {
 *         currency: "eur",
 *         unit_amount: i.unitPriceCents,
 *         product_data: { name: `Diamond Festival 2027 — ${i.tierId}` },
 *       },
 *     })),
 *     customer_email: req.customer.email,
 *     success_url: `${req.successUrl}?order={CHECKOUT_SESSION_ID}`,
 *     cancel_url: req.cancelUrl,
 *   }, { idempotencyKey: req.idempotencyKey });
 *   return { sessionId: session.id, redirectUrl: session.url! };
 */
const stripeProvider: PaymentProvider = {
  id: "stripe",
  async createCheckoutSession() {
    throw new CheckoutError(
      "PAYMENT_NOT_CONFIGURED",
      "Stripe ist als Anbieter gesetzt, aber noch nicht implementiert (siehe src/lib/payments.ts).",
      501,
    );
  },
};

const providers: Record<string, PaymentProvider> = {
  unconfigured: unconfiguredProvider,
  stripe: stripeProvider,
};

export function getPaymentProvider(): PaymentProvider {
  const key = process.env.PAYMENT_PROVIDER ?? "unconfigured";
  return providers[key] ?? unconfiguredProvider;
}

/** Server-side entry point used by the API route. */
export async function createCheckoutSession(
  req: CheckoutRequest,
): Promise<CheckoutSession> {
  return getPaymentProvider().createCheckoutSession(req);
}
