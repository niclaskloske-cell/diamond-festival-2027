"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/lib/hooks";

type Props = {
  /** Particle count at desktop width; scaled down on small screens. */
  density?: number;
  className?: string;
  /** Slight drift toward the pointer. */
  interactive?: boolean;
};

type Particle = {
  x: number;
  y: number;
  z: number; // depth 0.2–1, drives size, speed and opacity
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  /** Rare warm accent for a summer-dusk feel among the mostly cool/white dust. */
  warm: boolean;
};

/**
 * Floating diamond dust on a single canvas.
 *
 * Deliberately one canvas instead of N DOM nodes: no layout, no compositing
 * layers, and it can be paused wholesale when off-screen or when the tab is
 * hidden. Disabled entirely under prefers-reduced-motion.
 */
export function Particles({
  density = 46,
  className,
  interactive = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let frame = 0;
    let running = true;
    const pointer = { x: 0.5, y: 0.5 };

    const seed = () => {
      const scale = Math.min(1, width / 1280);
      const count = Math.max(14, Math.round(density * scale));
      particles = Array.from({ length: count }, () => {
        const z = 0.2 + Math.random() * 0.8;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          vx: (Math.random() - 0.5) * 0.14 * z,
          vy: -(0.08 + Math.random() * 0.22) * z,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.006,
          warm: Math.random() < 0.12,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const drawDiamond = (p: Particle) => {
      const size = 1.1 + p.z * 3.4;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = 0.12 + p.z * 0.5;
      ctx.fillStyle = p.warm ? "#ffb648" : p.z > 0.72 ? "#8fe3ff" : "#ffffff";
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.72, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.72, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const step = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      const driftX = interactive ? (pointer.x - 0.5) * 0.35 : 0;
      const driftY = interactive ? (pointer.y - 0.5) * 0.2 : 0;

      for (const p of particles) {
        p.x += p.vx + driftX * p.z;
        p.y += p.vy + driftY * p.z;
        p.rot += p.vr;

        if (p.y < -12) {
          p.y = height + 12;
          p.x = Math.random() * width;
        }
        if (p.x < -12) p.x = width + 12;
        else if (p.x > width + 12) p.x = -12;

        drawDiamond(p);
      }
      frame = requestAnimationFrame(step);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = e.clientY / window.innerHeight;
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = requestAnimationFrame(step);
      }
    };

    // Only animate while the canvas is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running && !document.hidden) {
          running = true;
          frame = requestAnimationFrame(step);
        } else if (!entry.isIntersecting) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0 },
    );

    const ro = new ResizeObserver(resize);
    resize();
    io.observe(canvas);
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    if (interactive)
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(step);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [density, interactive, reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
