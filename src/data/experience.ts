/** Horizontal storytelling scroll: MUSIC → LIGHTS → PEOPLE → ENERGY → DIAMOND. */

export type ExperienceChapter = {
  id: string;
  index: string;
  title: string;
  line: string;
  /** Optional background image path under /public. Null renders the gradient. */
  image: string | null;
  /** Drives the per-chapter hue of the procedural backdrop. 0–360. */
  hue: number;
};

export const experienceChapters: ExperienceChapter[] = [
  {
    id: "music",
    index: "01",
    title: "MUSIC",
    line: "Drei Tage Programm ohne Leerlauf. Von Sonnenuntergang bis Sonnenaufgang.",
    image: null,
    hue: 196,
  },
  {
    id: "lights",
    index: "02",
    title: "LIGHTS",
    line: "Lichtdesign über die komplette Fläche. Jeder Drop sichtbar bis in die letzte Reihe.",
    image: null,
    hue: 210,
  },
  {
    id: "people",
    index: "03",
    title: "PEOPLE",
    line: "Die, mit denen du hinfährst. Und die, die du dort triffst.",
    image: null,
    hue: 262,
  },
  {
    id: "energy",
    index: "04",
    title: "ENERGY",
    line: "Der Moment, in dem alle gleichzeitig die Hände oben haben.",
    image: null,
    hue: 320,
  },
  {
    id: "diamond",
    index: "05",
    title: "DIAMOND",
    line: "Und danach zählst du die Tage bis zum nächsten Jahr.",
    image: null,
    hue: 188,
  },
];

/** DIAMOND CREATOR LOUNGE feature list. */
export const creatorFeatures = [
  {
    id: "lounge",
    title: "Creator Lounge",
    body: "Eigener, ruhiger Bereich mit Sitzgelegenheiten, Ladestationen und schnellem WLAN — zum Schneiden, Posten und Durchatmen.",
  },
  {
    id: "spots",
    title: "Foto- & Video-Spots",
    body: "Gebaute Setups mit richtigem Licht. Keine Handy-Blitz-Bilder, sondern Content, der auch morgen noch gut aussieht.",
  },
  {
    id: "networking",
    title: "Networking",
    body: "Creator, Fotograf:innen und Artists an einem Ort. Ohne Anmeldung, ohne Türsteher-Getue.",
  },
  {
    id: "meet",
    title: "Meet & Greets",
    body: "Ausgewählte Slots mit Acts aus dem Line-up. Kontingente werden vor dem Festival vergeben.",
  },
] as const;
