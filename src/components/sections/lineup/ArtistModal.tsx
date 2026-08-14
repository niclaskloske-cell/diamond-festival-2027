"use client";

import Image from "next/image";
import { Clock, MapPinned, Music2 } from "lucide-react";

import type { Artist } from "@/data/artists";
import { Modal } from "@/components/ui/Modal";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/effects/BrandIcons";

function hueFromSlug(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

export function ArtistModal({
  artist,
  onClose,
}: {
  artist: Artist | null;
  onClose: () => void;
}) {
  const hue = artist ? hueFromSlug(artist.slug) : 0;

  return (
    <Modal open={Boolean(artist)} onClose={onClose} labelledBy="artist-modal-title">
      {artist && (
        <>
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {artist.image ? (
              <Image src={artist.image} alt={artist.name} fill className="object-cover" />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(120% 100% at 20% 0%, hsl(${hue} 70% 22%) 0%, transparent 55%), radial-gradient(100% 90% at 90% 100%, hsl(${(hue + 40) % 360} 60% 16%) 0%, transparent 60%), var(--color-surface)`,
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-3 flex flex-wrap gap-2">
              {artist.headliner && (
                <span className="inline-block rounded-full bg-diamond/90 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#04141b]">
                  Headliner
                </span>
              )}
              {artist.status === "planned" && (
                <span className="inline-block rounded-full bg-warning/90 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#241a04]">
                  Geplant, noch nicht final bestätigt
                </span>
              )}
            </div>
            <h3
              id="artist-modal-title"
              className="font-display text-3xl font-extrabold uppercase leading-none text-white sm:text-4xl"
            >
              {artist.name}
            </h3>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Music2 className="size-3.5 text-diamond-light" />
                {artist.genre}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-diamond-light" />
                {artist.time || "Zeit folgt"}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPinned className="size-3.5 text-diamond-light" />
                {artist.stage}
              </span>
            </div>

            <p className="mt-6 max-w-prose text-sm leading-relaxed text-muted">
              {artist.bio}
            </p>

            <div className="mt-6 flex gap-3">
              {artist.socials.instagram && (
                <SocialLink href={artist.socials.instagram} label="Instagram">
                  <InstagramIcon className="size-4" />
                </SocialLink>
              )}
              {artist.socials.tiktok && (
                <SocialLink href={artist.socials.tiktok} label="TikTok">
                  <TikTokIcon className="size-4" />
                </SocialLink>
              )}
              {artist.socials.youtube && (
                <SocialLink href={artist.socials.youtube} label="YouTube">
                  <YouTubeIcon className="size-4" />
                </SocialLink>
              )}
              {!artist.socials.instagram &&
                !artist.socials.tiktok &&
                !artist.socials.youtube && (
                  <p className="text-xs text-faint">Social Links folgen.</p>
                )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-cursor="link"
      className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-diamond/70 hover:text-diamond-light"
    >
      {children}
    </a>
  );
}
