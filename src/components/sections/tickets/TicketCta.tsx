"use client";

import { ArrowRight, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useCheckout } from "@/components/checkout/CheckoutContext";
import { festival } from "@/data/festival";
import type { TicketTier } from "@/data/tickets";
import { formatPrice } from "@/lib/utils";

/** Closing band: one more shot at the checkout plus a human fallback. */
export function TicketCta({ cheapest }: { cheapest: TicketTier }) {
  const { openCheckout } = useCheckout();

  return (
    <section className="container-x pb-28 sm:pb-36">
      <div className="edge relative overflow-hidden rounded-lg bg-surface p-8 text-center sm:p-14">
        <div
          aria-hidden
          className="glow-diamond pointer-events-none absolute -top-40 left-1/2 size-[34rem] -translate-x-1/2 opacity-40"
        />
        <h2 className="relative font-display text-display-md uppercase text-white">
          BEREIT FÜR DIE
          <br />
          DIAMOND NIGHT?
        </h2>
        <p className="relative mx-auto mt-5 max-w-md text-muted">
          {festival.dateLabel} · Einlass {festival.doorsOpen}, Beginn{" "}
          {festival.showStart} · {festival.location.venue}. Tickets ab{" "}
          {formatPrice(cheapest.priceCents)}.
        </p>

        <div className="relative mt-9 flex justify-center">
          <Button
            size="lg"
            onClick={() => openCheckout(cheapest.id)}
            icon={<ArrowRight className="size-4" />}
          >
            Ticket kaufen
          </Button>
        </div>

        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-8 text-sm text-muted">
          <span>Fragen zum Ticketkauf?</span>
          <a
            href={`mailto:${festival.contact.email}`}
            data-cursor="link"
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            <Mail className="size-3.5 text-diamond-light" />
            {festival.contact.email}
          </a>
          <a
            href={`tel:${festival.contact.phone.replace(/\s/g, "")}`}
            data-cursor="link"
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            <Phone className="size-3.5 text-diamond-light" />
            {festival.contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
