"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { DiamondMark } from "@/components/effects/DiamondMark";
import { ButtonLink } from "@/components/ui/Button";
import { festival } from "@/data/festival";
import { homeSectionIds, navLinks } from "@/data/navigation";
import { useScrollLock, useScrollSpy, useScrollY } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Marks a link active: section links (`/#id`) only light up while the home
 * page is scrolled to that section, route links (`/tickets`) while that route
 * is open.
 */
function useActiveLink() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const section = useScrollSpy(homeSectionIds);

  return (href: string) =>
    href.startsWith("/#") ? isHome && section === href.slice(2) : pathname === href;
}

export function Navbar() {
  const y = useScrollY();
  const scrolled = y > 24;
  const isActive = useActiveLink();
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
            <Link
              href="/#home"
              data-cursor="link"
              className="flex items-center gap-2.5 text-white"
            >
              <DiamondMark className="size-5 text-diamond-light" />
              <span className="font-display text-sm font-extrabold tracking-[0.02em]">
                {festival.name.toUpperCase()}
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-cursor="link"
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative px-4 py-2 text-[0.8125rem] font-medium uppercase tracking-[0.08em] transition-colors",
                      active ? "text-white" : "text-muted hover:text-white",
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-diamond-light"
                        transition={{ duration: 0.4, ease: EASE }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {/* Wrapped, not classed directly: Button's own base classes
                  already set `inline-flex` unconditionally, which fights a
                  `hidden` passed straight into its className at equal CSS
                  specificity — the visibility toggle needs its own element. */}
              <div className="hidden sm:block">
                <ButtonLink href="/tickets" size="sm">
                  Tickets
                </ButtonLink>
              </div>
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

      <MobileMenu open={open} onClose={() => setOpen(false)} isActive={isActive} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
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
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.05 * i }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "font-display text-4xl font-extrabold uppercase tracking-tight",
                    isActive(link.href) ? "text-sheen" : "text-white",
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.05 * navLinks.length }}
              className="mt-8"
            >
              <ButtonLink href="/tickets" onClick={onClose} size="lg">
                Tickets sichern
              </ButtonLink>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
