import type { Metadata } from "next";

import { LegalPage } from "@/components/layout/LegalPage";
import { festival } from "@/data/festival";

export const metadata: Metadata = { title: "Datenschutz" };

/**
 * IMPORTANT: this describes the actual current data flows factually (Stripe
 * checkout is live and does collect name/birthdate/payment data — the old
 * copy here claimed the opposite, which became false the moment checkout
 * shipped). It is still NOT a final, lawyer-reviewed Datenschutzerklärung —
 * legal basis citations, retention periods and the full DSGVO Art. 13 catalog
 * are still missing. Do not treat this as launch-ready legal text.
 */
export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutz">
      <p className="text-faint">
        Diese Seite beschreibt die tatsächlich stattfindende
        Datenverarbeitung sachlich korrekt, ist aber noch keine
        rechtlich geprüfte, vollständige Datenschutzerklärung nach Art. 13
        DSGVO. Vor dem eigentlichen Ticketverkaufsstart muss sie durch einen
        vollständigen, geprüften Text ersetzt werden.
      </p>

      <h3 className="mt-6 font-semibold text-white">Verantwortlicher</h3>
      <p>
        Diamond Events – Niclas Justvan, Lerchenstr. 12, 84109 Wörth an der
        Isar. Kontakt siehe Impressum.
      </p>

      <h3 className="mt-6 font-semibold text-white">Datenverarbeitung beim Ticketkauf</h3>
      <p>
        Beim Kauf eines Tickets werden Name, Geburtsdatum, E-Mail-Adresse und
        die gewählte Ticketkategorie erhoben. Die Zahlung wird über Stripe
        abgewickelt — Stripe verarbeitet dabei Zahlungsdaten (z. B.
        Kartendaten) als eigener Verantwortlicher gemäß den
        Stripe-Datenschutzhinweisen. Name, Ticketkategorie und Bestellnummer
        werden zusätzlich an die Eventplattform übermittelt, die am
        Veranstaltungstag den Einlass anhand des Tickets prüft.
      </p>

      <h3 className="mt-6 font-semibold text-white">Kontaktformular</h3>
      <p>
        Name, E-Mail-Adresse und Nachricht werden zur Bearbeitung deiner
        Anfrage an {festival.contact.email} weitergeleitet.
      </p>

      <h3 className="mt-6 font-semibold text-white">Hosting</h3>
      <p>
        Diese Website wird bei Render gehostet. Beim Seitenaufruf fallen
        technisch bedingt Server-Logs an (u. a. IP-Adresse, Zeitpunkt,
        aufgerufene Seite).
      </p>

      <h3 className="mt-6 font-semibold text-white">Cookies & Tracking</h3>
      <p>
        Diese Website setzt aktuell keine Analyse- oder Marketing-Cookies
        ein.
      </p>

      <h3 className="mt-6 font-semibold text-white">Deine Rechte</h3>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung und
        Widerspruch bezüglich deiner gespeicherten Daten. Wende dich dazu an{" "}
        {festival.contact.email}.
      </p>
    </LegalPage>
  );
}
