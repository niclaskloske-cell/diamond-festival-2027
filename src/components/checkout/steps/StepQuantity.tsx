import { Minus, Plus } from "lucide-react";

import type { TicketTier } from "@/data/tickets";
import { formatPrice } from "@/lib/utils";

export function StepQuantity({
  tier,
  quantity,
  onChange,
}: {
  tier: TicketTier;
  quantity: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-xl font-extrabold uppercase text-white">
        Anzahl auswählen
      </h3>
      <p className="mt-1 text-sm text-muted">
        {tier.name} · {formatPrice(tier.priceCents)} pro Ticket
      </p>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          data-cursor="link"
          disabled={quantity <= 1}
          onClick={() => onChange(quantity - 1)}
          aria-label="Weniger Tickets"
          className="flex size-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-diamond disabled:opacity-30"
        >
          <Minus className="size-4" />
        </button>
        <span className="font-display w-16 text-center text-4xl font-extrabold tabular-nums text-white">
          {quantity}
        </span>
        <button
          type="button"
          data-cursor="link"
          disabled={quantity >= tier.maxPerOrder}
          onClick={() => onChange(quantity + 1)}
          aria-label="Mehr Tickets"
          className="flex size-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-diamond disabled:opacity-30"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-faint">
        Maximal {tier.maxPerOrder} Tickets pro Bestellung.
      </p>
    </div>
  );
}
