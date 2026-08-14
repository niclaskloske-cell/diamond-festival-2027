"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqCategories, faqItems } from "@/data/faq";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Faq() {
  const [category, setCategory] = useState<(typeof faqCategories)[number] | "Alle">(
    "Alle",
  );
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

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

      <div className="divide-y divide-white/10 rounded-lg border border-white/10">
        {visible.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                data-cursor="link"
                aria-expanded={open}
                aria-controls={`faq-${item.id}`}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
              >
                <span className="text-sm font-semibold text-white sm:text-base">
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="shrink-0 text-diamond-light"
                >
                  <Plus className="size-4" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`faq-${item.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
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
