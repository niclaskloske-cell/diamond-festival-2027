import { ArrowRight } from "lucide-react";

import { TicketTierGrid } from "@/components/sections/tickets/TicketTierGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { currentTicketStatuses } from "@/data/tickets";

/** Server component: resolves the ticket statuses before handing them down. */
export function Tickets() {
  const statuses = currentTicketStatuses();

  return (
    <section id="tickets" className="section-y container-x relative">
      <div
        aria-hidden
        className="glow-diamond pointer-events-none absolute -top-20 left-1/2 size-[36rem] -translate-x-1/2 opacity-30"
      />
      <SectionHeading
        eyebrow="Tickets"
        title="GET YOUR TICKET"
        description="Ein Ticket gilt für den kompletten Abend in der Sparkassen-Arena Landshut. Early Bird läuft nur bis zum 15.10.2026, VIP ist auf 70 Tickets begrenzt."
      />

      <TicketTierGrid statuses={statuses} />

      <div className="mt-10 flex justify-center">
        <ButtonLink
          href="/tickets"
          variant="outline"
          icon={<ArrowRight className="size-4" />}
        >
          Alle Ticket-Details
        </ButtonLink>
      </div>
    </section>
  );
}
