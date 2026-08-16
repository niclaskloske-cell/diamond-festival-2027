import type { TicketTier } from "@/data/tickets";
import type { Customer, TicketHolder } from "@/lib/payments";
import { formatDate, formatPrice } from "@/lib/utils";

export function StepSummary({
  tier,
  quantity,
  customer,
  holders,
  subtotalCents,
  feeCents,
  totalCents,
}: {
  tier: TicketTier;
  quantity: number;
  customer: Customer;
  holders: TicketHolder[];
  subtotalCents: number;
  feeCents: number;
  totalCents: number;
}) {
  return (
    <div>
      <h3 className="font-display text-xl font-extrabold uppercase text-white">
        Übersicht
      </h3>
      <p className="mt-1 text-sm text-muted">Bitte prüfe deine Bestellung.</p>

      <div className="mt-6 divide-y divide-white/10 rounded-md border border-white/10 bg-surface-2">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-semibold text-white">{tier.name}</p>
            <p className="text-xs text-muted">
              {quantity} × {formatPrice(tier.priceCents)}
            </p>
          </div>
          <p className="font-display text-lg font-extrabold text-white">
            {formatPrice(subtotalCents)}
          </p>
        </div>
        {feeCents > 0 && (
          <div className="flex items-center justify-between p-4 text-sm text-muted">
            <span>Servicegebühr</span>
            <span>{formatPrice(feeCents)}</span>
          </div>
        )}
        <div className="flex items-center justify-between p-4">
          <span className="text-sm font-semibold text-white">Gesamt</span>
          <span className="font-display text-2xl font-extrabold text-diamond-light">
            {formatPrice(totalCents)}
          </span>
        </div>
      </div>

      {tier.proofRequired && (
        <p className="mt-4 rounded-md border border-diamond/30 bg-diamond/10 p-4 text-xs leading-relaxed text-diamond-light">
          Ermäßigtes Ticket: Bitte bring einen gültigen Nachweis mit — ohne
          Nachweis ist das Ticket am Einlass nicht gültig.
        </p>
      )}

      <div className="mt-4 rounded-md border border-white/10 bg-surface-2 p-4 text-sm text-muted">
        <p className="font-semibold text-white">Kontakt</p>
        <p>
          {customer.firstName} {customer.lastName}
        </p>
        <p>{customer.email}</p>
        <p>{customer.phone}</p>
      </div>

      <div className="mt-4 divide-y divide-white/10 rounded-md border border-white/10 bg-surface-2">
        {holders.map((holder, i) => (
          <div key={i} className="flex items-baseline justify-between p-4 text-sm">
            <span className="text-faint">Ticket {i + 1}</span>
            <span className="text-right text-white">
              {holder.firstName} {holder.lastName}
              {holder.birthDate && (
                <span className="ml-2 text-muted">geb. {formatDate(holder.birthDate)}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
