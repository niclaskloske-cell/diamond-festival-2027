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
 * To go live with Resend (recommended — simple API, good deliverability):
 *   1. `npm i resend`
 *   2. set RESEND_API_KEY + EMAIL_PROVIDER=resend in .env.local
 *   3. verify the sending domain (eventsdiamond.de) with Resend
 *   4. implement `resendProvider.sendEmail` (skeleton below)
 *
 * Any SMTP-based provider works the same way via nodemailer instead.
 */

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
 * TODO(resend): implement once `resend` is installed and RESEND_API_KEY is set.
 *
 *   const resend = new Resend(process.env.RESEND_API_KEY!);
 *   const { error } = await resend.emails.send({
 *     from: "Diamond Festival Kontaktformular <kontakt@eventsdiamond.de>",
 *     to: message.to,
 *     replyTo: message.replyTo,
 *     subject: message.subject,
 *     text: message.text,
 *   });
 *   if (error) throw new EmailError("PROVIDER_ERROR", error.message);
 */
const resendProvider: EmailProvider = {
  id: "resend",
  async sendEmail() {
    throw new EmailError(
      "EMAIL_NOT_CONFIGURED",
      "Resend ist als Anbieter gesetzt, aber noch nicht implementiert (siehe src/lib/email.ts).",
      501,
    );
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
