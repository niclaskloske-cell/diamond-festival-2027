/**
 * Line-up data for the single-night show — no day-splitting needed, so this
 * is just a flat, ordered list (mainact first).
 *
 * Placeholder names are intentional where present — nothing here is invented.
 * Replace bracketed strings with the confirmed booking, drop a photo into
 * /public/artists/<slug>.jpg and set `image` to that path. The UI renders a
 * procedural diamond gradient whenever `image` is null, so the section looks
 * finished at every stage of the booking process.
 */

export type Artist = {
  slug: string;
  name: string;
  genre: string;
  /** Set to a path under /public once the press photo exists, else null. */
  image: string | null;
  /** Slot time, "HH:MM – HH:MM". Empty string until the running order is set. */
  time: string;
  /** Mainact renders at double width in the line-up grid. */
  headliner?: boolean;
  /**
   * "planned" = in talks / not contractually confirmed yet — renders with a
   * yellow "Geplant" badge and a yellow hover glow instead of the default
   * Diamond Blue one, so it reads as provisional at a glance. Defaults to
   * "confirmed" when omitted.
   */
  status?: "confirmed" | "planned";
  /**
   * True for a booking that's real but not yet publicly named (kept back for
   * reach/marketing reasons). The name still needs a value (used for a11y —
   * screen readers, aria-labels) but the UI blurs it visually instead of
   * showing readable text.
   */
  censored?: boolean;
  bio: string;
  socials: {
    instagram?: string;
    tiktok?: string;
    spotify?: string;
    youtube?: string;
  };
};

export const artists: Artist[] = [
  {
    slug: "muhabbet",
    name: "Muhabbet",
    genre: "R&B",
    image: "/artists/muhabbet.jpg",
    time: "",
    headliner: true,
    status: "confirmed",
    bio: "Mainact des Abends — einer der prägendsten Namen im deutschen R&B, u. a. bekannt für seinen Hit „Sie liegt in meinen Armen“.",
    socials: {},
  },
  {
    slug: "dj-shero",
    name: "DJ Shero",
    genre: "DJ Set",
    image: "/artists/dj-shero.jpg",
    time: "",
    status: "confirmed",
    bio: "[KURZBESCHREIBUNG DES ACTS — 1–2 Sätze für das Detail-Modal.]",
    socials: { instagram: "", tiktok: "", spotify: "" },
  },
  {
    slug: "eldestrad",
    name: "El Destrad",
    genre: "HIP-HOP",
    image: "/artists/eldestrad.jpg",
    time: "",
    status: "confirmed",
    bio: "[KURZBESCHREIBUNG DES ACTS]",
    socials: { instagram: "", spotify: "" },
  },
  {
    slug: "support-dj-tba",
    name: "[DJ WIRD BEKANNT GEGEBEN]",
    genre: "DJ Set",
    image: null,
    time: "",
    bio: "Ein weiterer DJ-Slot ist für den Abend reserviert — Bekanntgabe folgt.",
    socials: {},
  },
];
