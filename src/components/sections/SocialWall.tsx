"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/effects/BrandIcons";
import { socials, socialTiles } from "@/data/socials";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const PLATFORM_ICON = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
} as const;

export function SocialWall() {
  return (
    <section className="section-y container-x">
      <SectionHeading
        eyebrow="Social"
        title="FOLLOW THE DIAMOND"
        description="Line-up-Drops, Aftermovies und Behind the Scenes — bevor es hier steht, steht es dort."
      />

      <div className="mb-8 flex flex-wrap gap-3">
        {socials.map((channel) => {
          const Icon = PLATFORM_ICON[channel.id];
          const connected = Boolean(channel.url);
          return (
            <a
              key={channel.id}
              href={connected ? channel.url : undefined}
              target={connected ? "_blank" : undefined}
              rel={connected ? "noopener noreferrer" : undefined}
              data-cursor={connected ? "link" : undefined}
              aria-disabled={!connected}
              className={cn(
                "flex items-center gap-2.5 rounded-full border px-4 py-2.5 transition-colors",
                connected
                  ? "border-white/12 text-white hover:border-diamond/60"
                  : "cursor-default border-white/8 text-faint",
              )}
            >
              <Icon className="size-4" />
              <span className="text-sm font-medium">{channel.handle}</span>
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {socialTiles.map((tile, i) => {
          const Icon = PLATFORM_ICON[tile.platform];
          const active = Boolean(tile.url);
          return (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, ease: EASE, delay: (i % 3) * 0.06 }}
              className="group relative aspect-square overflow-hidden rounded-md bg-surface"
            >
              <div
                className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                style={{
                  background: `radial-gradient(120% 100% at ${20 + (i % 3) * 20}% ${20 + (i % 2) * 40}%, hsl(${(i * 47) % 360} 55% 18%) 0%, transparent 60%), var(--color-surface-2)`,
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/55">
                <Icon className="size-4 text-white" />
                {active ? (
                  <span className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-white">
                    <Eye className="size-3" />
                    View Post
                  </span>
                ) : (
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-faint">
                    Bald verfügbar
                  </span>
                )}
              </div>
              <span className="absolute left-3 top-3 text-white/70 transition-opacity group-hover:opacity-0">
                <Icon className="size-4" />
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
