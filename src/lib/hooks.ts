"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** SSR-safe layout effect. */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* -------------------------------------------------------------------------- */
/* Countdown                                                                   */
/* -------------------------------------------------------------------------- */

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** False until the first client tick — prevents an SSR/CSR mismatch. */
  ready: boolean;
  /** True once the target date has passed. */
  isOver: boolean;
};

function diff(target: number): Omit<Countdown, "ready"> {
  const delta = target - Date.now();
  if (delta <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }
  const s = Math.floor(delta / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    isOver: false,
  };
}

/**
 * Live countdown to an ISO date. Renders zeros on the server and starts ticking
 * after hydration, so the markup never mismatches.
 */
export function useCountdown(isoDate: string): Countdown {
  const target = new Date(isoDate).getTime();
  const [state, setState] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
    ready: false,
  });

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const tick = () => setState({ ...diff(target), ready: true });
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return state;
}

/* -------------------------------------------------------------------------- */
/* Media queries                                                               */
/* -------------------------------------------------------------------------- */

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** True only on devices with a precise pointer — gates the custom cursor. */
export const useHasFinePointer = () =>
  useMediaQuery("(hover: hover) and (pointer: fine)");

export const useReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/* -------------------------------------------------------------------------- */
/* Scroll lock                                                                 */
/* -------------------------------------------------------------------------- */

let lockCount = 0;

/** Reference-counted body scroll lock (preloader + nav + modal can overlap). */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockCount += 1;
    document.body.dataset.scrollLocked = "true";
    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) delete document.body.dataset.scrollLocked;
    };
  }, [active]);
}

/* -------------------------------------------------------------------------- */
/* Scroll position                                                             */
/* -------------------------------------------------------------------------- */

/** Passive scroll listener throttled to one update per animation frame. */
export function useScrollY() {
  const [y, setY] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setY(window.scrollY);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return y;
}

/* -------------------------------------------------------------------------- */
/* Scroll spy                                                                  */
/* -------------------------------------------------------------------------- */

/** Returns the id of the section currently occupying the viewport centre. */
export function useScrollSpy(ids: string[], offset = 0.35) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: `-${offset * 100}% 0px -${(1 - offset) * 100}% 0px` },
    );

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [ids, offset]);

  return active;
}

/* -------------------------------------------------------------------------- */
/* Magnetic pointer                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Pulls an element toward the cursor. Disabled on coarse pointers and when the
 * user prefers reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.32) {
  const ref = useRef<T>(null);
  const fine = useHasFinePointer();
  const reduced = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!fine || reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setOffset({
        x: (e.clientX - (rect.left + rect.width / 2)) * strength,
        y: (e.clientY - (rect.top + rect.height / 2)) * strength,
      });
    },
    [fine, reduced, strength],
  );

  const reset = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  return { ref, offset, onMove, reset, enabled: fine && !reduced };
}
