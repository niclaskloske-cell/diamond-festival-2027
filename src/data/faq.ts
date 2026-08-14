import { festival } from "./festival";

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
    answer: `Am ${festival.dateLabel} in der ${festival.location.venue}. Einlass- und Beginnzeit werden rechtzeitig vor dem Event bekannt gegeben.`,
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
    answer:
      "Early Bird 20,00 €, Regular 25,00 €, VIP 65,00 € inklusive Meet & Greet mit Muhabbet. Die Kontingente sind gestaffelt — sobald eine Stufe ausverkauft ist, gilt automatisch die nächste.",
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
      "Ein persönliches Meet & Greet mit Muhabbet, bevorzugter Einlass und die beste Sichtkategorie im Haus. Das Kontingent ist stark limitiert.",
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
      "Ja, an der Sparkassen-Arena Landshut stehen Parkmöglichkeiten direkt am Gelände zur Verfügung. Details zu Kapazität und Gebühren folgen vor dem Event.",
  },
  {
    id: "anreise",
    category: "Anreise",
    question: "Wie komme ich mit Bus/Bahn hin?",
    answer:
      "Die Sparkassen-Arena liegt im Landshuter Stadtteil Schönbrunn. Die genaue ÖPNV-Anbindung wird hier ergänzt, sobald sie final bestätigt ist.",
  },
  {
    id: "einlass",
    category: "Vor Ort",
    question: "Was brauche ich für den Einlass?",
    answer:
      "Ticket und einen gültigen Ausweis. Taschenkontrolle ist möglich — Details zu erlaubtem Taschenformat und Gegenständen folgen vor dem Event.",
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
