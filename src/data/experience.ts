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
    line: "Ein Abend, ein Mainact — Muhabbet live in voller Arena-Akustik.",
    image: null,
    hue: 196,
  },
  {
    id: "lights",
    index: "02",
    title: "LIGHTS",
    line: "Lichtdesign, das für Konzerthallen gebaut ist. Von jedem Platz sichtbar.",
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
    line: "Der Moment, in dem die ganze Arena mitsingt.",
    image: null,
    hue: 320,
  },
  {
    id: "diamond",
    index: "05",
    title: "DIAMOND",
    line: "Und danach zählst du die Tage bis zur nächsten Diamond Night.",
    image: null,
    hue: 188,
  },
];
