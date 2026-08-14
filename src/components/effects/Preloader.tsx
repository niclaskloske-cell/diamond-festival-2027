"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { DiamondMark } from "./DiamondMark";
import { useReducedMotion, useScrollLock } from "@/lib/hooks";
import { festival } from "@/data/festival";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Total time on screen, ms. Kept under 2s per spec. */
const DURATION = 1750;

/**
 * Black screen → diamond grows → light beam → wordmark → curtain opens.
 * Runs once per browser session (sessionStorage), not on every route change.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("df27-preloaded");
    // setState is deferred a tick so this stays an async boundary rather than
    // a synchronous render-triggering call inside the effect body.
    if (seen) {
      const id = window.setTimeout(() => {
        setSkip(true);
        setDone(true);
      }, 0);
      return () => window.clearTimeout(id);
    }
    sessionStorage.setItem("df27-preloaded", "1");
    const showId = window.setTimeout(() => setSkip(false), 0);
    const timer = window.setTimeout(
      () => setDone(true),
      reduced ? 200 : DURATION,
    );
    return () => {
      window.clearTimeout(showId);
      window.clearTimeout(timer);
    };
  }, [reduced]);

  useScrollLock(!done);

  if (skip) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.7, ease: EASE, delay: 0.05 },
          }}
        >
          <div className="relative flex flex-col items-center gap-6">
            {/* Light burst behind the diamond */}
            <motion.div
              aria-hidden
              className="glow-diamond absolute size-64 -translate-y-2"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 0.9, 0.4], scale: [0.4, 1.4, 1.1] }}
              transition={{ duration: 1.1, times: [0, 0.6, 1], ease: EASE }}
            />

            <motion.div
              initial={{ scale: 0.2, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.85, ease: EASE }}
              className="relative text-diamond-light"
            >
              <DiamondMark className="size-16" strokeWidth={1.5} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.32em" }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
              className="text-center text-[0.7rem] font-semibold uppercase text-muted"
            >
              {festival.fullName}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
