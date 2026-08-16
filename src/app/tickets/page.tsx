import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { TicketsHero } from "@/components/sections/tickets/TicketsHero";
import { TicketTierGrid } from "@/components/sections/tickets/TicketTierGrid";
import { TicketCompare } from "@/components/sections/tickets/TicketCompare";
import { TicketInfo } from "@/components/sections/tickets/TicketInfo";
import { TicketCta } from "@/components/sections/tickets/TicketCta";
import { faqItems } from "@/data/faq";
import { festival } from "@/data/festival";
import {
  cheapestAvailableTier,
  currentTicketStatuses,
  FEE_NOTE,
} from "@/data/tickets";
import { formatPrice } from "@/lib/utils";

const description = `Tickets für die ${festival.fullName} am ${festival.dateLabel} in der ${festival.location.venue}: Early Bird, Ermäßigt, Regular und VIP mit VIP-Bereich und Meet & Greet. Ab ${formatPrice(cheapestAvailableTier().priceCents)}.`;

export const metadata: Metadata = {
  title: "Tickets",
  description,
  alternates: { canonical: "/tickets" },
  openGraph: {
    title: `Tickets – ${festival.fullName}`,
    description,
    url: `${festival.siteUrl}/tickets`,
  },
};

const ticketFaq = faqItems.filter((item) => item.category === "Tickets");

/**
 * Revalidate hourly: the Early Bird closes on a date, and this page is static
 * otherwise — an hour is close enough to the deadline without going dynamic.
 * `/api/checkout` is the authority either way.
 */
export const revalidate = 3600;

export default function TicketsPage() {
  const statuses = currentTicketStatuses();
  const cheapest = cheapestAvailableTier();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <TicketsHero cheapest={cheapest} />

        <section id="kategorien" className="container-x scroll-mt-28 pb-24 sm:pb-32">
          <SectionHeading
            eyebrow="Kategorien"
            title="VIER WEGE IN DIE NACHT"
            description="Ein Ticket gilt für den kompletten Abend. Early Bird gibt es nur bis zum 15.10.2026, VIP ist auf 70 Tickets begrenzt — Regular und Ermäßigt laufen bis zum Event."
          />

          <TicketTierGrid statuses={statuses} />

          <p className="mt-8 text-xs leading-relaxed text-faint">
            Alle Preise gelten pro Ticket. {FEE_NOTE} Ermäßigte Tickets sind nur
            mit gültigem Nachweis am Einlass gültig.
          </p>
        </section>

        <section id="vergleich" className="scroll-mt-28 border-y border-white/8 bg-bg-elevated">
          <div className="container-x py-24 sm:py-32">
            <SectionHeading
              eyebrow="Vergleich"
              title="WAS IST WO DRIN?"
              description="Alle vier Kategorien nebeneinander — damit klar ist, wofür der Aufpreis steht."
            />
            <TicketCompare />
          </div>
        </section>

        <section id="infos" className="container-x scroll-mt-28 py-24 sm:py-32">
          <SectionHeading
            eyebrow="Gut zu wissen"
            title="VOR DEM KAUF"
            description="Die wichtigsten Punkte zu Nachweis, Personalisierung, Einlass und Bezahlung."
          />
          <TicketInfo />
        </section>

        <section id="ticket-faq" className="container-x scroll-mt-28 pb-24 sm:pb-32">
          <SectionHeading eyebrow="FAQ" title="TICKET-FRAGEN" />
          <FaqAccordion items={ticketFaq} idPrefix="ticket-faq" />
        </section>

        <TicketCta cheapest={cheapest} />
      </main>
      <Footer />
    </>
  );
}
