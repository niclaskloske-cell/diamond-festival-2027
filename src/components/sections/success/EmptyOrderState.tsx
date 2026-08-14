import { ArrowLeft } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { DiamondMark } from "@/components/effects/DiamondMark";

export function EmptyOrderState() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-bg px-6 text-center">
      <DiamondMark className="size-10 text-faint" strokeWidth={1.25} />
      <h1 className="mt-6 font-display text-2xl font-extrabold uppercase text-white">
        Keine Bestellung gefunden
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted">
        Diese Seite zeigt deine Bestellbestätigung nach einem abgeschlossenen
        Ticketkauf. Es liegt aktuell keine gültige Bestellung vor.
      </p>
      <ButtonLink href="/#tickets" className="mt-8" icon={<ArrowLeft className="size-4" />}>
        Zu den Tickets
      </ButtonLink>
    </main>
  );
}
