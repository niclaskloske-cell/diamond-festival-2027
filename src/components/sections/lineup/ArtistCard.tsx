"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import type { Artist } from "@/data/artists";
import { cn } from "@/lib/utils";

/** Deterministic hue from the artist slug — keeps the procedural art stable. */
function hueFromSlug(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

export function ArtistCard({
  artist,
  onOpen,
}: {
  artist: Artist;
  onOpen: () => void;
}) {
  const hue = hueFromSlug(artist.slug);
  const isPlanned = artist.status === "planned";

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      data-cursor="link"
      layout
      className={cn(
        "group edge relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface text-left",
        artist.headliner && "sm:col-span-2 sm:aspect-[16/9]",
        isPlanned && "hover:ring-1 hover:ring-warning/60",
      )}
    >
      {/* Art */}
      <div className="absolute inset-0">
        {artist.image ? (
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
            style={{
              background: `radial-gradient(120% 100% at 20% 0%, hsl(${hue} 70% 22%) 0%, transparent 55%), radial-gradient(100% 90% at 90% 100%, hsl(${(hue + 40) % 360} 60% 16%) 0%, transparent 60%), var(--color-surface)`,
            }}
          />
        )}
      </div>

      {/* Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          isPlanned
            ? "bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,196,107,0.3)_0%,transparent_70%)]"
            : "bg-[radial-gradient(60%_60%_at_50%_50%,rgba(76,170,201,0.28)_0%,transparent_70%)]",
        )}
      />

      <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
        {artist.headliner && (
          <span className="rounded-full bg-diamond/90 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#04141b]">
            Headliner
          </span>
        )}
        {isPlanned && (
          <span className="rounded-full bg-warning/90 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#241a04] transition-colors duration-300 group-hover:bg-warning">
            Geplant
          </span>
        )}
      </div>

      <span className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/20 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:rotate-90">
        <Plus className="size-4" />
      </span>

      {/* Copy */}
      <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-diamond-light opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {artist.time || "Zeit folgt"}
        </p>
        <h3 className="mt-1 font-display text-2xl font-extrabold uppercase leading-none text-white sm:text-3xl">
          {artist.name}
        </h3>
        <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted">
          {artist.genre}
        </p>
      </div>
    </motion.button>
  );
}
