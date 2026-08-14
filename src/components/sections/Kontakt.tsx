import { Mail, Newspaper, Phone } from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/kontakt/ContactForm";
import { festival } from "@/data/festival";

const isPlaceholder = (value: string) => value.startsWith("[");

const CONTACTS = [
  { icon: Mail, label: "Allgemeine Anfragen", value: festival.contact.email, href: `mailto:${festival.contact.email}` },
  { icon: Phone, label: "Telefon", value: festival.contact.phone, href: `tel:${festival.contact.phone}` },
  { icon: Newspaper, label: "Presse", value: festival.contact.press, href: `mailto:${festival.contact.press}` },
];

export function Kontakt() {
  return (
    <section id="kontakt" className="section-y container-x">
      <SectionHeading eyebrow="Kontakt" title="SPRICH MIT UNS" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CONTACTS.map((c) => {
          const placeholder = isPlaceholder(c.value);
          return (
            <div key={c.label} className="rounded-md border border-white/10 bg-surface p-6">
              <c.icon className="size-5 text-diamond-light" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                {c.label}
              </p>
              {placeholder ? (
                <p className="mt-1.5 text-sm text-faint">Wird bekannt gegeben</p>
              ) : (
                <a
                  href={c.href}
                  data-cursor="link"
                  className="mt-1.5 block text-sm font-medium text-white transition-colors hover:text-diamond-light"
                >
                  {c.value}
                </a>
              )}
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-6 max-w-2xl">
        <ContactForm />
      </div>
    </section>
  );
}
