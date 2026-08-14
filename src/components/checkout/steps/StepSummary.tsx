import type { TicketTier } from "@/data/tickets";
import type { Customer } from "@/lib/payments";
import { formatPrice } from "@/lib/utils";

export function StepSummary({
  tier,
  quantity,
  customer,
  subtotalCents,
  feeCents,
  totalCents,
}: {
  tier: TicketTier;
  quantity: number;
  customer: Customer;
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

      <div className="mt-4 rounded-md border border-white/10 bg-surface-2 p-4 text-sm text-muted">
        <p className="font-semibold text-white">
          {customer.firstName} {customer.lastName}
        </p>
        <p>{customer.email}</p>
        <p>{customer.phone}</p>
      </div>
    </div>
  );
}
