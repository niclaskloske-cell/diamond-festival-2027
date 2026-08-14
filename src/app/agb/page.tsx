import type { Metadata } from "next";

import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "AGB" };

/** TODO: replace with the reviewed Allgemeine Geschäftsbedingungen before ticket sales go live. */
export default function AgbPage() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <p>
        Die vollständigen AGB für den Ticketverkauf zur Diamond Night
        werden vor dem Verkaufsstart veröffentlicht —
        unter anderem zu Vertragsschluss, Ticketpreisen, Widerrufsrecht,
        Umtausch/Stornierung und Einlassbedingungen.
      </p>
      <p className="text-faint">
        Solange diese Seite Platzhalter enthält, ist der Ticketkauf noch nicht
        rechtsverbindlich möglich.
      </p>
    </LegalPage>
  );
}
