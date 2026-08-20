/**
 * Central event facts. Every component reads dates, location and copy from
 * here — nothing about the event is hard-coded inside a component.
 *
 * Kept as `festival` internally (touches a lot of files) even though this is
 * now a single-night indoor show, not a multi-day open-air festival — see
 * the 2026-08-14 pivot from "Diamond Festival" to "Diamond Night".
 */

export const festival = {
  name: "Diamond Night",
  year: 2026,
  fullName: "Diamond Night — Muhabbet live",
  organiser: "Diamond Events",

  /** Countdown target — show start, not doors. */
  startsAt: "2026-12-05T21:00:00+01:00",
  endsAt: "2026-12-06T00:00:00+01:00",
  doorsAt: "2026-12-05T20:00:00+01:00",
  doorsOpen: "20:00 Uhr",
  showStart: "21:00 Uhr",

  dateLabel: "05. DEZEMBER 2026",
  dateLabelShort: "05.12.2026",

  location: {
    city: "Landshut",
    country: "Deutschland",
    countryCode: "DE",
    venue: "Sparkassen-Arena Landshut",
    street: "Niedermayerstraße 100",
    postalCode: "84036",
  },

  contact: {
    /** General enquiries — also the recipient of the contact form. */
    email: "support@diamond-night.de",
    phone: "08702 4538793",
    press: "presse@diamond-night.de",
    /** Sender address for order confirmations / e-tickets. */
    tickets: "tickets@diamond-night.de",
  },

  minAge: 18 as number | null,
  minAgeNote: "Einlass ab 18 Jahren — Ausweiskontrolle am Einlass.",

  /** Used by the JSON-LD Event schema and the OG tags. */
  siteUrl: "https://diamondfestival.de",
  ogImage: "/og.jpg",
} as const;

/** Fact strip for the event info section. */
export const festivalFacts = [
  {
    id: "dates",
    label: "Termin",
    value: "05.12.2026",
    detail: "Ein Abend, eine Bühne. Einlass 20:00 Uhr, Beginn 21:00 Uhr.",
  },
  {
    id: "location",
    label: "Location",
    value: "Sparkassen-Arena",
    detail: "Niedermayerstraße 100, 84036 Landshut.",
  },
  {
    id: "mainact",
    label: "Mainact",
    value: "Muhabbet",
    detail: "U. a. mit „Sie liegt in meinen Armen“.",
  },
  {
    id: "age",
    label: "Alter",
    value: "18+",
    detail: "Einlass ab 18 Jahren. Bitte Ausweis mitbringen.",
  },
] as const;

/** The immersive blocks of the event info section. */
export const festivalBlocks = [
  {
    id: "arena",
    kicker: "01 — Arena",
    title: "EINE ARENA,\nGEBAUT FÜR SOUND",
    body: "Die Sparkassen-Arena Landshut bringt volle Konzert-Akustik und klare Sichtlinien von jedem Platz — kein Open-Air-Wetterrisiko, kein langes Anstehen im Matsch.",
    accent: "diamond",
  },
  {
    id: "mainact",
    kicker: "02 — Mainact",
    title: "MUHABBET.\nLIVE.\nHAUTNAH.",
    body: "Ein Abend mit einem der prägendsten Namen im deutschen R&B — u. a. mit seinem Hit „Sie liegt in meinen Armen“.",
    accent: "white",
  },
  {
    id: "anfahrt",
    kicker: "03 — Anfahrt",
    title: "GUT ANGEBUNDEN,\nKURZE WEGE",
    body: "Vom Landshuter Hauptbahnhof fährt die Linie 603 direkt zur Haltestelle Sparkassen-Arena. Parkplätze gibt es direkt am Gelände — first come, first served.",
    accent: "white",
  },
  {
    id: "vip",
    kicker: "04 — VIP",
    title: "VIP HEISST\nWIRKLICH VIP",
    body: "Bevorzugter Einlass und die beste Sichtkategorie im Haus. Limitiertes Kontingent.",
    accent: "diamond",
  },
] as const;

export type FestivalBlock = (typeof festivalBlocks)[number];
