"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { ArtistCard } from "@/components/sections/lineup/ArtistCard";
import { ArtistModal } from "@/components/sections/lineup/ArtistModal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { artists, type Artist } from "@/data/artists";

export function Lineup() {
  const [selected, setSelected] = useState<Artist | null>(null);

  return (
    <section id="lineup" className="section-y container-x relative">
      <SectionHeading
        eyebrow="Line-Up"
        title="MAINACT & SUPPORT"
        description="Ein Abend, eine Bühne — angeführt von Muhabbet."
      />

      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {artists.map((artist) => (
          <ArtistCard
            key={artist.slug}
            artist={artist}
            onOpen={() => setSelected(artist)}
          />
        ))}
      </motion.div>

      <ArtistModal artist={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
