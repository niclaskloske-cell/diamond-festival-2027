/**
 * Order shape shared by the checkout UI, the API route and (later) the
 * database. Kept provider-agnostic on purpose.
 */

import type { TicketTierId } from "@/data/tickets";
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

/* -------------------------------------------------------------------------- */
/* Validation — shared by client (inline field errors) and server (hard gate)  */
/* -------------------------------------------------------------------------- */

export type FieldErrors = Partial<Record<keyof Customer, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[+0][\d\s/()-]{6,20}$/;

export function validateCustomer(input: Partial<Customer>): FieldErrors {
  const errors: FieldErrors = {};

  if (!input.firstName?.trim()) errors.firstName = "Bitte Vornamen angeben.";
  else if (input.firstName.trim().length < 2)
    errors.firstName = "Mindestens 2 Zeichen.";

  if (!input.lastName?.trim()) errors.lastName = "Bitte Nachnamen angeben.";
  else if (input.lastName.trim().length < 2)
    errors.lastName = "Mindestens 2 Zeichen.";

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
