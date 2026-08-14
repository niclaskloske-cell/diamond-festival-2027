"use client";

import { motion } from "framer-motion";
import { Camera, Sparkles, Users, Video } from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { creatorFeatures } from "@/data/experience";

const EASE = [0.16, 1, 0.3, 1] as const;
const ICONS = [Users, Camera, Sparkles, Video];

export function CreatorLounge() {
  return (
    <section className="section-y container-x relative overflow-hidden">
      <div
        aria-hidden
        className="glow-diamond pointer-events-none absolute -right-24 top-0 size-[32rem] opacity-30"
      />

      <div className="edge relative overflow-hidden rounded-lg bg-surface p-8 sm:p-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Für Creator"
              title={"DIAMOND\nCREATOR\nLOUNGE"}
              className="mb-8 whitespace-pre-line sm:mb-8"
            />
            <p className="max-w-md text-muted">
              Diamond Festival ist für die Generation gebaut, die das Erlebnis nicht
              nur erlebt, sondern zeigt. Ein eigener Bereich für alle, die Content
              machen — egal ob mit 500 oder 500.000 Followern.
            </p>
            <ButtonLink href="#kontakt" variant="outline" className="mt-8">
              Kontakt aufnehmen
            </ButtonLink>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {creatorFeatures.map((feature, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                  className="rounded-md border border-white/10 bg-surface-2 p-5 transition-colors hover:border-diamond/50"
                >
                  <Icon className="size-5 text-diamond-light" />
                  <h4 className="mt-3 text-sm font-semibold text-white">
                    {feature.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    {feature.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
