"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { DiamondMark } from "@/components/effects/DiamondMark";
import { ButtonLink } from "@/components/ui/Button";
import { festival } from "@/data/festival";
import { navLinks } from "@/data/navigation";
import { useScrollLock, useScrollSpy, useScrollY } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar() {
  const y = useScrollY();
  const scrolled = y > 24;
  const active = useScrollSpy(navLinks.map((l) => l.href.slice(1)));
  const [open, setOpen] = useState(false);
  useScrollLock(open);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled ? "pt-3" : "pt-6",
        )}
      >
        <div className="container-x">
          <div
            className={cn(
              "flex items-center justify-between rounded-full px-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              scrolled ? "glass h-14 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]" : "h-16 bg-transparent",
            )}
          >
            <a
              href="#home"
              data-cursor="link"
              className="flex items-center gap-2.5 text-white"
            >
              <DiamondMark className="size-5 text-diamond-light" />
              <span className="font-display text-sm font-extrabold tracking-[0.02em]">
                {festival.name.toUpperCase()}
              </span>
            </a>

            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    data-cursor="link"
                    className={cn(
                      "relative px-4 py-2 text-[0.8125rem] font-medium uppercase tracking-[0.08em] transition-colors",
                      isActive ? "text-white" : "text-muted hover:text-white",
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-diamond-light"
                        transition={{ duration: 0.4, ease: EASE }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <ButtonLink href="#tickets" size="sm" className="hidden sm:inline-flex">
                Tickets
              </ButtonLink>
              <button
                type="button"
                data-cursor="link"
                aria-label={open ? "Menü schließen" : "Menü öffnen"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex size-11 items-center justify-center rounded-full text-white lg:hidden"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} active={active} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  active,
}: {
  open: boolean;
  onClose: () => void;
  active: string | null;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 flex flex-col bg-bg lg:hidden"
        >
          <div aria-hidden className="glow-diamond absolute -top-1/4 right-0 size-96 opacity-40" />
          <div className="h-20 shrink-0" />
          <nav className="relative flex flex-1 flex-col justify-center gap-2 px-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.05 * i }}
                className={cn(
                  "font-display text-4xl font-extrabold uppercase tracking-tight",
                  active === link.href.slice(1) ? "text-sheen" : "text-white",
                )}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.05 * navLinks.length }}
              className="mt-8"
            >
              <ButtonLink href="#tickets" onClick={onClose} size="lg">
                Tickets sichern
              </ButtonLink>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
