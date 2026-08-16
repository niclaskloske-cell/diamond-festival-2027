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
 * Stripe is implemented below (card, PayPal, Klarna). To switch it on:
 *   1. activate card, PayPal and Klarna in the Stripe dashboard
 *   2. set STRIPE_SECRET_KEY + PAYMENT_PROVIDER=stripe in .env.local
 *
 * Still missing for a full ticketing flow: a webhook that persists a paid
 * session as an Order, and e-ticket generation (PDF + wallet pass). Until
 * those exist, a paid session is only ever read back live from Stripe.
 */

import { getTier, type TicketTierId } from "@/data/tickets";
import { festival } from "@/data/festival";

/* -------------------------------------------------------------------------- */
/* Contracts                                                                   */
/* -------------------------------------------------------------------------- */

export type Customer = {
  firstName: string;
  lastName: string;
  /** ISO date, "YYYY-MM-DD". Printed on the ticket and checked against the 18+ rule. */
  birthDate: string;
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

/** What the confirmation page and the ticket issuing need, read back from the provider. */
export type PaidOrderSummary = {
  /** Provider-side id — the idempotency key for issuing tickets. */
  reference: string;
  tierId: TicketTierId;
  tierName: string;
  quantity: number;
  firstName: string;
  lastName: string;
  /** ISO date as collected at checkout. */
  birthDate: string;
  email: string;
  phone: string;
};

export interface PaymentProvider {
  readonly id: string;
  createCheckoutSession(req: CheckoutRequest): Promise<CheckoutSession>;
  /**
   * Looks a finished session up and returns it only if it was actually paid.
   * The confirmation page uses this instead of trusting query parameters —
   * otherwise anyone could hand-craft a "your order is confirmed" URL.
   */
  getPaidOrder?(sessionId: string): Promise<PaidOrderSummary | null>;
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
 * Payment methods offered on the hosted Stripe page. Each one has to be
 * activated in the Stripe dashboard as well — Stripe rejects the session
 * outright if a listed method is not enabled on the account.
 */
const STRIPE_PAYMENT_METHODS = ["card", "paypal", "klarna"] as const;

/** Loads the SDK lazily so a missing key fails cleanly instead of at import. */
async function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new CheckoutError(
      "PAYMENT_NOT_CONFIGURED",
      "STRIPE_SECRET_KEY ist nicht gesetzt — der Ticketverkauf ist noch nicht scharf geschaltet.",
      503,
    );
  }
  const { default: Stripe } = await import("stripe");
  return new Stripe(key);
}

const stripeProvider: PaymentProvider = {
  id: "stripe",

  async createCheckoutSession(req) {
    const stripe = await stripeClient();
    const first = req.items[0];
    const tier = getTier(first.tierId);

    try {
      const session = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          locale: "de",
          payment_method_types: [...STRIPE_PAYMENT_METHODS],
          line_items: req.items.map((item) => ({
            quantity: item.quantity,
            price_data: {
              currency: "eur",
              unit_amount: item.unitPriceCents,
              product_data: {
                name: `${festival.name} — ${getTier(item.tierId)?.name ?? item.tierId}`,
                description: `${festival.dateLabel} · ${festival.location.venue}`,
              },
            },
          })),
          customer_email: req.customer.email,
          // Read back by the confirmation page — never trust the query string.
          metadata: {
            tierId: first.tierId,
            tierName: tier?.name ?? first.tierId,
            quantity: String(first.quantity),
            firstName: req.customer.firstName,
            lastName: req.customer.lastName,
            birthDate: req.customer.birthDate,
            phone: req.customer.phone,
          },
          success_url: `${req.successUrl}?order={CHECKOUT_SESSION_ID}`,
          cancel_url: req.cancelUrl,
        },
        req.idempotencyKey ? { idempotencyKey: req.idempotencyKey } : undefined,
      );

      if (!session.url) {
        throw new CheckoutError(
          "PROVIDER_ERROR",
          "Stripe hat keine Zahlungsseite zurückgegeben.",
          502,
        );
      }

      return { sessionId: session.id, redirectUrl: session.url };
    } catch (error) {
      if (error instanceof CheckoutError) throw error;
      // The raw Stripe message can name inactive payment methods or key
      // problems — useful in the log, not on the customer's screen.
      console.error("[stripe] createCheckoutSession failed", error);
      throw new CheckoutError(
        "PROVIDER_ERROR",
        "Die Zahlung konnte nicht gestartet werden. Bitte versuche es später erneut.",
        502,
      );
    }
  },

  async getPaidOrder(sessionId) {
    try {
      // Inside the try on purpose: a missing key throws here, and this lookup
      // must degrade to "no order" rather than crashing the page.
      const stripe = await stripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") return null;

      const meta = session.metadata ?? {};
      const quantity = Number(meta.quantity ?? "0");
      if (!Number.isFinite(quantity) || quantity < 1) return null;

      const tierId = meta.tierId as TicketTierId | undefined;
      if (!tierId || !getTier(tierId)) return null;

      return {
        reference: session.id,
        tierId,
        tierName: meta.tierName ?? "",
        quantity,
        firstName: meta.firstName ?? "",
        lastName: meta.lastName ?? "",
        birthDate: meta.birthDate ?? "",
        email: session.customer_email ?? "",
        phone: meta.phone ?? "",
      };
    } catch (error) {
      console.error("[stripe] getPaidOrder failed", error);
      return null;
    }
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

/**
 * Verified order lookup for the confirmation page. Returns null whenever the
 * provider cannot vouch for the payment — including when none is configured.
 */
export async function getPaidOrder(
  sessionId: string,
): Promise<PaidOrderSummary | null> {
  const provider = getPaymentProvider();
  if (!provider.getPaidOrder) return null;
  return provider.getPaidOrder(sessionId);
}
