import type { Metadata } from "next";

import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Datenschutz" };

/**
 * TODO: replace with a DSGVO-compliant Datenschutzerklärung once the actual
 * data flows are final — checkout provider, analytics (if any), cookies,
 * hosting, and the responsible controller's contact details.
 */
export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutz">
      <p>
        Diese Datenschutzerklärung wird vor dem Launch der Seite mit den
        vollständigen, rechtlich geprüften Angaben zur Verarbeitung
        personenbezogener Daten ergänzt — unter anderem zu:
      </p>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Verantwortlicher gemäß Art. 4 Nr. 7 DSGVO</li>
        <li>Datenverarbeitung beim Ticketkauf (Kontaktdaten, Zahlungsanbieter)</li>
        <li>Hosting und Server-Logs</li>
        <li>Cookies und ggf. eingesetzte Analyse-Tools</li>
        <li>Rechte der betroffenen Personen (Auskunft, Löschung, Widerspruch)</li>
      </ul>
      <p className="text-faint">
        Kein Ticketkauf oder Formularversand ist bereits an ein Backend
        angebunden — es werden aktuell keine Bestelldaten gespeichert.
      </p>
    </LegalPage>
  );
}
