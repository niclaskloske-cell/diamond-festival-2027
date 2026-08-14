"use client";

import { motion } from "framer-motion";
import { QrCode } from "lucide-react";

import { DiamondMark } from "@/components/effects/DiamondMark";
import { Particles } from "@/components/effects/Particles";
import { Confetti } from "@/components/effects/Confetti";
import { ButtonLink } from "@/components/ui/Button";
import { festival } from "@/data/festival";
import { useReducedMotion } from "@/lib/hooks";

const EASE = [0.16, 1, 0.3, 1] as const;

export function SuccessExperience({
  reference,
  tierName,
  quantity,
  name,
}: {
  reference: string;
  tierName: string;
  quantity: number;
  name: string;
}) {
  const reduced = useReducedMotion();

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-bg px-6 py-24">
      <div className="pointer-events-none absolute inset-0">
        <Particles density={40} interactive={false} />
      </div>
      {!reduced && <Confetti />}
      <div
        aria-hidden
        className="glow-diamond pointer-events-none absolute left-1/2 top-1/3 size-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-50"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative text-diamond-light"
      >
        <DiamondMark className="size-14" strokeWidth={1.4} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        className="relative mt-6 font-display text-display-md uppercase text-white"
      >
        YOU&apos;RE IN.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.28 }}
        className="relative mt-3 max-w-sm text-center text-muted"
      >
        Willkommen beim {festival.fullName}.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
        className="edge glass relative mt-10 w-full max-w-sm rounded-lg p-6"
      >
        <div className="flex items-center justify-center rounded-md border border-dashed border-white/15 bg-surface-2 py-8">
          <div className="flex flex-col items-center gap-2 text-faint">
            <QrCode className="size-10" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em]">
              QR-Code folgt per E-Mail
            </span>
          </div>
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <Row label="Bestellnummer" value={reference} />
          <Row label="Ticket" value={`${quantity} × ${tierName}`} />
          {name && <Row label="Name" value={name} />}
          <Row label="Datum" value={festival.dateLabel} />
        </dl>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative mt-8"
      >
        <ButtonLink href="/">Zurück zur Startseite</ButtonLink>
      </motion.div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t border-white/10 pt-3 first:border-none first:pt-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-faint">
        {label}
      </dt>
      <dd className="font-medium text-white">{value}</dd>
    </div>
  );
}
