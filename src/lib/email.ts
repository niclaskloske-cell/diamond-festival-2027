/**
 * EMAIL PROVIDER ABSTRACTION
 * ==========================
 * Mirrors src/lib/payments.ts: the UI/API layer never talks to a mail
 * provider directly, it calls `sendEmail()`, which resolves a provider from
 * configuration and delegates to it.
 *
 * With no provider configured, sending fails loudly with
 * `EMAIL_NOT_CONFIGURED` instead of silently pretending a message went out.
 *
 * Resend is implemented below. To switch it on:
 *   1. verify the domain diamond-night.de in the Resend dashboard
 *   2. set RESEND_API_KEY + EMAIL_PROVIDER=resend in .env.local
 *
 * Any SMTP-based provider works the same way via nodemailer instead.
 */

import { festival } from "@/data/festival";

export type EmailMessage = {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
};

export interface EmailProvider {
  readonly id: string;
  sendEmail(message: EmailMessage): Promise<void>;
}

export type EmailErrorCode = "EMAIL_NOT_CONFIGURED" | "PROVIDER_ERROR";

export class EmailError extends Error {
  constructor(
    readonly code: EmailErrorCode,
    message: string,
    readonly status = 502,
  ) {
    super(message);
    this.name = "EmailError";
  }
}

/** Default provider while no mail service is connected. */
const unconfiguredProvider: EmailProvider = {
  id: "unconfigured",
  async sendEmail() {
    throw new EmailError(
      "EMAIL_NOT_CONFIGURED",
      "Es ist noch kein E-Mail-Versand angebunden. Bitte schreib uns stattdessen direkt eine E-Mail.",
      503,
    );
  },
};

/**
 * Resend. Needs RESEND_API_KEY plus EMAIL_PROVIDER=resend, and the sending
 * domain (diamond-night.de) verified in the Resend dashboard — an unverified
 * domain is rejected at send time, not at deploy time.
 *
 * The client is constructed lazily so a missing key surfaces as a clean
 * "not configured" error instead of throwing while the module loads.
 */
const resendProvider: EmailProvider = {
  id: "resend",
  async sendEmail(message) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new EmailError(
        "EMAIL_NOT_CONFIGURED",
        "RESEND_API_KEY ist nicht gesetzt — der Versand ist noch nicht scharf geschaltet.",
        503,
      );
    }

    const { Resend } = await import("resend");
    const { error } = await new Resend(apiKey).emails.send({
      from: `Diamond Night <${festival.contact.tickets}>`,
      to: message.to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
    });

    if (error) {
      throw new EmailError("PROVIDER_ERROR", error.message);
    }
  },
};

const providers: Record<string, EmailProvider> = {
  unconfigured: unconfiguredProvider,
  resend: resendProvider,
};

export function getEmailProvider(): EmailProvider {
  const key = process.env.EMAIL_PROVIDER ?? "unconfigured";
  return providers[key] ?? unconfiguredProvider;
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  return getEmailProvider().sendEmail(message);
}
