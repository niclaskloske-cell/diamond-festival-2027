/**
 * Partners & sponsors.
 *
 * Empty on purpose — no names are invented here. Once real partners are
 * confirmed or in talks, add them below; the section renders a clean empty
 * state until then instead of showing placeholder logos.
 */

export type PartnerTier = "hauptsponsor" | "sponsor" | "partner";

export type Partner = {
  id: string;
  name: string;
  tier: PartnerTier;
  /** Set to a path under /public once the logo file exists, else null. */
  logo: string | null;
  url: string;
  /**
   * "planned" = in Gesprächen / noch nicht final bestätigt — rendert mit
   * gelbem Hover-Glow statt dem normalen Diamond-Blau. Defaults to
   * "confirmed" when omitted.
   */
  status?: "confirmed" | "planned";
};

export const partners: Partner[] = [];

export const partnerTierLabels: Record<PartnerTier, string> = {
  hauptsponsor: "Hauptsponsor",
  sponsor: "Sponsor",
  partner: "Partner",
};
