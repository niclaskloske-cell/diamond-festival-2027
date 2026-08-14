"use client";

import { TicketCard } from "@/components/sections/tickets/TicketCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCheckout } from "@/components/checkout/CheckoutContext";
import { ticketTiers } from "@/data/tickets";

export function Tickets() {
  const { openCheckout } = useCheckout();

  return (
    <section id="tickets" className="section-y container-x relative">
      <div
        aria-hidden
        className="glow-diamond pointer-events-none absolute -top-20 left-1/2 size-[36rem] -translate-x-1/2 opacity-30"
      />
      <SectionHeading
        eyebrow="Tickets"
        title="GET YOUR TICKET"
        description="Alle Tickets gelten für alle drei Festivaltage. Die Kontingente sind gestaffelt — sichere dir jetzt den besten Preis."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ticketTiers.map((tier) => (
          <TicketCard key={tier.id} tier={tier} onBuy={() => openCheckout(tier.id)} />
        ))}
      </div>
    </section>
  );
}
