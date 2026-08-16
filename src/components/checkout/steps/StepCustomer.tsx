import { Copy } from "lucide-react";

import type { Customer, TicketHolder } from "@/lib/payments";
import type { FieldErrors, HolderFieldErrors } from "@/lib/orders";
import { cn } from "@/lib/utils";

type CustomerField = keyof Customer;
type HolderField = keyof TicketHolder;

const CUSTOMER_FIELDS: {
  key: CustomerField;
  label: string;
  type: string;
  autoComplete: string;
  full?: boolean;
}[] = [
  { key: "firstName", label: "Vorname", type: "text", autoComplete: "given-name" },
  { key: "lastName", label: "Nachname", type: "text", autoComplete: "family-name" },
  { key: "email", label: "E-Mail", type: "email", autoComplete: "email", full: true },
  { key: "phone", label: "Telefonnummer", type: "tel", autoComplete: "tel", full: true },
];

const HOLDER_FIELDS: { key: HolderField; label: string; type: string; full?: boolean }[] = [
  { key: "firstName", label: "Vorname", type: "text" },
  { key: "lastName", label: "Nachname", type: "text" },
  { key: "birthDate", label: "Geburtsdatum", type: "date", full: true },
];

export function StepCustomer({
  customer,
  errors,
  onChange,
  holders,
  holderErrors,
  onHolderChange,
}: {
  customer: Customer;
  errors: FieldErrors;
  onChange: (field: CustomerField, value: string) => void;
  holders: TicketHolder[];
  holderErrors: HolderFieldErrors[];
  onHolderChange: (index: number, field: HolderField, value: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-xl font-extrabold uppercase text-white">
          Deine Kontaktdaten
        </h3>
        <p className="mt-1 text-sm text-muted">
          Für die Bestellbestätigung. Muss nicht mit den Ticketinhabern übereinstimmen.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CUSTOMER_FIELDS.map((field) => (
            <div key={field.key} className={field.full ? "sm:col-span-2" : undefined}>
              <label
                htmlFor={`customer-${field.key}`}
                className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-muted"
              >
                {field.label}
              </label>
              <input
                id={`customer-${field.key}`}
                type={field.type}
                autoComplete={field.autoComplete}
                value={customer[field.key]}
                onChange={(e) => onChange(field.key, e.target.value)}
                aria-invalid={Boolean(errors[field.key])}
                aria-describedby={errors[field.key] ? `customer-${field.key}-error` : undefined}
                className={cn(
                  "w-full rounded-md border bg-surface-2 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-faint [color-scheme:dark]",
                  errors[field.key]
                    ? "border-danger"
                    : "border-white/12 focus:border-diamond",
                )}
              />
              {errors[field.key] && (
                <p id={`customer-${field.key}-error`} className="mt-1.5 text-xs text-danger">
                  {errors[field.key]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl font-extrabold uppercase text-white">
          {holders.length === 1 ? "Ticketinhaber" : `Ticketinhaber (${holders.length})`}
        </h3>
        <p className="mt-1 text-sm text-muted">
          Jedes Ticket ist personalisiert — Einlass ab 18 Jahren, bitte Ausweis mitbringen.
        </p>

        <div className="mt-6 space-y-6">
          {holders.map((holder, i) => (
            <HolderFieldset
              key={i}
              index={i}
              holder={holder}
              errors={holderErrors[i] ?? {}}
              onChange={onHolderChange}
              onCopyFromCustomer={
                i === 0 && customer.firstName && customer.lastName
                  ? () => {
                      onHolderChange(0, "firstName", customer.firstName);
                      onHolderChange(0, "lastName", customer.lastName);
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HolderFieldset({
  index,
  holder,
  errors,
  onChange,
  onCopyFromCustomer,
}: {
  index: number;
  holder: TicketHolder;
  errors: HolderFieldErrors;
  onChange: (index: number, field: HolderField, value: string) => void;
  onCopyFromCustomer?: () => void;
}) {
  return (
    <div className="rounded-md border border-white/12 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-diamond-light">
          Ticket {index + 1}
        </span>
        {onCopyFromCustomer && (
          <button
            type="button"
            onClick={onCopyFromCustomer}
            data-cursor="link"
            className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-white"
          >
            <Copy className="size-3" />
            Meine Daten übernehmen
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {HOLDER_FIELDS.map((field) => {
          const id = `holder-${index}-${field.key}`;
          return (
            <div key={field.key} className={field.full ? "sm:col-span-2" : undefined}>
              <label
                htmlFor={id}
                className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-muted"
              >
                {field.label}
              </label>
              <input
                id={id}
                type={field.type}
                value={holder[field.key]}
                onChange={(e) => onChange(index, field.key, e.target.value)}
                aria-invalid={Boolean(errors[field.key])}
                aria-describedby={errors[field.key] ? `${id}-error` : undefined}
                className={cn(
                  "w-full rounded-md border bg-surface-2 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-faint [color-scheme:dark]",
                  errors[field.key]
                    ? "border-danger"
                    : "border-white/12 focus:border-diamond",
                )}
              />
              {errors[field.key] && (
                <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
                  {errors[field.key]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
