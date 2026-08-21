import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Browser tab / bookmark icon — the brand's diamond mark, generated so it never drifts from DiamondMark.tsx's actual facet lines. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          borderRadius: 14,
        }}
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 100 100"
          fill="none"
          strokeWidth={5}
          strokeLinejoin="round"
        >
          <path d="M28 18h44l18 22-40 44L10 40z" stroke="#8fe3ff" />
          <g stroke="#4caac9" strokeWidth={3}>
            <path d="M10 40h80" />
            <path d="M28 18 38 40l12 44" />
            <path d="M72 18 62 40 50 84" />
            <path d="M38 40h24" />
          </g>
        </svg>
      </div>
    ),
    { ...size },
  );
}
