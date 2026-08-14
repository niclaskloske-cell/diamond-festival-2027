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
    question: "Wann findet das Diamond Festival 2027 statt?",
    answer: `Vom Freitag, 23. Juli, bis Sonntag, 25. Juli 2027. Einlass ist täglich ab ${festival.doorsOpen} Uhr, das Programm läuft bis in die Nacht.`,
  },
  {
    id: "wo",
    category: "Allgemein",
    question: "Wo findet das Festival statt?",
    answer:
      "Auf dem Open-Air-Gelände in Wörth an der Isar, Niederbayern. Die exakte Adresse und der Lageplan werden rechtzeitig vor dem Festival hier und per E-Mail bekannt gegeben.",
  },
  {
    id: "preis",
    category: "Tickets",
    question: "Wie viel kostet ein Ticket?",
    answer:
      "Early Bird 15,00 €, Regular 18,50 €, Late Bird 20,00 €, VIP 80,00 €. Alle Tickets gelten für alle drei Festivaltage. Die Kontingente sind gestaffelt — sobald eine Stufe ausverkauft ist, gilt automatisch die nächste.",
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
      "Separater Eingang ohne Anstehen, erhöhte Sichtplattform an der Mainstage, eigene VIP-Bar, saubere Sanitäranlagen und Zugang zur Diamond Creator Lounge. Das Kontingent ist stark limitiert.",
  },
  {
    id: "umtausch",
    category: "Tickets",
    question: "Kann ich mein Ticket umtauschen oder zurückgeben?",
    answer:
      "Tickets sind personalisiert und grundsätzlich vom Widerrufsrecht ausgenommen (§ 312g Abs. 2 Nr. 9 BGB). Eine Umpersonalisierung ist bis 14 Tage vor Festivalstart über den Support möglich.",
  },
  {
    id: "parken",
    category: "Anreise",
    question: "Gibt es Parkplätze?",
    answer:
      "Ja, es gibt ausgewiesene Besucherparkplätze in Gehweite zum Gelände. Details zu Kapazität, Gebühren und Shuttle-Anbindung folgen vor dem Festival.",
  },
  {
    id: "anreise",
    category: "Anreise",
    question: "Wie komme ich ohne Auto hin?",
    answer:
      "Die genaue ÖPNV- und Shuttle-Planung steht noch nicht final fest und wird hier ergänzt, sobald sie bestätigt ist.",
  },
  {
    id: "essen",
    category: "Vor Ort",
    question: "Darf ich eigenes Essen und Getränke mitbringen?",
    answer:
      "Eigene Speisen und Getränke sind auf dem Gelände nicht erlaubt. Leere, wiederverwendbare Trinkflaschen aus Kunststoff darfst du mitbringen und kostenlos an den Wasserstationen auffüllen.",
  },
  {
    id: "bezahlen",
    category: "Vor Ort",
    question: "Wie bezahle ich vor Ort?",
    answer:
      "Bargeldlos. Alle Bars und Foodtrucks akzeptieren Karte und kontaktloses Bezahlen — kein Anstehen am Geldautomaten.",
  },
  {
    id: "wetter",
    category: "Vor Ort",
    question: "Was passiert bei schlechtem Wetter?",
    answer:
      "Das Festival findet bei jedem Wetter statt. Nur wenn Behörden oder die Sicherheitsleitung den Betrieb aus Sicherheitsgründen untersagen, wird unterbrochen oder abgebrochen — in dem Fall informieren wir über die Website und alle Social-Kanäle.",
  },
  {
    id: "creator",
    category: "Vor Ort",
    question: "Wie komme ich in die Creator Lounge?",
    answer:
      "Der Zugang ist im VIP-Ticket enthalten. Zusätzlich vergeben wir ein Kontingent an Creator-Akkreditierungen — die Bewerbung öffnet vor dem Festival.",
  },
];

export const faqCategories = [
  "Allgemein",
  "Tickets",
  "Anreise",
  "Vor Ort",
] as const;
