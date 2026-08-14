import { Check } from "lucide-react";

import { ticketTiers, type TicketTierId } from "@/data/tickets";
import { formatPrice, cn } from "@/lib/utils";

export function StepTier({
  selected,
  onSelect,
}: {
  selected: TicketTierId | null;
  onSelect: (id: TicketTierId) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-xl font-extrabold uppercase text-white">
        Ticket auswählen
      </h3>
      <p className="mt-1 text-sm text-muted">Alle Tickets gelten für alle drei Festivaltage.</p>

      <div className="mt-6 space-y-3">
        {ticketTiers.map((tier) => {
          const disabled = tier.status !== "on-sale";
          const active = selected === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(tier.id)}
              data-cursor="link"
              className={cn(
                "flex w-full items-center justify-between rounded-md border px-4 py-3.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                active
                  ? "border-diamond bg-diamond/10"
                  : "border-white/12 hover:border-white/30",
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border",
                    active ? "border-diamond bg-diamond text-[#04141b]" : "border-white/25",
                  )}
                >
                  {active && <Check className="size-3" />}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    {tier.name}
                  </span>
                  <span className="block text-xs text-muted">
                    {disabled ? "Nicht verfügbar" : tier.tagline}
                  </span>
                </span>
              </span>
              <span className="font-display text-lg font-extrabold text-white">
                {formatPrice(tier.priceCents)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
