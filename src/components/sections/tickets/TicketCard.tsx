"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Check, Sparkles } from "lucide-react";

import type { TicketStatus, TicketTier } from "@/data/tickets";
import { REDUCED_ELIGIBILITY, REDUCED_NO_PROOF_RULE } from "@/data/tickets";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const BUTTON_LABEL: Record<TicketStatus, string> = {
  "on-sale": "Ticket kaufen",
  "sold-out": "Ausverkauft",
  "coming-soon": "Bald verfügbar",
  closed: "Verkauf beendet",
};

export function TicketCard({
  tier,
  status,
  onBuy,
}: {
  tier: TicketTier;
  status: TicketStatus;
  onBuy: () => void;
}) {
  const disabled = status !== "on-sale";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "edge group relative flex flex-col overflow-hidden rounded-lg p-7",
        tier.featured ? "bg-surface-2" : "bg-surface",
      )}
    >
      {/* Moving background glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 0%, color-mix(in oklab, var(--color-diamond) 45%, transparent), transparent 70%)",
        }}
      />

      {tier.featured && (
        <span className="relative mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[linear-gradient(100deg,color-mix(in_oklab,var(--color-diamond)_28%,transparent),color-mix(in_oklab,var(--color-sun)_28%,transparent))] px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-diamond-light">
          <Sparkles className="size-3" />
          Beliebteste Wahl
        </span>
      )}

      <h3 className="relative font-display text-2xl font-extrabold uppercase text-white">
        {tier.name}
      </h3>
      <p className="relative mt-1 text-sm text-muted">{tier.tagline}</p>

      <div className="relative mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-5xl font-extrabold tabular-nums text-white transition-transform duration-300 group-hover:scale-105">
          {formatPrice(tier.priceCents)}
        </span>
      </div>
      {tier.note && (
        <p className="relative mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-diamond-light">
          {tier.note}
        </p>
      )}

      <ul className="relative mt-6 flex-1 space-y-2.5">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2.5 text-sm text-muted">
            <Check className="mt-0.5 size-3.5 shrink-0 text-diamond-light" />
            {perk}
          </li>
        ))}
      </ul>

      {tier.proofRequired && (
        <p className="relative mt-5 flex items-start gap-2 rounded-md border border-white/10 bg-white/[0.03] p-3 text-xs leading-relaxed text-faint">
          <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-diamond-light" />
          <span>
            Gilt nur mit gültigem Nachweis für {REDUCED_ELIGIBILITY}.{" "}
            {REDUCED_NO_PROOF_RULE}
          </span>
        </p>
      )}

      <Button
        onClick={onBuy}
        disabled={disabled}
        variant={tier.featured ? "primary" : "outline"}
        className="relative mt-7 w-full"
      >
        {BUTTON_LABEL[status]}
      </Button>
    </motion.div>
  );
}
