"use client";

import { Handshake } from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { partners, partnerTierLabels } from "@/data/partners";
import { cn } from "@/lib/utils";

export function Partners() {
  return (
    <section id="partner" className="section-y container-x">
      <SectionHeading
        eyebrow="Partner"
        title="PARTNER & SPONSOREN"
        description="Die Marken und Betriebe, die die Diamond Night möglich machen."
      />

      {partners.length === 0 ? (
        <div className="edge flex flex-col items-center gap-3 rounded-lg bg-surface px-6 py-16 text-center">
          <Handshake className="size-7 text-diamond-light" />
          <p className="font-display text-lg font-extrabold uppercase text-white">
            Partner werden bald bekannt gegeben
          </p>
          <p className="max-w-sm text-sm text-muted">
            Wir befinden uns aktuell in Gesprächen mit Partnern und Sponsoren.
            Diese Sektion füllt sich, sobald die ersten Kooperationen
            bestätigt sind.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {partners.map((partner) => {
            const isPlanned = partner.status === "planned";
            return (
              <a
                key={partner.id}
                href={partner.url || undefined}
                target={partner.url ? "_blank" : undefined}
                rel={partner.url ? "noopener noreferrer" : undefined}
                data-cursor="link"
                className={cn(
                  "group edge relative flex aspect-[3/2] flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-surface px-4 text-center transition-colors",
                  isPlanned && "hover:ring-1 hover:ring-warning/60",
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                    isPlanned
                      ? "bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,196,107,0.28)_0%,transparent_70%)]"
                      : "bg-[radial-gradient(60%_60%_at_50%_50%,rgba(76,170,201,0.24)_0%,transparent_70%)]",
                  )}
                />
                <span className="relative font-display text-base font-extrabold uppercase text-white sm:text-lg">
                  {partner.name}
                </span>
                <span className="relative text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-faint">
                  {partnerTierLabels[partner.tier]}
                </span>
                {isPlanned && (
                  <span className="absolute left-3 top-3 rounded-full bg-warning/90 px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-[#241a04]">
                    Geplant
                  </span>
                )}
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
