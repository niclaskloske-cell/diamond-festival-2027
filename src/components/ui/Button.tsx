"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { useMagnetic } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Magnetic pull strength; 0 disables it. */
  magnetic?: number;
  icon?: ReactNode;
};

type ButtonProps = BaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
};

type LinkProps = BaseProps & {
  href: string;
  external?: boolean;
  onClick?: () => void;
};

const base =
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-semibold uppercase tracking-[0.16em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40";

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[0.6875rem]",
  md: "px-7 py-3.5 text-xs",
  lg: "px-9 py-4.5 text-[0.8125rem]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-diamond text-[#04141b] shadow-[0_0_0_0_rgba(76,170,201,0.5)] hover:bg-diamond-light hover:shadow-[0_10px_50px_-8px_rgba(143,227,255,0.65)]",
  outline:
    "border border-white/15 text-white hover:border-diamond/70 hover:text-diamond-light",
  ghost: "text-muted hover:text-white",
};

/** Sheen that sweeps across the button on hover. */
function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.35),transparent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
    />
  );
}

/**
 * Returns the ref separately from the rest of the motion props. Keeping the
 * ref out of the props bag avoids property access on a ref-carrying object at
 * the JSX prop-binding site.
 */
function useMagneticProps(strength: number) {
  const { ref, offset, onMove, reset, enabled } = useMagnetic<HTMLElement>(
    strength * 0.3,
  );
  const props = {
    onMouseMove: onMove,
    onMouseLeave: reset,
    animate: { x: enabled ? offset.x : 0, y: enabled ? offset.y : 0 },
    transition: { type: "spring" as const, stiffness: 260, damping: 18, mass: 0.5 },
  };
  return [ref, props] as const;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  magnetic = 1,
  icon,
  onClick,
  type = "button",
  disabled,
  loading,
}: ButtonProps) {
  const [magRef, magProps] = useMagneticProps(magnetic);

  return (
    <motion.button
      ref={magRef as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      data-cursor="magnetic"
      {...magProps}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {variant === "primary" && <Sheen />}
      <span className="relative flex items-center gap-2.5">
        {loading && (
          <span
            aria-hidden
            className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {children}
        {icon && !loading && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            {icon}
          </span>
        )}
      </span>
    </motion.button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  magnetic = 1,
  icon,
  external,
  onClick,
}: LinkProps) {
  const [magRef, magProps] = useMagneticProps(magnetic);
  const content = (
    <>
      {variant === "primary" && <Sheen />}
      <span className="relative flex items-center gap-2.5">
        {children}
        {icon && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            {icon}
          </span>
        )}
      </span>
    </>
  );

  const shared = {
    "data-cursor": "magnetic",
    onClick,
    ...magProps,
    className: cn(base, sizes[size], variants[variant], className),
  };

  // In-page anchors and external URLs are plain anchors; real routes go through
  // next/link so client-side navigation and prefetching still work.
  if (external || href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <motion.a
        ref={magRef as React.Ref<HTMLAnchorElement>}
        href={href}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : undefined)}
        {...shared}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <MotionLink ref={magRef as React.Ref<HTMLAnchorElement>} href={href} {...shared}>
      {content}
    </MotionLink>
  );
}
