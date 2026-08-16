import type { Customer } from "@/lib/payments";
import type { FieldErrors } from "@/lib/orders";
import { cn } from "@/lib/utils";

type Field = keyof Customer;

const FIELDS: {
  key: Field;
  label: string;
  type: string;
  autoComplete: string;
  hint?: string;
  full?: boolean;
}[] = [
  { key: "firstName", label: "Vorname", type: "text", autoComplete: "given-name" },
  { key: "lastName", label: "Nachname", type: "text", autoComplete: "family-name" },
  {
    key: "birthDate",
    label: "Geburtsdatum",
    type: "date",
    autoComplete: "bday",
    hint: "Steht auf dem Ticket — Einlass ab 18 Jahren.",
    full: true,
  },
  { key: "email", label: "E-Mail", type: "email", autoComplete: "email", full: true },
  { key: "phone", label: "Telefonnummer", type: "tel", autoComplete: "tel", full: true },
];

export function StepCustomer({
  customer,
  errors,
  onChange,
}: {
  customer: Customer;
  errors: FieldErrors;
  onChange: (field: Field, value: string) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-xl font-extrabold uppercase text-white">
        Deine Daten
      </h3>
      <p className="mt-1 text-sm text-muted">
        Wir brauchen das für deine Tickets und die Bestellbestätigung.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key} className={field.full ? "sm:col-span-2" : undefined}>
            <label
              htmlFor={field.key}
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-muted"
            >
              {field.label}
            </label>
            <input
              id={field.key}
              type={field.type}
              autoComplete={field.autoComplete}
              value={customer[field.key]}
              onChange={(e) => onChange(field.key, e.target.value)}
              aria-invalid={Boolean(errors[field.key])}
              aria-describedby={
                errors[field.key]
                  ? `${field.key}-error`
                  : field.hint
                    ? `${field.key}-hint`
                    : undefined
              }
              className={cn(
                "w-full rounded-md border bg-surface-2 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-faint [color-scheme:dark]",
                errors[field.key]
                  ? "border-danger"
                  : "border-white/12 focus:border-diamond",
              )}
            />
            {errors[field.key] ? (
              <p id={`${field.key}-error`} className="mt-1.5 text-xs text-danger">
                {errors[field.key]}
              </p>
            ) : (
              field.hint && (
                <p id={`${field.key}-hint`} className="mt-1.5 text-xs text-faint">
                  {field.hint}
                </p>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
