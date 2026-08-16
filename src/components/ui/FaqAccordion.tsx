"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import type { FaqItem } from "@/data/faq";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Single-open accordion. Used by the home FAQ section and the ticket page —
 * `idPrefix` keeps the aria-controls ids unique if both ever share a page.
 */
export function FaqAccordion({
  items,
  idPrefix = "faq",
}: {
  items: FaqItem[];
  idPrefix?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-white/10 rounded-lg border border-white/10">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              data-cursor="link"
              aria-expanded={open}
              aria-controls={`${idPrefix}-${item.id}`}
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
                  id={`${idPrefix}-${item.id}`}
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
  );
}
