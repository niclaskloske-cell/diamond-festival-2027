"use client";

import { useState } from "react";

import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqCategories, faqItems } from "@/data/faq";
import { cn } from "@/lib/utils";

export function Faq() {
  const [category, setCategory] = useState<(typeof faqCategories)[number] | "Alle">(
    "Alle",
  );

  const visible =
    category === "Alle" ? faqItems : faqItems.filter((f) => f.category === category);

  return (
    <section id="faq" className="section-y container-x">
      <SectionHeading eyebrow="FAQ" title="FRAGEN & ANTWORTEN" />

      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip active={category === "Alle"} onClick={() => setCategory("Alle")}>
          Alle
        </FilterChip>
        {faqCategories.map((c) => (
          <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </FilterChip>
        ))}
      </div>

      <FaqAccordion items={visible} />
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="link"
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
        active
          ? "border-diamond bg-diamond/15 text-diamond-light"
          : "border-white/12 text-muted hover:border-white/30 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
