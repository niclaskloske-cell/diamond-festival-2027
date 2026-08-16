/**
 * Order shape shared by the checkout UI, the API route and (later) the
 * database. Kept provider-agnostic on purpose.
 */

import type { TicketTierId } from "@/data/tickets";
import { festival } from "@/data/festival";
import type { Customer } from "./payments";

export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded";

export type Order = {
  id: string;
  /** Human-readable reference shown on the success page, e.g. "DF27-8KQ4-21". */
  reference: string;
  status: OrderStatus;
  createdAt: string;
  customer: Customer;
  items: {
    tierId: TicketTierId;
    tierName: string;
    unitPriceCents: number;
    quantity: number;
  }[];
  subtotalCents: number;
  feeCents: number;
  totalCents: number;
  /** Populated by the ticketing backend once the QR codes are issued. */
  tickets: { code: string; qrUrl: string | null }[];
};

/**
 * Human-readable order number derived from the provider reference, e.g.
 * "DN26-8KQ4-21XV". The provider id is 60+ characters and unreadable over the
 * phone; this is what the guest sees and quotes to support, while the full
 * reference stays in the QR code and the download.
 *
 * Deterministic on purpose: the same order always yields the same number, so
 * nothing has to be stored to reproduce it.
 */
export function orderNumber(reference: string): string {
  const clean = reference.replace(/^cs_(test|live)_/, "").replace(/[^a-z0-9]/gi, "");
  const tail = clean.slice(-8).toUpperCase().padStart(8, "0");
  return `DN26-${tail.slice(0, 4)}-${tail.slice(4)}`;
}

/* -------------------------------------------------------------------------- */
/* Validation — shared by client (inline field errors) and server (hard gate)  */
/* -------------------------------------------------------------------------- */

export type FieldErrors = Partial<Record<keyof Customer, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[+0][\d\s/()-]{6,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Age on a given day — no library needed for a plain birthday comparison. */
export function ageOn(birthDate: string, reference: Date): number {
  const born = new Date(birthDate);
  let age = reference.getFullYear() - born.getFullYear();
  const monthDiff = reference.getMonth() - born.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && reference.getDate() < born.getDate())) {
    age -= 1;
  }
  return age;
}

export function validateCustomer(input: Partial<Customer>): FieldErrors {
  const errors: FieldErrors = {};

  if (!input.firstName?.trim()) errors.firstName = "Bitte Vornamen angeben.";
  else if (input.firstName.trim().length < 2)
    errors.firstName = "Mindestens 2 Zeichen.";

  if (!input.lastName?.trim()) errors.lastName = "Bitte Nachnamen angeben.";
  else if (input.lastName.trim().length < 2)
    errors.lastName = "Mindestens 2 Zeichen.";

  // Personalised tickets carry the birth date, and the event is 18+ — so the
  // age is checked against the event date, not against today.
  const birthDate = input.birthDate?.trim();
  if (!birthDate) {
    errors.birthDate = "Bitte Geburtsdatum angeben.";
  } else if (!DATE_RE.test(birthDate) || Number.isNaN(new Date(birthDate).getTime())) {
    errors.birthDate = "Bitte ein gültiges Datum angeben.";
  } else {
    const age = ageOn(birthDate, new Date(festival.startsAt));
    if (age < 0 || age > 120) {
      errors.birthDate = "Bitte ein gültiges Datum angeben.";
    } else if (age < 18) {
      errors.birthDate = "Die Diamond Night ist ab 18 Jahren.";
    }
  }

  if (!input.email?.trim()) errors.email = "Bitte E-Mail-Adresse angeben.";
  else if (!EMAIL_RE.test(input.email.trim()))
    errors.email = "Diese E-Mail-Adresse sieht nicht gültig aus.";

  if (!input.phone?.trim()) errors.phone = "Bitte Telefonnummer angeben.";
  else if (!PHONE_RE.test(input.phone.trim()))
    errors.phone = "Bitte eine gültige Telefonnummer angeben.";

  return errors;
}

export const hasErrors = (errors: FieldErrors) =>
  Object.keys(errors).length > 0;
