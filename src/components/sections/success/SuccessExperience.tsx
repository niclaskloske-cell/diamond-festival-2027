"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Download, Loader2 } from "lucide-react";

import { DiamondMark } from "@/components/effects/DiamondMark";
import { Particles } from "@/components/effects/Particles";
import { Confetti } from "@/components/effects/Confetti";
import { Button, ButtonLink } from "@/components/ui/Button";
import { festival } from "@/data/festival";
import type { PaidOrderSummary } from "@/lib/payments";
import { useReducedMotion } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export type TicketCode = { code: string; position: number; qrSvg: string };

export function SuccessExperience({
  order,
  orderNumber,
  tickets,
}: {
  order: PaidOrderSummary;
  orderNumber: string;
  tickets: TicketCode[];
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
        Willkommen bei der {festival.fullName}.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
        className="edge glass relative mt-10 w-full max-w-sm rounded-lg p-6"
      >
        {tickets.length > 0 ? (
          <div className="space-y-6">
            {tickets.map((ticket) => {
              const holder = order.holders[ticket.position - 1];
              return (
                <div key={ticket.code}>
                  <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-diamond-light">
                    {tickets.length > 1
                      ? `Ticket ${ticket.position} von ${tickets.length}`
                      : "Dein Ticket"}
                  </p>
                  {/* Weiße Platte: QR-Leser brauchen den hellen Rand ringsum. */}
                  <div className="flex justify-center rounded-md bg-white p-5">
                    <div
                      className="size-40 [&>svg]:size-full"
                      role="img"
                      aria-label={`QR-Code für Ticket ${ticket.code}`}
                      dangerouslySetInnerHTML={{ __html: ticket.qrSvg }}
                    />
                  </div>
                  <p className="mt-2 text-center font-mono text-xs tracking-wide text-muted">
                    {ticket.code}
                  </p>
                  {holder && (
                    <p className="mt-1 text-center text-sm text-white">
                      {holder.firstName} {holder.lastName}
                      {holder.birthDate && (
                        <span className="text-muted"> · geb. {formatDate(holder.birthDate)}</span>
                      )}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <TicketsPending />
        )}

        <dl className="mt-6 space-y-3 text-sm">
          <Row label="Bestellnummer" value={orderNumber} mono />
          <Row label="Ticket" value={`${order.quantity} × ${order.tierName}`} />
          <Row label="Datum" value={festival.dateLabel} />
          <Row label="Einlass" value={`${festival.doorsOpen}, Beginn ${festival.showStart}`} />
        </dl>

        {tickets.length > 0 && <DownloadButton order={order} />}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative mt-8"
      >
        <ButtonLink href="/" variant="outline">
          Zurück zur Startseite
        </ButtonLink>
      </motion.div>
    </main>
  );
}

/**
 * Die Zahlung ist durch, die Ticketcodes aber noch nicht da — etwa weil die
 * Eventplattform gerade nicht erreichbar war. Ehrlicher Zwischenstand statt
 * eines leeren Kastens.
 */
function TicketsPending() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-white/15 bg-surface-2 px-5 py-8 text-center">
      <Loader2 className="size-8 animate-spin text-diamond-light" />
      <p className="text-sm font-semibold text-white">Deine Tickets werden erstellt</p>
      <p className="text-xs leading-relaxed text-muted">
        Die Zahlung ist eingegangen. Die Ticketcodes kommen gleich per E-Mail —
        oder lade diese Seite in einem Moment neu.
      </p>
    </div>
  );
}

/**
 * Lädt das Ticket-PDF vom Server. Es wird bei jedem Klick frisch erzeugt —
 * `/api/tickets/pdf` prüft die Zahlung erneut bei Stripe, statt der URL zu
 * vertrauen, genau wie diese Seite selbst. Ein echter Anchor-Klick statt
 * `location.href`, damit das kein SPA-Navigationsversuch ist, sondern klar
 * als Datei-Download behandelt wird.
 */
function DownloadButton({ order }: { order: PaidOrderSummary }) {
  const [saved, setSaved] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `/api/tickets/pdf?order=${encodeURIComponent(order.reference)}`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      magnetic={0}
      className="mt-6 w-full"
      icon={saved ? <Check className="size-4" /> : <Download className="size-4" />}
    >
      {saved ? "Download gestartet" : "Tickets als PDF herunterladen"}
    </Button>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-white/10 pt-3 first:border-none first:pt-0">
      <dt className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-faint">
        {label}
      </dt>
      <dd
        className={
          mono
            ? "text-right font-mono text-sm font-semibold tabular-nums text-white"
            : "text-right font-medium text-white"
        }
      >
        {value}
      </dd>
    </div>
  );
}
