"use client";

import { motion } from "framer-motion";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { festivalBlocks, festivalFacts } from "@/data/festival";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Festival() {
  return (
    <section id="festival" className="section-y container-x">
      <SectionHeading eyebrow="Event" title="DIE DIAMOND NIGHT" />

      {/* Fact strip */}
      <div className="mb-20 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 xs:grid-cols-2 sm:grid-cols-4">
        {festivalFacts.map((fact, i) => (
          <motion.div
            key={fact.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
            className="min-w-0 bg-bg p-6"
          >
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-diamond-light">
              {fact.label}
            </p>
            <p className="mt-2 break-words font-display text-2xl font-extrabold text-white sm:text-3xl">
              {fact.value}
            </p>
            <p className="mt-2 text-xs text-muted">{fact.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Immersive blocks */}
      <div className="space-y-6">
        {festivalBlocks.map((block, i) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className={cn(
              "edge relative grid grid-cols-1 overflow-hidden rounded-lg bg-surface lg:grid-cols-2",
              i % 2 === 1 && "lg:[direction:rtl]",
            )}
          >
            {/* Visual side — procedural, no stock-photo look */}
            <div
              className="relative min-h-[16rem] overflow-hidden lg:[direction:ltr]"
              aria-hidden
            >
              <div
                className={cn(
                  "absolute inset-0",
                  block.accent === "diamond"
                    ? "bg-[radial-gradient(120%_100%_at_20%_10%,rgba(76,170,201,0.35)_0%,transparent_60%)]"
                    : "bg-[radial-gradient(120%_100%_at_80%_90%,rgba(255,255,255,0.08)_0%,transparent_60%)]",
                )}
              />
              <div className="absolute inset-0 bg-surface-2" style={{ mixBlendMode: "multiply" }} />
              <span className="absolute bottom-6 left-6 font-display text-7xl font-extrabold text-white/10 sm:text-8xl">
                {block.kicker.split(" — ")[0]}
              </span>
            </div>

            <div className="flex flex-col justify-center p-8 lg:[direction:ltr] sm:p-12">
              <p className="text-eyebrow text-diamond-light">{block.kicker}</p>
              <h3 className="mt-3 whitespace-pre-line font-display text-3xl font-extrabold uppercase leading-[0.95] text-white sm:text-4xl">
                {block.title}
              </h3>
              <p className="mt-5 max-w-md text-muted">{block.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
