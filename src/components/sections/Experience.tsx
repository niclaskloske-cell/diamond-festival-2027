"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { experienceChapters } from "@/data/experience";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Pins the section for the height of one extra viewport and translates the
 * chapter track horizontally as the user scrolls vertically past it — a
 * scroll-driven storytelling reveal without a horizontal-scroll container
 * (which fights trackpads and mobile scroll).
 */
export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const count = experienceChapters.length;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(count - 1) * 100}%`]);

  if (reduced) {
    return (
      <section className="section-y container-x space-y-4">
        {experienceChapters.map((c) => (
          <Chapter key={c.id} chapter={c} />
        ))}
      </section>
    );
  }

  return (
    <section ref={ref} style={{ height: `${count * 100}vh` }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ x }} className="flex h-full">
          {experienceChapters.map((chapter) => (
            <div key={chapter.id} className="h-full w-screen shrink-0">
              <Chapter chapter={chapter} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Chapter({ chapter }: { chapter: (typeof experienceChapters)[number] }) {
  return (
    <div className="container-x relative flex h-full flex-col items-start justify-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(60% 60% at 20% 50%, hsl(${chapter.hue} 70% 14%) 0%, transparent 65%)`,
        }}
      />
      <span className="font-display text-sm font-bold text-diamond-light">
        {chapter.index}
      </span>
      <h3 className="mt-3 font-display text-display-lg uppercase leading-none text-white">
        {chapter.title}
      </h3>
      <p className="mt-6 max-w-sm text-muted">{chapter.line}</p>
    </div>
  );
}
