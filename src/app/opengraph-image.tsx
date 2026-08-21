import { ImageResponse } from "next/og";

import { festival } from "@/data/festival";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${festival.fullName} — ${festival.dateLabel} in ${festival.location.venue}`;

/** Social share card (WhatsApp/Instagram/X previews) — generated so it can't go stale relative to the Hero. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#050505",
          backgroundImage:
            "radial-gradient(circle at 78% 8%, rgba(76,170,201,0.35) 0%, rgba(5,5,5,0) 55%), radial-gradient(circle at 6% 92%, rgba(255,111,94,0.16) 0%, rgba(5,5,5,0) 60%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" strokeWidth={6}>
            <path d="M28 18h44l18 22-40 44L10 40z" stroke="#8fe3ff" />
          </svg>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 6,
              color: "#8fe3ff",
              textTransform: "uppercase",
            }}
          >
            {festival.location.venue}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 128,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: -3,
              textTransform: "uppercase",
            }}
          >
            Diamond
          </span>
          <span
            style={{
              fontSize: 128,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: -3,
              textTransform: "uppercase",
            }}
          >
            Night
          </span>
          <span
            style={{
              marginTop: 18,
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: -1,
              color: "#8fe3ff",
              textTransform: "uppercase",
            }}
          >
            mit Muhabbet
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ fontSize: 30, fontWeight: 700 }}>{festival.dateLabel}</span>
          <span style={{ fontSize: 26, color: "#a1a1aa" }}>
            {festival.location.city}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
