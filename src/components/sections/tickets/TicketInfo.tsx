import {
  BadgeCheck,
  CreditCard,
  ScanLine,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

import { festival } from "@/data/festival";
import {
  FEE_NOTE,
  getTier,
  REDUCED_ELIGIBILITY,
  REDUCED_NO_PROOF_RULE,
  TICKET_DELIVERY,
} from "@/data/tickets";
import { formatPrice } from "@/lib/utils";

const reduced = getTier("ermaessigt")!;

type InfoCard = {
  id: string;
  icon: LucideIcon;
  title: string;
  body: string;
};

/**
 * Everything a buyer needs to know before checkout. The one open point —
 * which payment methods appear — stays an explicit placeholder until the
 * provider is connected.
 */
const CARDS: InfoCard[] = [
  {
    id: "ermaessigung",
    icon: BadgeCheck,
    title: "Ermäßigung & Nachweis",
    body: `Das ermäßigte Ticket kostet ${formatPrice(reduced.priceCents)} und gilt für ${REDUCED_ELIGIBILITY}. Der Nachweis wird am Einlass vorgezeigt. ${REDUCED_NO_PROOF_RULE}`,
  },
  {
    id: "personalisiert",
    icon: UserCheck,
    title: "Personalisierte Tickets",
    body: "Tickets laufen auf deinen Namen und sind grundsätzlich vom Widerrufsrecht ausgenommen (§ 312g Abs. 2 Nr. 9 BGB). Eine Umpersonalisierung ist bis 14 Tage vor dem Event über den Support möglich.",
  },
  {
    id: "einlass",
    icon: ScanLine,
    title: "Einlass ab 18",
    body: `Einlass ${festival.doorsOpen}, Beginn ${festival.showStart}. Am Einlass brauchst du dein Ticket und einen gültigen Ausweis — die Diamond Night ist ab 18 Jahren. Waffen, waffenähnliche und gefährliche Gegenstände, Pyrotechnik, Glas und Dosen bleiben draußen; eine Taschenkontrolle ist möglich.`,
  },
  {
    id: "bezahlung",
    icon: CreditCard,
    title: "Bezahlung & Versand",
    body: `Bezahlt wird per Kreditkarte, PayPal oder Klarna. ${TICKET_DELIVERY} ${FEE_NOTE}`,
  },
];

export function TicketInfo() {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
      {CARDS.map((card) => (
        <div key={card.id} className="bg-bg p-7">
          <card.icon className="size-5 text-diamond-light" />
          <h3 className="mt-4 font-display text-base font-extrabold uppercase tracking-[0.02em] text-white">
            {card.title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-muted">{card.body}</p>
        </div>
      ))}
    </div>
  );
}
