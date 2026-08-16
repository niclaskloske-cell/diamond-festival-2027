import Link from "next/link";

import { DiamondMark } from "@/components/effects/DiamondMark";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/effects/BrandIcons";
import { festival } from "@/data/festival";
import { footerNav, legalNav } from "@/data/navigation";
import { socials } from "@/data/socials";
import { cn } from "@/lib/utils";

const PLATFORM_ICON = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
} as const;

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-bg-elevated">
      <div
        aria-hidden
        className="glow-diamond pointer-events-none absolute -top-40 left-1/2 size-[40rem] -translate-x-1/2 opacity-20"
      />

      <div className="container-x relative py-16 sm:py-20">
        <div className="flex items-center gap-3 text-white">
          <DiamondMark className="size-8 text-diamond-light" />
          <div>
            <p className="font-display text-2xl font-extrabold uppercase leading-none">
              DIAMOND FESTIVAL
            </p>
            <p className="mt-1 text-eyebrow text-diamond-light">2027</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {socials.map((channel) => {
            const Icon = PLATFORM_ICON[channel.id];
            const connected = Boolean(channel.url);
            return (
              <a
                key={channel.id}
                href={connected ? channel.url : undefined}
                target={connected ? "_blank" : undefined}
                rel={connected ? "noopener noreferrer" : undefined}
                aria-disabled={!connected}
                data-cursor={connected ? "link" : undefined}
                className={cn(
                  "flex size-11 items-center justify-center rounded-full border transition-colors",
                  connected
                    ? "border-white/15 text-white hover:border-diamond/70 hover:text-diamond-light"
                    : "cursor-default border-white/8 text-faint",
                )}
              >
                <Icon className="size-4" />
              </a>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-y-3 gap-x-6 border-t border-white/10 pt-10 sm:flex sm:flex-wrap sm:gap-8">
          {footerNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-cursor="link"
              className="text-sm font-medium text-muted transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-faint">
            © {festival.year} {festival.organiser}. Alle Rechte vorbehalten.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-cursor="link"
                className="text-xs text-faint transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
