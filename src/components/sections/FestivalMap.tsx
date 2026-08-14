"use client";

import { useState } from "react";
import Image from "next/image";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { MAP_IMAGE, mapAreas, type MapAreaId } from "@/data/map";

export function FestivalMap() {
  const [active, setActive] = useState<MapAreaId | null>(null);
  const activeArea = mapAreas.find((a) => a.id === active) ?? null;

  return (
    <section id="map" className="section-y container-x">
      <SectionHeading
        eyebrow="Gelände"
        title="FESTIVAL MAP"
        description="Der reale Site-Plan am Baggersee — vom Parkplatz bis zur Mainstage direkt am Wasser."
      />

      <div className="edge relative mx-auto max-w-xl overflow-hidden rounded-lg bg-black">
        <div className="relative" style={{ aspectRatio: `${MAP_IMAGE.width} / ${MAP_IMAGE.height}` }}>
          <Image
            src={MAP_IMAGE.src}
            alt={MAP_IMAGE.alt}
            fill
            sizes="(min-width: 640px) 576px, 100vw"
            className="object-cover"
            priority={false}
          />

          {/* Invisible hotspots laid exactly over the image, in its native pixel grid. */}
          <svg
            viewBox={`0 0 ${MAP_IMAGE.width} ${MAP_IMAGE.height}`}
            className="absolute inset-0 size-full"
            aria-hidden="true"
          >
            {mapAreas.map((area) => {
              const isActive = active === area.id;
              return (
                <path
                  key={area.id}
                  d={area.path}
                  fill={isActive ? `${area.glowColor}33` : "transparent"}
                  stroke={isActive ? area.glowColor : "transparent"}
                  strokeWidth={3}
                  style={{
                    filter: isActive ? `drop-shadow(0 0 6px ${area.glowColor})` : undefined,
                    transition: "fill 0.2s, filter 0.2s",
                    cursor: "pointer",
                    pointerEvents: "auto",
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${area.label}: ${area.description}`}
                  data-cursor="link"
                  onMouseEnter={() => setActive(area.id)}
                  onMouseLeave={() => setActive((a) => (a === area.id ? null : a))}
                  onFocus={() => setActive(area.id)}
                  onBlur={() => setActive((a) => (a === area.id ? null : a))}
                  onClick={() => setActive(area.id)}
                />
              );
            })}
          </svg>
        </div>
      </div>

      <div className="mx-auto mt-4 min-h-14 max-w-xl rounded-md border border-white/10 bg-surface-2 px-5 py-4">
        {activeArea ? (
          <p className="text-sm text-muted">
            <span className="font-semibold text-white">{activeArea.label}</span>
            {" — "}
            {activeArea.description}
          </p>
        ) : (
          <p className="text-sm text-faint">
            Fahre über einen Bereich oder tippe ihn an, um mehr zu erfahren.
          </p>
        )}
      </div>
    </section>
  );
}
