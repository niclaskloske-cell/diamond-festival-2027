export type NavLink = { label: string; href: string };

/** Primary navigation — also drives the scroll-spy in the sticky header. */
export const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Line-Up", href: "#lineup" },
  { label: "Tickets", href: "#tickets" },
  { label: "Event", href: "#festival" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
];

export const footerNav: NavLink[] = [
  { label: "Tickets", href: "#tickets" },
  { label: "Line-Up", href: "#lineup" },
  { label: "Event", href: "#festival" },
  { label: "Partner", href: "#partner" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
];

export const legalNav: NavLink[] = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
];
