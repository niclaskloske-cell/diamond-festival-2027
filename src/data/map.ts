/**
 * Festival ground plan.
 *
 * The map is the actual reference render (`/map/gelaendeplan.png`) — it
 * already draws the field, the Baggersee, parking and every zone's label.
 * `mapAreas` are invisible hotspots laid exactly over that image (in its own
 * native pixel grid, 1166×1349) so each zone is still hoverable/tappable and
 * shows its description below the map, without redrawing anything the image
 * already renders. Every polygon was traced automatically from the image's
 * actual neon-outline pixels (see scripts/detect-zones.mjs), not eyeballed —
 * so the hotspots line up exactly with what's drawn.
 */

export const MAP_IMAGE = {
  src: "/map/gelaendeplan.png",
  width: 1166,
  height: 1349,
  alt: "Festivalgelände Diamond Festival 2027 — Lageplan mit allen Bereichen",
} as const;

export type MapAreaId =
  | "eingang"
  | "sanitaer"
  | "thirdstage"
  | "secondstage"
  | "gaestebereich-nord"
  | "vip"
  | "security"
  | "medical"
  | "rettungsweg"
  | "gaestebereich-sued"
  | "mainstage"
  | "backstage";

export type MapArea = {
  id: MapAreaId;
  label: string;
  description: string;
  /** SVG polygon path over the zone, in the image's native 1166×1349 grid. */
  path: string;
  /** Hover highlight colour, matching the zone's neon outline in the image. */
  glowColor: string;
};

const GREEN = "#7CFA46";
const CYAN = "#2BE8E0";
const BLUE = "#3D74E0";
const MAGENTA = "#F0339C";
const YELLOW = "#EFE23C";
const LIME = "#C6F23C";

export const mapAreas: MapArea[] = [
  {
    id: "eingang",
    label: "Eingang",
    description: "Ticketkontrolle, Einlasskontrolle und Bändchenausgabe.",
    path: "M 180 144 L 198 120 L 245 156 L 335 229 L 313 253 L 181 149 Z",
    glowColor: GREEN,
  },
  {
    id: "sanitaer",
    label: "Sanitär",
    description: "Sanitäranlagen inkl. barrierefreier Kabinen, direkt am Eingang.",
    path: "M 92 260 L 163 157 L 258 235 L 256 240 L 181 333 L 91 264 Z",
    glowColor: CYAN,
  },
  {
    id: "thirdstage",
    label: "Third Stage",
    description: "Kleinste der drei Bühnen, tagsüber lokale Acts und Newcomer.",
    path: "M 476 212 L 547 167 L 597 235 L 530 285 L 522 288 L 473 218 Z",
    glowColor: BLUE,
  },
  {
    id: "secondstage",
    label: "Second Stage",
    description: "Zweitgrößte Bühne mit durchgehendem Programm.",
    path: "M 505 517 L 559 476 L 607 535 L 607 545 L 550 588 L 505 522 Z",
    glowColor: BLUE,
  },
  {
    id: "gaestebereich-nord",
    label: "Gästebereich",
    description: "Offene Fläche zwischen Second und Third Stage, mit Blick auf beide.",
    path: "M 560 475 L 617 358 L 627 363 L 751 550 L 620 543 L 611 541 Z",
    glowColor: MAGENTA,
  },
  {
    id: "vip",
    label: "VIP",
    description: "Erhöhte Sichtplattform, eigene Bar, separater Eingang.",
    path: "M 421 608 L 475 558 L 514 604 L 520 613 L 467 662 L 462 657 Z",
    glowColor: YELLOW,
  },
  {
    id: "security",
    label: "Security",
    description: "Security-Zelt, zentral zwischen VIP und Rettungsweg.",
    path: "M 497 667 L 504 666 L 561 666 L 561 722 L 498 722 L 497 721 Z",
    glowColor: CYAN,
  },
  {
    id: "medical",
    label: "Erste Hilfe",
    description: "Sanitätsstation, rund um die Uhr besetzt.",
    path: "M 544 734 L 545 733 L 602 734 L 602 789 L 544 789 Z",
    glowColor: CYAN,
  },
  {
    id: "rettungsweg",
    label: "Rettungsweg",
    description: "Freizuhaltende Rettungsgasse zwischen Gästebereich und Mainstage.",
    path: "M 564 817 L 595 805 L 611 844 L 671 998 L 637 1011 L 571 839 Z",
    glowColor: CYAN,
  },
  {
    id: "gaestebereich-sued",
    label: "Gästebereich",
    description: "Hauptfläche direkt vor der Mainstage, mit Blick aufs Wasser.",
    path: "M 669 799 L 869 689 L 930 773 L 928 779 L 755 965 L 752 961 Z",
    glowColor: MAGENTA,
  },
  {
    id: "mainstage",
    label: "Mainstage",
    description: "Hauptbühne mit Line-Array, LED-Wall und Lichtdesign — direkt am Ufer.",
    path: "M 930 795 L 1025 924 L 898 1071 L 767 971 Z",
    glowColor: LIME,
  },
  {
    id: "backstage",
    label: "Backstage",
    description: "Artist-Bereich hinter der Mainstage. Nur mit Akkreditierung.",
    path: "M 753 982 L 731 997 L 796 1191 L 889 1085 Z",
    glowColor: CYAN,
  },
];
