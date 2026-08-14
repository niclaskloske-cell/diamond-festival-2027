"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { useHasFinePointer, useReducedMotion } from "@/lib/hooks";

/**
 * Replaces the native cursor with a dot + trailing ring on fine-pointer
 * devices. Elements opt in to the "hover" state via `data-cursor="link"` /
 * `data-cursor="magnetic"`; text inputs get a text-caret variant.
 *
 * Toggles `html.has-custom-cursor`, which is what actually hides the native
 * cursor (see globals.css) — kept in sync with readiness so there's never a
 * frame with neither cursor visible.
 */
export function CustomCursor() {
  const fine = useHasFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.4 });

  const [variant, setVariant] = useState<"default" | "link" | "text">("default");
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);
  const readyRef = useRef(false);

  useEffect(() => {
    document.documentElement.classList.toggle("has-custom-cursor", enabled);
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!readyRef.current) {
        readyRef.current = true;
        setVisible(true);
      }
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'a, button, [data-cursor="link"], [data-cursor="magnetic"], [role="button"]',
      );
      const textField = target?.closest("input, textarea, [contenteditable]");
      setVariant(interactive ? "link" : textField ? "text" : "default");
    };

    const down_ = () => setDown(true);
    const up = () => setDown(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down_);
    window.addEventListener("pointerup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down_);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      {/* Trailing ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: down ? 0.85 : variant === "link" ? 1.9 : variant === "text" ? 0.6 : 1,
        }}
        transition={{ scale: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
        className="absolute top-0 left-0 -ml-4 -mt-4 size-8 rounded-full border border-white/60 mix-blend-difference"
      />
      {/* Core dot */}
      <motion.div
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0, scale: down ? 1.4 : variant === "link" ? 0 : 1 }}
        transition={{ scale: { duration: 0.18 } }}
        className="absolute top-0 left-0 -ml-1 -mt-1 size-2 rounded-full bg-white mix-blend-difference"
      />
    </div>
  );
}
