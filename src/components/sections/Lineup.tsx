"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { ArtistCard } from "@/components/sections/lineup/ArtistCard";
import { ArtistModal } from "@/components/sections/lineup/ArtistModal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { artists, lineupDays, type Artist, type ArtistDay } from "@/data/artists";
import { cn } from "@/lib/utils";

export function Lineup() {
  const [day, setDay] = useState<ArtistDay | "ALL">("ALL");
  const [selected, setSelected] = useState<Artist | null>(null);

  const visible = useMemo(
    () => (day === "ALL" ? artists : artists.filter((a) => a.day === day)),
    [day],
  );

  return (
    <section id="lineup" className="section-y container-x relative">
      <SectionHeading eyebrow="Line-Up" title="THE LINE-UP" />

      <div className="mb-10 flex flex-wrap gap-2">
        <FilterChip active={day === "ALL"} onClick={() => setDay("ALL")}>
          Alle Tage
        </FilterChip>
        {lineupDays.map((d) => (
          <FilterChip key={d.id} active={day === d.id} onClick={() => setDay(d.id)}>
            {d.label} · {d.date}
          </FilterChip>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-muted">
          Für diesen Tag sind noch keine Acts bestätigt.
        </p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {visible.map((artist) => (
            <ArtistCard
              key={artist.slug}
              artist={artist}
              onOpen={() => setSelected(artist)}
            />
          ))}
        </motion.div>
      )}

      <ArtistModal artist={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="link"
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
        active
          ? "border-diamond bg-diamond/15 text-diamond-light"
          : "border-white/12 text-muted hover:border-white/30 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
