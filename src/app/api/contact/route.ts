import { NextResponse } from "next/server";

import { festival } from "@/data/festival";
import { validateContact, hasContactErrors } from "@/lib/contact";
import { sendEmail, EmailError } from "@/lib/email";

export const runtime = "nodejs";

/**
 * POST /api/contact
 *
 * Validates the message server-side (never trust the client), then sends it
 * to festival.contact.email via the configured email provider. Returns 503
 * while no provider is connected — the form surfaces that as a real state,
 * not a fake "sent" confirmation.
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

  const input = (body ?? {}) as Record<string, unknown>;
  const fieldErrors = validateContact({
    name: typeof input.name === "string" ? input.name : undefined,
    email: typeof input.email === "string" ? input.email : undefined,
    message: typeof input.message === "string" ? input.message : undefined,
  });

  if (hasContactErrors(fieldErrors)) {
    return NextResponse.json(
      { code: "INVALID_REQUEST", message: "Bitte prüfe deine Angaben.", fieldErrors },
      { status: 422 },
    );
  }

  const name = (input.name as string).trim();
  const email = (input.email as string).trim();
  const message = (input.message as string).trim();

  try {
    await sendEmail({
      to: festival.contact.email,
      replyTo: email,
      subject: `Kontaktformular: Nachricht von ${name}`,
      text: `Von: ${name} <${email}>\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof EmailError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: error.status },
      );
    }
    console.error("[contact] unexpected error", error);
    return NextResponse.json(
      {
        code: "PROVIDER_ERROR",
        message: "Deine Nachricht konnte nicht gesendet werden. Bitte versuche es später erneut.",
      },
      { status: 500 },
    );
  }
}
