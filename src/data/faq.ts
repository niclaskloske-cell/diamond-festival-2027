import { festival } from "./festival";
import {
  getTier,
  REDUCED_ELIGIBILITY,
  REDUCED_NO_PROOF_RULE,
  TICKET_DELIVERY,
  FEE_NOTE,
} from "./tickets";
import { formatPrice } from "@/lib/utils";

/** Prices are read from the catalogue so the FAQ can never drift from it. */
const price = (id: Parameters<typeof getTier>[0]) =>
  formatPrice(getTier(id)!.priceCents);

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** Grouping for the filter chips above the accordion. */
  category: "Allgemein" | "Tickets" | "Anreise" | "Vor Ort";
};

export const faqItems: FaqItem[] = [
  {
    id: "wann",
    category: "Allgemein",
    question: "Wann findet die Diamond Night statt?",
    answer: `Am ${festival.dateLabel} in der ${festival.location.venue}. Einlass ist um ${festival.doorsOpen}, Beginn um ${festival.showStart}.`,
  },
  {
    id: "wo",
    category: "Allgemein",
    question: "Wo findet das Event statt?",
    answer: `${festival.location.venue}, ${festival.location.street}, ${festival.location.postalCode} ${festival.location.city}.`,
  },
  {
    id: "mainact",
    category: "Allgemein",
    question: "Wer tritt auf?",
    answer:
      "Mainact des Abends ist Muhabbet, u. a. bekannt für „Sie liegt in meinen Armen“. Im Vorprogramm dabei sind DJ Shero und El Destrad, ein weiterer DJ-Slot wird noch bekannt gegeben.",
  },
  {
    id: "preis",
    category: "Tickets",
    question: "Wie viel kostet ein Ticket?",
    answer: `Early Bird ${price("early-bird")} (nur bis 15.10.2026), Ermäßigt ${price("ermaessigt")} (nur mit gültigem Nachweis), Regular ${price("regular")} und VIP ${price("vip")} inklusive VIP-Bereich und Meet & Greet mit Muhabbet. VIP ist auf 70 Tickets begrenzt. ${FEE_NOTE}`,
  },
  {
    id: "ermaessigt",
    category: "Tickets",
    question: "Wer bekommt das ermäßigte Ticket?",
    answer: `Das ermäßigte Ticket kostet ${price("ermaessigt")} und gilt für ${REDUCED_ELIGIBILITY}. Der Nachweis wird am Einlass vorgezeigt. ${REDUCED_NO_PROOF_RULE} Maximal ${getTier("ermaessigt")!.maxPerOrder} ermäßigte Tickets pro Bestellung.`,
  },
  {
    id: "versand",
    category: "Tickets",
    question: "Wie bekomme ich mein Ticket?",
    answer: TICKET_DELIVERY,
  },
  {
    id: "zahlungsarten",
    category: "Tickets",
    question: "Womit kann ich bezahlen?",
    answer: `Mit Kreditkarte, PayPal oder Klarna — die Zahlung läuft über unseren Zahlungsanbieter, du wirst dafür kurz auf dessen gesicherte Seite weitergeleitet. ${FEE_NOTE}`,
  },
  {
    id: "alter",
    category: "Allgemein",
    question: "Ab welchem Alter komme ich rein?",
    answer: festival.minAgeNote,
  },
  {
    id: "vip",
    category: "Tickets",
    question: "Was ist im VIP-Ticket enthalten?",
    answer:
      "Zugang zum VIP-Bereich, ein persönliches Meet & Greet mit Muhabbet, bevorzugter Einlass und die beste Sichtkategorie im Haus. Das Kontingent ist stark limitiert.",
  },
  {
    id: "umtausch",
    category: "Tickets",
    question: "Kann ich mein Ticket umtauschen oder zurückgeben?",
    answer:
      "Tickets sind personalisiert und grundsätzlich vom Widerrufsrecht ausgenommen (§ 312g Abs. 2 Nr. 9 BGB). Eine Umpersonalisierung ist bis 14 Tage vor dem Event über den Support möglich.",
  },
  {
    id: "parken",
    category: "Anreise",
    question: "Gibt es Parkplätze?",
    answer:
      "Ja, direkt am Gelände der Sparkassen-Arena Landshut. Die Plätze werden nicht reserviert — first come, first served. Wer sichergehen will, kommt früh oder nimmt den Bus.",
  },
  {
    id: "anreise",
    category: "Anreise",
    question: "Wie komme ich mit Bus/Bahn hin?",
    answer:
      "Vom Landshuter Hauptbahnhof fährt die Buslinie 603 bis zur Haltestelle Sparkassen-Arena — die hält direkt am Gelände.",
  },
  {
    id: "einlass",
    category: "Vor Ort",
    question: "Was brauche ich für den Einlass?",
    answer:
      "Dein Ticket und einen gültigen Ausweis — die Diamond Night ist ab 18 Jahren. Einlass ist ab 20:00 Uhr. Waffen, waffenähnliche und gefährliche Gegenstände, Pyrotechnik, Glas und Dosen sind nicht erlaubt; eine Taschenkontrolle ist möglich.",
  },
  {
    id: "bezahlen",
    category: "Vor Ort",
    question: "Wie bezahle ich vor Ort?",
    answer:
      "Bargeldlos an allen Bar- und Verkaufsständen in der Arena — kein Anstehen am Geldautomaten.",
  },
  {
    id: "kontakt",
    category: "Vor Ort",
    question: "An wen wende ich mich bei Fragen oder Problemen?",
    answer: `Du erreichst Diamond Events telefonisch unter ${festival.contact.phone} oder per E-Mail an ${festival.contact.email}.`,
  },
];

export const faqCategories = [
  "Allgemein",
  "Tickets",
  "Anreise",
  "Vor Ort",
] as const;
