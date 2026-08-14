/**
 * Central festival facts. Every component reads dates, location and copy from
 * here — nothing about the event is hard-coded inside a component.
 */

export const festival = {
  name: "Diamond Festival",
  year: 2027,
  fullName: "Diamond Festival 2027",
  organiser: "Diamond Events",

  /** ISO 8601 with explicit +02:00 (CEST) so the countdown is timezone-proof. */
  startsAt: "2027-07-23T14:00:00+02:00",
  endsAt: "2027-07-25T23:00:00+02:00",
  /** TODO: replace with the confirmed gate time once the schedule is final. */
  doorsOpen: "14:00",

  dateLabel: "23. – 25. JULI 2027",
  dateLabelShort: "23.–25.07.2027",

  location: {
    city: "Wörth an der Isar",
    country: "Deutschland",
    countryCode: "DE",
    venue: "Festivalgelände Wörth an der Isar",
    /** TODO: exact street address + coordinates of the festival GROUNDS
     *  (the Baggersee site, see FestivalMap) once the site is contracted —
     *  this must not be the organiser's private/contact address. */
    street: "[STRASSE UND HAUSNUMMER]",
    postalCode: "[PLZ]",
  },

  contact: {
    email: "hallo@eventsdiamond.de",
    phone: "0163 8557552",
    press: "[PRESSE-E-MAIL]",
  },

  minAge: 16,
  minAgeNote:
    "Ab 16 Jahren mit gültigem Ausweis. Unter 18 nur mit Muttizettel (Erziehungsbeauftragung nach § 2 JuSchG) und volljähriger Begleitperson.",

  /** Used by the JSON-LD Event schema and the OG tags. */
  siteUrl: "https://diamond-festival.de",
  ogImage: "/og.jpg",
} as const;

/** Three-day, three-headline structure for THE FESTIVAL section. */
export const festivalFacts = [
  {
    id: "dates",
    label: "Termin",
    value: "23. – 25.07.2027",
    detail: "Freitag bis Sonntag. Anreise ab Freitagmittag.",
  },
  {
    id: "location",
    label: "Location",
    value: "Wörth a. d. Isar",
    detail: "Open-Air-Gelände in Niederbayern, direkt an der Isar.",
  },
  {
    id: "doors",
    label: "Einlass",
    value: "ab 14:00",
    detail: "Ticket + Ausweis am Eingang bereithalten. Kein Einlass ohne Bändchen.",
  },
  {
    id: "age",
    label: "Alter",
    value: "16+",
    detail: "Unter 18 nur mit Muttizettel und Begleitperson.",
  },
] as const;

/** The immersive blocks of THE FESTIVAL section. */
export const festivalBlocks = [
  {
    id: "gelaende",
    kicker: "01 — Gelände",
    title: "EIN GELÄNDE,\nGEBAUT FÜR NÄCHTE",
    body: "Mainstage mit vollem Line-Array, Lichtdesign über die komplette Fläche, Chill-Zonen zum Runterkommen und kurze Wege zwischen allem. Kein Laufen, kein Warten, kein Suchen.",
    accent: "diamond",
  },
  {
    id: "musik",
    kicker: "02 — Musik",
    title: "EDM.\nHIP-HOP.\nNONSTOP.",
    body: "Drei Tage durchgehendes Programm zwischen harten Drops und Rap-Sets. Lokale Acts am Nachmittag, die großen Namen nach Sonnenuntergang.",
    accent: "white",
  },
  {
    id: "food",
    kicker: "03 — Food & Drinks",
    title: "FOOD, DAS\nKEIN FESTIVAL-\nFOOD IST",
    body: "Kuratierte Foodtrucks statt Fritteusen-Einheitsbrei, vegetarisch und vegan an jedem Stand. Bars über das ganze Gelände verteilt, bargeldlos, ohne Schlange.",
    accent: "white",
  },
  {
    id: "vip",
    kicker: "04 — VIP",
    title: "VIP HEISST\nWIRKLICH VIP",
    body: "Eigener Eingang, erhöhte Sichtplattform an der Mainstage, separate Bar und saubere Sanitäranlagen. Limitiertes Kontingent.",
    accent: "diamond",
  },
] as const;

export type FestivalBlock = (typeof festivalBlocks)[number];
