/**
 * Social channels. `url` is intentionally empty where the account handle is not
 * confirmed yet — components render those links as disabled "coming soon"
 * states instead of dead anchors.
 */

export type SocialPlatform = "instagram" | "tiktok" | "youtube";

export type SocialChannel = {
  id: SocialPlatform;
  label: string;
  handle: string;
  url: string;
  /** Copy shown on the tile. */
  blurb: string;
};

export const socials: SocialChannel[] = [
  {
    id: "instagram",
    label: "Instagram",
    handle: "@diamondevents.de",
    url: "https://instagram.com/diamondevents.de",
    blurb: "Line-up drops, Behind the Scenes, Ticket-Verlosungen.",
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@diamondfestival2027",
    url: "https://tiktok.com/@diamondfestival2027",
    blurb: "Aftermovies, Recaps und alles, was zu laut für Instagram ist.",
  },
  {
    id: "youtube",
    label: "YouTube",
    handle: "@diamondfestival2027",
    url: "https://youtube.com/@diamondfestival2027",
    blurb: "Der offizielle Aftermovie und volle Sets in Bildqualität.",
  },
];

/**
 * Social wall tiles. Feed them from the real Instagram/TikTok API later —
 * `SOCIAL_FEED_SOURCE` marks the seam.
 */
export const SOCIAL_FEED_SOURCE = "static" as const; // TODO: "instagram-graph-api"

export type SocialTile = {
  id: string;
  platform: SocialPlatform;
  caption: string;
  image: string | null;
  url: string;
};

export const socialTiles: SocialTile[] = [
  { id: "t1", platform: "instagram", caption: "[POST 01]", image: null, url: "" },
  { id: "t2", platform: "tiktok", caption: "[POST 02]", image: null, url: "" },
  { id: "t3", platform: "instagram", caption: "[POST 03]", image: null, url: "" },
  { id: "t4", platform: "youtube", caption: "[POST 04]", image: null, url: "" },
  { id: "t5", platform: "instagram", caption: "[POST 05]", image: null, url: "" },
  { id: "t6", platform: "tiktok", caption: "[POST 06]", image: null, url: "" },
];
