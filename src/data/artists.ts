/**
 * Line-up data.
 *
 * Placeholder names are intentional — nothing here is invented. Replace the
 * bracketed strings with the confirmed booking, drop a photo into
 * /public/artists/<slug>.jpg and set `image` to that path. The UI renders a
 * procedural diamond gradient whenever `image` is null, so the section looks
 * finished at every stage of the booking process.
 */

export type ArtistDay = "FR" | "SA" | "SO";

export type Artist = {
  slug: string;
  name: string;
  genre: string;
  /** Set to a path under /public once the press photo exists, else null. */
  image: string | null;
  day: ArtistDay;
  /** Slot time, "HH:MM – HH:MM". Empty string until the running order is set. */
  time: string;
  stage: string;
  /** Headliners render at double width in the line-up grid. */
  headliner?: boolean;
  /**
   * "planned" = in talks / not contractually confirmed yet — renders with a
   * yellow "Geplant" badge and a yellow hover glow instead of the default
   * Diamond Blue one, so it reads as provisional at a glance. Defaults to
   * "confirmed" when omitted.
   */
  status?: "confirmed" | "planned";
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
    slug: "dj-shero",
    name: "DJ Shero",
    genre: "EDM",
    image: null,
    day: "SA",
    time: "23:00 – 00:30",
    stage: "Mainstage",
    headliner: true,
    bio: "[KURZBESCHREIBUNG DES ACTS — 1–2 Sätze für das Detail-Modal.]",
    socials: { instagram: "", tiktok: "", spotify: "" },
  },
  {
    slug: "eldestrad",
    name: "El Destrad",
    genre: "HIP-HOP",
    image: null,
    day: "FR",
    time: "22:00 – 23:15",
    stage: "Mainstage",
    headliner: true,
    bio: "[KURZBESCHREIBUNG DES ACTS]",
    socials: { instagram: "", spotify: "" },
  },
  {
    slug: "artist-03",
    name: "[ARTIST NAME 03]",
    genre: "EDM / BIG ROOM",
    image: null,
    day: "SO",
    time: "21:30 – 23:00",
    stage: "Mainstage",
    bio: "[KURZBESCHREIBUNG DES ACTS]",
    socials: { instagram: "" },
  },
  {
    slug: "artist-04",
    name: "[ARTIST NAME 04]",
    genre: "TECHNO",
    image: null,
    day: "SA",
    time: "00:30 – 02:00",
    stage: "Mainstage",
    bio: "[KURZBESCHREIBUNG DES ACTS]",
    socials: { instagram: "", tiktok: "" },
  },
  {
    slug: "artist-05",
    name: "[ARTIST NAME 05]",
    genre: "HIP-HOP / TRAP",
    image: null,
    day: "FR",
    time: "20:30 – 21:45",
    stage: "Mainstage",
    bio: "[KURZBESCHREIBUNG DES ACTS]",
    socials: { instagram: "" },
  },
  {
    slug: "artist-06",
    name: "[ARTIST NAME 06]",
    genre: "DANCE / POP",
    image: null,
    day: "SO",
    time: "19:00 – 20:15",
    stage: "Mainstage",
    bio: "[KURZBESCHREIBUNG DES ACTS]",
    socials: { instagram: "", tiktok: "" },
  },
  {
    slug: "artist-07",
    name: "[ARTIST NAME 07]",
    genre: "EDM",
    image: null,
    day: "SA",
    time: "18:00 – 19:15",
    stage: "Mainstage",
    bio: "[KURZBESCHREIBUNG DES ACTS]",
    socials: { instagram: "" },
  },
  {
    slug: "artist-08",
    name: "[ARTIST NAME 08]",
    genre: "OPENING SET",
    image: null,
    day: "FR",
    time: "16:00 – 17:30",
    stage: "Mainstage",
    bio: "[KURZBESCHREIBUNG DES ACTS]",
    socials: {},
  },
];

export const lineupDays: { id: ArtistDay; label: string; date: string }[] = [
  { id: "FR", label: "FREITAG", date: "23.07." },
  { id: "SA", label: "SAMSTAG", date: "24.07." },
  { id: "SO", label: "SONNTAG", date: "25.07." },
];

export const getArtistsByDay = (day: ArtistDay) =>
  artists.filter((a) => a.day === day);
