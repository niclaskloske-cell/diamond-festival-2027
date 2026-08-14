import type { Metadata } from "next";

import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Impressum" };

/**
 * TODO: confirm whether "Diamond Events" is a registered trade name
 * (Gewerbeanmeldung) before launch — if so, add the Gewerbe/Handelsregister
 * entry here. VAT ID (USt-IdNr.) still needs to be added once available.
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
        E-Mail: hallo@eventsdiamond.de
      </p>
      <p>Umsatzsteuer-Identifikationsnummer: [USt-IdNr., FALLS VORHANDEN]</p>
      <p className="text-faint">
        Diese Seite wird vor dem offiziellen Launch um die USt-IdNr. (falls
        vorhanden) und einen etwaigen Gewerberegister-Eintrag ergänzt.
      </p>
    </LegalPage>
  );
}
