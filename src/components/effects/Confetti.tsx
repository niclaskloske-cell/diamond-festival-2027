"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const COLORS = ["#4caac9", "#8fe3ff", "#ffffff", "#b8f1ff"];

type Piece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  rotate: number;
  size: number;
  color: string;
};

function generatePieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 2.4 + Math.random() * 1.4,
    drift: (Math.random() - 0.5) * 160,
    rotate: Math.random() * 360,
    size: 5 + Math.random() * 6,
    color: COLORS[i % COLORS.length],
  }));
}

/**
 * One-shot confetti burst for the ticket-purchase success moment. The random
 * layout is generated in an effect (not during render) so the component stays
 * a pure function of its props, then rendered once — no interval, no
 * persistent cost.
 */
export function Confetti({ count = 60 }: { count?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    // Deferred a tick so this is an async boundary, not a synchronous
    // render-triggering call inside the effect body.
    const id = window.setTimeout(() => setPieces(generatePieces(count)), 0);
    return () => window.clearTimeout(id);
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: "-10vh", x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", x: p.drift, opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size * 0.42,
            background: p.color,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}
