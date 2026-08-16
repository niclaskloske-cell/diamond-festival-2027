export type NavLink = { label: string; href: string };

/**
 * Primary navigation — also drives the scroll-spy in the sticky header.
 * Section links are written as `/#id` (not `#id`) so they also work from
 * sub-routes like `/tickets`; `/tickets` itself is a real page.
 */
export const navLinks: NavLink[] = [
  { label: "Home", href: "/#home" },
  { label: "Line-Up", href: "/#lineup" },
  { label: "Tickets", href: "/tickets" },
  { label: "Event", href: "/#festival" },
  { label: "FAQ", href: "/#faq" },
  { label: "Kontakt", href: "/#kontakt" },
];

export const footerNav: NavLink[] = [
  { label: "Tickets", href: "/tickets" },
  { label: "Line-Up", href: "/#lineup" },
  { label: "Event", href: "/#festival" },
  { label: "Partner", href: "/#partner" },
  { label: "FAQ", href: "/#faq" },
  { label: "Kontakt", href: "/#kontakt" },
];

export const legalNav: NavLink[] = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
];

/** Section ids the scroll-spy observes on the home page. */
export const homeSectionIds = navLinks
  .filter((link) => link.href.startsWith("/#"))
  .map((link) => link.href.slice(2));
