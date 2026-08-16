import type { Metadata } from "next";
import { Inter, Unbounded } from "next/font/google";

import { Preloader } from "@/components/effects/Preloader";
import { CheckoutProvider } from "@/components/checkout/CheckoutContext";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { festival } from "@/data/festival";
import { currentTicketStatuses, ticketTiers, tierStatus } from "@/data/tickets";

import "./globals.css";

const displayFont = Unbounded({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const title = `${festival.fullName} – ${festival.dateLabel} in ${festival.location.city}`;
const description = `${festival.fullName}: ${festival.dateLabel} in der ${festival.location.venue}, ${festival.location.city}. U. a. mit „Sie liegt in meinen Armen“. Jetzt Tickets sichern.`;

export const metadata: Metadata = {
  metadataBase: new URL(festival.siteUrl),
  title: {
    default: title,
    template: `%s – ${festival.fullName}`,
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: festival.siteUrl,
    siteName: festival.fullName,
    title,
    description,
    images: [{ url: festival.ogImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [festival.ogImage],
  },
  robots: { index: true, follow: true },
};

/** schema.org Event structured data for rich search results. */
const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicEvent",
  name: festival.fullName,
  startDate: festival.startsAt,
  endDate: festival.endsAt,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: festival.location.venue,
    address: {
      "@type": "PostalAddress",
      streetAddress: festival.location.street,
      postalCode: festival.location.postalCode,
      addressLocality: festival.location.city,
      addressCountry: festival.location.countryCode,
    },
  },
  performer: {
    "@type": "MusicGroup",
    name: "Muhabbet",
  },
  image: [`${festival.siteUrl}${festival.ogImage}`],
  description,
  doorTime: festival.doorsAt,
  typicalAgeRange: "18-",
  offers: ticketTiers.map((tier) => {
    const status = tierStatus(tier);
    return {
      "@type": "Offer",
      name: tier.name,
      price: (tier.priceCents / 100).toFixed(2),
      priceCurrency: "EUR",
      url: `${festival.siteUrl}/tickets`,
      ...(tier.availableUntil ? { validThrough: tier.availableUntil } : {}),
      availability:
        status === "on-sale"
          ? "https://schema.org/InStock"
          : status === "coming-soon"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/SoldOut",
    };
  }),
  organizer: {
    "@type": "Organization",
    name: festival.organiser,
    url: festival.siteUrl,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${displayFont.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
        <Preloader />
        <div aria-hidden="true" className="grain" />
        <CheckoutProvider>
          {children}
          <CheckoutFlow statuses={currentTicketStatuses()} />
        </CheckoutProvider>
      </body>
    </html>
  );
}
