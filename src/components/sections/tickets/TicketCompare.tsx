import { Check, Minus } from "lucide-react";

import {
  ticketComparison,
  ticketTiers,
  type TicketFeatureValue,
} from "@/data/tickets";
import { formatPrice, cn } from "@/lib/utils";

/**
 * Side-by-side comparison of what each category includes. Scrolls horizontally
 * on narrow screens instead of shrinking the columns into unreadable slivers.
 */
export function TicketCompare() {
  return (
    <div className="-mx-[clamp(1.25rem,5vw,4.5rem)] overflow-x-auto px-[clamp(1.25rem,5vw,4.5rem)] pb-2">
      <table className="w-full min-w-[46rem] border-separate border-spacing-0 text-left">
        <caption className="sr-only">
          Vergleich der Ticketkategorien der Diamond Night
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="w-[34%] border-b border-white/10 pb-5 pr-4 align-bottom text-xs font-semibold uppercase tracking-[0.2em] text-faint"
            >
              Enthalten
            </th>
            {ticketTiers.map((tier) => (
              <th
                key={tier.id}
                scope="col"
                className={cn(
                  "border-b border-white/10 px-4 pb-5 align-bottom",
                  tier.featured && "bg-white/[0.03]",
                )}
              >
                <span className="block font-display text-sm font-extrabold uppercase text-white">
                  {tier.name}
                </span>
                <span className="mt-1 block font-display text-xl font-extrabold tabular-nums text-diamond-light">
                  {formatPrice(tier.priceCents)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ticketComparison.map((feature) => (
            <tr key={feature.id} className="group">
              <th
                scope="row"
                className="border-b border-white/8 py-4 pr-4 text-sm font-normal text-muted"
              >
                {feature.label}
              </th>
              {ticketTiers.map((tier) => (
                <td
                  key={tier.id}
                  className={cn(
                    "border-b border-white/8 px-4 py-4",
                    tier.featured && "bg-white/[0.03]",
                  )}
                >
                  <Cell value={feature.values[tier.id]} label={feature.label} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ value, label }: { value: TicketFeatureValue; label: string }) {
  // "ja"/"nein" instead of "enthalten"/"nicht enthalten": the same cell renderer
  // is used for rows that are not about inclusion (e.g. "Nachweis nötig").
  if (value === true) {
    return (
      <>
        <Check aria-hidden className="size-4 text-diamond-light" />
        <span className="sr-only">{label}: ja</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus aria-hidden className="size-4 text-white/20" />
        <span className="sr-only">{label}: nein</span>
      </>
    );
  }
  return <span className="text-sm font-semibold text-white">{value}</span>;
}
