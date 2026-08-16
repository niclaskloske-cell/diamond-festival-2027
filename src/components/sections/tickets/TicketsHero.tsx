"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, Mic2, Clock } from "lucide-react";

import { DiamondMark } from "@/components/effects/DiamondMark";
import { LightBeams } from "@/components/effects/LightBeams";
import { Particles } from "@/components/effects/Particles";
import { ButtonLink } from "@/components/ui/Button";
import { festival } from "@/data/festival";
import type { TicketTier } from "@/data/tickets";
import { useCountdown } from "@/lib/hooks";
import { formatPrice } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const FACTS = [
  { id: "termin", icon: CalendarDays, label: "Termin", value: festival.dateLabelShort },
  { id: "ort", icon: MapPin, label: "Location", value: festival.location.venue },
  { id: "act", icon: Mic2, label: "Mainact", value: "Muhabbet" },
  {
    id: "einlass",
    icon: Clock,
    label: "Einlass",
    value: `${festival.doorsOpen} · Beginn ${festival.showStart}`,
  },
] as const;

/** Page hero for /tickets — same visual language as the home hero, shorter. */
export function TicketsHero({ cheapest }: { cheapest: TicketTier }) {
  return (
    <section className="relative overflow-hidden bg-bg pb-16 pt-36 sm:pb-24 sm:pt-44">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(76,170,201,0.16)_0%,rgba(5,5,5,0)_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_88%_10%,rgba(255,182,72,0.07)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,var(--color-bg)_100%)]" />
      </div>
      <LightBeams className="opacity-60" />
      <div className="absolute inset-0">
        <Particles density={26} />
      </div>

      <div className="container-x relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center gap-2.5 text-eyebrow text-diamond-light"
        >
          <DiamondMark className="size-4" facets={false} />
          <span>
            {festival.name.toUpperCase()} · {festival.dateLabel}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
          className="mt-6 font-display text-display-lg uppercase text-white"
        >
          TICKETS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="mt-6 max-w-xl text-lg text-muted"
        >
          Vier Kategorien für einen Abend in der {festival.location.venue}. Vom
          limitierten Early Bird bis zum VIP-Ticket mit eigenem Bereich und
          Meet &amp; Greet mit Muhabbet.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <ButtonLink
            href="#kategorien"
            size="lg"
            icon={<ArrowRight className="size-4" />}
          >
            Ab {formatPrice(cheapest.priceCents)}
          </ButtonLink>
          <CountdownLine />
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.42 }}
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-4"
        >
          {FACTS.map((fact) => (
            <div key={fact.id} className="bg-bg p-5">
              <dt className="flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-faint">
                <fact.icon className="size-3.5 text-diamond-light" />
                {fact.label}
              </dt>
              <dd className="mt-2 text-sm font-semibold text-white">
                {fact.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

/** Days-left hint next to the CTA. Renders nothing until the first client tick. */
function CountdownLine() {
  const cd = useCountdown(festival.startsAt);

  if (!cd.ready) return null;
  if (cd.isOver) {
    return (
      <span className="text-sm text-muted">
        Die Diamond Night läuft — wir sehen uns dort.
      </span>
    );
  }

  return (
    <span className="text-sm text-muted">
      Noch{" "}
      <span className="font-display font-extrabold tabular-nums text-white">
        {cd.days}
      </span>{" "}
      {cd.days === 1 ? "Tag" : "Tage"} bis zur Diamond Night.
    </span>
  );
}
