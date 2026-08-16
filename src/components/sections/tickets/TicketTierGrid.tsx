"use client";

import { TicketCard } from "@/components/sections/tickets/TicketCard";
import { useCheckout } from "@/components/checkout/CheckoutContext";
import { ticketTiers, type TicketStatusMap } from "@/data/tickets";
import { cn } from "@/lib/utils";

/**
 * The four ticket cards. Shared by the home section and the ticket page.
 * `statuses` is resolved on the server so a deadline-driven "closed" state
 * cannot differ between server markup and hydration.
 */
export function TicketTierGrid({
  statuses,
  className,
}: {
  statuses: TicketStatusMap;
  className?: string;
}) {
  const { openCheckout } = useCheckout();

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {ticketTiers.map((tier) => (
        <TicketCard
          key={tier.id}
          tier={tier}
          status={statuses[tier.id]}
          onBuy={() => openCheckout(tier.id)}
        />
      ))}
    </div>
  );
}
