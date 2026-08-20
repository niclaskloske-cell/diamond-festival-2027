import type { Metadata } from "next";

import { LegalPage } from "@/components/layout/LegalPage";
import { festival } from "@/data/festival";

export const metadata: Metadata = { title: "AGB" };

/**
 * IMPORTANT: covers the essentials factually (contract formation, pricing,
 * withdrawal exemption for dated event tickets, entry conditions) so the
 * live Stripe checkout isn't running with an AGB page that contradicts it.
 * This is NOT a lawyer-reviewed final version — get one before real sales
 * volume, especially the withdrawal/cancellation and liability sections.
 */
export default function AgbPage() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <p className="text-faint">
        Diese AGB decken die wesentlichen Punkte des Ticketkaufs sachlich ab,
        sind aber noch nicht anwaltlich geprüft. Vor dem eigentlichen
        Verkaufsstart sollten sie durch eine geprüfte Fassung ersetzt werden.
      </p>

      <h3 className="mt-6 font-semibold text-white">1. Geltungsbereich</h3>
      <p>
        Diese AGB gelten für den Kauf von Tickets für die Diamond Night am{" "}
        {festival.dateLabel} in der {festival.location.venue} über diese
        Website. Veranstalter ist Diamond Events – Niclas Justvan (Kontakt
        siehe Impressum).
      </p>

      <h3 className="mt-6 font-semibold text-white">2. Vertragsschluss</h3>
      <p>
        Der Kaufvertrag kommt zustande, sobald die Zahlung über den
        Zahlungsdienstleister Stripe erfolgreich abgeschlossen ist. Die
        Ticketpreise verstehen sich inklusive gesetzlicher Umsatzsteuer,
        soweit anwendbar.
      </p>

      <h3 className="mt-6 font-semibold text-white">3. Widerrufsrecht</h3>
      <p>
        Das gesetzliche Widerrufsrecht für Fernabsatzverträge ist gemäß
        § 312g Abs. 2 Nr. 9 BGB bei Verträgen zur Erbringung von
        Dienstleistungen im Zusammenhang mit Freizeitveranstaltungen mit
        einem festen Termin ausgeschlossen. Ein Ticket kann daher nach Kauf
        grundsätzlich nicht zurückgegeben werden.
      </p>

      <h3 className="mt-6 font-semibold text-white">4. Umschreibung</h3>
      <p>
        Eine Umschreibung des Tickets auf eine andere Person ist bis 14 Tage
        vor der Veranstaltung per E-Mail an {festival.contact.email} möglich.
      </p>

      <h3 className="mt-6 font-semibold text-white">5. Einlassbedingungen</h3>
      <p>{festival.minAgeNote} Einlass nur gegen Vorlage des Tickets (digital
        oder ausgedruckt) und eines gültigen Lichtbildausweises.
      </p>

      <h3 className="mt-6 font-semibold text-white">6. Ausfall der Veranstaltung</h3>
      <p>
        Bei Absage der Veranstaltung wird der Ticketpreis erstattet. Bei
        Verlegung bleibt das Ticket für den neuen Termin gültig; ein
        gesondertes Rücktrittsrecht besteht in diesem Fall nicht.
      </p>
    </LegalPage>
  );
}
