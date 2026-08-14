"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";

import { DiamondMark } from "@/components/effects/DiamondMark";
import { LightBeams } from "@/components/effects/LightBeams";
import { Particles } from "@/components/effects/Particles";
import { ButtonLink } from "@/components/ui/Button";
import { festival } from "@/data/festival";
import { useCountdown, useHasFinePointer, useReducedMotion } from "@/lib/hooks";
import { pad } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const fine = useHasFinePointer();
  const reduced = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  const cursorGlowX = useTransform(springX, (v) => `${50 + v * 12}%`);
  const cursorGlowY = useTransform(springY, (v) => `${50 + v * 12}%`);
  const diamondX = useTransform(springX, (v) => v * 26);
  const diamondY = useTransform(springY, (v) => v * 18);
  const parallaxBgX = useTransform(springX, (v) => v * -14);
  const parallaxBgY = useTransform(springY, (v) => v * -10);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!fine || reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-bg"
    >
      {/* Backdrop */}
      <motion.div
        aria-hidden
        style={fine && !reduced ? { x: parallaxBgX, y: parallaxBgY } : undefined}
        className="absolute inset-[-4%]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(76,170,201,0.16)_0%,rgba(5,5,5,0)_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_82%_78%,rgba(76,170,201,0.14)_0%,transparent_70%)]" />
        {/* Warm sunset counterpoint — a July-festival cue against the cool diamond blue. */}
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_8%_88%,rgba(255,111,94,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_35%_at_92%_8%,rgba(255,182,72,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,var(--color-bg)_96%)]" />
      </motion.div>

      <LightBeams className="opacity-90" />
      <div className="absolute inset-0">
        <Particles density={54} />
      </div>

      {/* Cursor-follow glow */}
      {fine && !reduced && (
        <motion.div
          aria-hidden
          className="glow-diamond pointer-events-none absolute size-[42rem] -translate-x-1/2 -translate-y-1/2 opacity-60"
          style={{ left: cursorGlowX, top: cursorGlowY }}
        />
      )}

      {/* Floating diamond accents */}
      <motion.div
        aria-hidden
        style={fine && !reduced ? { x: diamondX, y: diamondY } : undefined}
        className="pointer-events-none absolute right-[8%] top-[22%] hidden text-diamond-light/70 md:block animate-float-slow"
      >
        <DiamondMark className="size-10" facets={false} />
      </motion.div>
      <motion.div
        aria-hidden
        style={fine && !reduced ? { x: diamondX, y: diamondY } : undefined}
        className="pointer-events-none absolute left-[10%] top-[38%] hidden text-white/25 lg:block animate-float-slow [animation-delay:-3s]"
      >
        <DiamondMark className="size-6" facets={false} />
      </motion.div>

      {/* Content */}
      <div className="container-x relative z-10 flex flex-1 flex-col justify-center pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="mb-6 flex items-center gap-2 text-eyebrow text-diamond-light"
        >
          <MapPin className="size-3.5" />
          <span>WÖRTH AN DER ISAR</span>
        </motion.div>

        <h1 className="font-display text-display-xl uppercase text-white">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            className="block"
          >
            DIAMOND
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.18 }}
            className="block"
          >
            FESTIVAL
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.31 }}
            className="text-sheen block"
          >
            2027
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          className="mt-6 max-w-md text-lg text-muted"
        >
          {festival.dateLabel} — drei Tage EDM, Hip-Hop und Diamond-Energie unter
          freiem Himmel.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.62 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <ButtonLink href="#tickets" size="lg" icon={<ArrowRight className="size-4" />}>
            Tickets sichern
          </ButtonLink>
          <ButtonLink href="#lineup" size="lg" variant="outline">
            Line-Up entdecken
          </ButtonLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.8 }}
          className="mt-14"
        >
          <Countdown />
        </motion.div>
      </div>

      <motion.a
        href="#lineup"
        data-cursor="link"
        aria-label="Nach unten scrollen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="relative z-10 mx-auto mb-8 flex flex-col items-center gap-2 text-muted"
      >
        <span className="text-eyebrow">SCROLL</span>
        <motion.span
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}

const UNITS = [
  { key: "days", label: "Tage" },
  { key: "hours", label: "Std" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sek" },
] as const;

function Countdown() {
  const cd = useCountdown(festival.startsAt);

  if (cd.ready && cd.isOver) {
    return (
      <p className="text-eyebrow text-diamond-light">
        DAS FESTIVAL LÄUFT — WIR SEHEN UNS DORT
      </p>
    );
  }

  return (
    <div className="flex gap-4 sm:gap-6" role="timer" aria-live="off">
      {UNITS.map((unit, i) => (
        <div key={unit.key} className="flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-start">
            <span
              className="font-display text-3xl font-extrabold tabular-nums text-white sm:text-4xl"
              suppressHydrationWarning
            >
              {pad(cd.ready ? cd[unit.key] : 0)}
            </span>
            <span className="mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-faint">
              {unit.label}
            </span>
          </div>
          {i < UNITS.length - 1 && (
            <span className="mb-4 text-2xl text-white/15">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
