type Props = {
  className?: string;
  /** Draws the internal facet lines. Off for tiny sizes. */
  facets?: boolean;
  strokeWidth?: number;
};

/** The brand mark: a brilliant-cut diamond, drawn as strokes so it stays crisp. */
export function DiamondMark({
  className,
  facets = true,
  strokeWidth = 1.25,
}: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      <path d="M28 18h44l18 22-40 44L10 40z" stroke="currentColor" />
      {facets && (
        <g stroke="currentColor" opacity="0.55">
          <path d="M10 40h80" />
          <path d="M28 18 38 40l12 44" />
          <path d="M72 18 62 40 50 84" />
          <path d="M38 40h24" />
        </g>
      )}
    </svg>
  );
}
