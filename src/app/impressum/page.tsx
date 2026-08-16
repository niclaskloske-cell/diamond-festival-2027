import type { Metadata } from "next";

import { LegalPage } from "@/components/layout/LegalPage";
import { festival } from "@/data/festival";

export const metadata: Metadata = { title: "Impressum" };

/**
 * Confirmed 2026-08-16: no USt-IdNr., no Handelsregister entry — so neither
 * line appears here. TODO: if Diamond Events invoices under the
 * Kleinunternehmerregelung, add the § 19 UStG note to the ticket prices.
 */
export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <p>Angaben gemäß § 5 TMG</p>
      <p>
        Diamond Events – Niclas Justvan
        <br />
        Lerchenstr. 12
        <br />
        84109 Wörth an der Isar
      </p>
      <p>
        Kontakt:
        <br />
        Telefon: 0163 8557552
        <br />
        E-Mail: {festival.contact.email}
        <br />
        Presse: {festival.contact.press}
      </p>
      <p>
        Umsatzsteuer-Identifikationsnummer: nicht vorhanden. Ein Eintrag im
        Handelsregister besteht nicht.
      </p>
    </LegalPage>
  );
}
