"use client";

import { motion } from "framer-motion";

import { useReducedMotion } from "@/lib/hooks";

const BEAMS = [
  { left: "12%", width: "18vw", rotate: -14, delay: 0, opacity: 0.16 },
  { left: "34%", width: "10vw", rotate: -6, delay: 1.4, opacity: 0.22 },
  { left: "58%", width: "14vw", rotate: 8, delay: 0.7, opacity: 0.18 },
  { left: "78%", width: "22vw", rotate: 16, delay: 2.1, opacity: 0.13 },
];

/**
 * Stage light beams sweeping from above. Pure transform/opacity animation, so
 * it stays on the compositor.
 */
export function LightBeams({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {BEAMS.map((beam, i) => (
        <motion.div
          key={i}
          className="absolute -top-1/3 h-[160%] origin-top will-change-transform"
          style={{
            left: beam.left,
            width: beam.width,
            rotate: `${beam.rotate}deg`,
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--color-diamond-light) 70%, transparent) 0%, transparent 72%)",
            filter: "blur(38px)",
          }}
          initial={{ opacity: beam.opacity * 0.6 }}
          animate={
            reduced
              ? { opacity: beam.opacity * 0.6 }
              : {
                  opacity: [beam.opacity * 0.45, beam.opacity, beam.opacity * 0.45],
                  x: ["-3%", "3%", "-3%"],
                }
          }
          transition={{
            duration: 9 + i * 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: beam.delay,
          }}
        />
      ))}
    </div>
  );
}
