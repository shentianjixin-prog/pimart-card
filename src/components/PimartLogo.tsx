type Props = {
  /** 显示高度（px），宽度按比例自适应 */
  height?: number;
  className?: string;
  /** compact：仅图标 + 短字标，适合极小空间 */
  variant?: "full" | "compact";
};

const GREEN_PRIMARY = "#15803D";
const GREEN_ACCENT = "#16A34A";

export function PimartLogo({ height = 36, className = "", variant = "full" }: Props) {
  const width = variant === "compact" ? height * 1.15 : height * (280 / 64);

  if (variant === "compact") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={width}
        height={height}
        className={className}
        role="img"
        aria-label="PIMART CARD"
      >
        <rect width="64" height="64" rx="14" fill="#FFFFFF" />
        <rect
          x="1"
          y="1"
          width="62"
          height="62"
          rx="13"
          stroke="rgba(15,23,42,0.08)"
          strokeWidth="1.5"
          fill="none"
        />
        <text
          x="32"
          y="42"
          textAnchor="middle"
          fill={GREEN_PRIMARY}
          fontFamily="var(--font-inter), Inter, system-ui, sans-serif"
          fontSize="28"
          fontWeight="800"
          letterSpacing="-1"
        >
          P
        </text>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 64"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="PIMART CARD"
    >
      <rect width="280" height="64" rx="14" fill="#FFFFFF" />
      <rect
        x="0.75"
        y="0.75"
        width="278.5"
        height="62.5"
        rx="13.25"
        stroke="rgba(15,23,42,0.08)"
        strokeWidth="1.5"
        fill="none"
      />
      <rect x="16" y="16" width="24" height="32" rx="4" fill={GREEN_ACCENT} fillOpacity="0.12" />
      <rect
        x="18"
        y="18"
        width="20"
        height="28"
        rx="3"
        stroke={GREEN_PRIMARY}
        strokeWidth="1.75"
        fill="none"
      />
      <path
        d="M22 38 L28 26 L34 32 L40 24"
        stroke={GREEN_PRIMARY}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <text
        x="52"
        y="40"
        fill={GREEN_PRIMARY}
        fontFamily="var(--font-inter), Inter, system-ui, sans-serif"
        fontSize="24"
        fontWeight="700"
        letterSpacing="0.5"
      >
        PIMART
      </text>
      <text
        x="178"
        y="40"
        fill={GREEN_ACCENT}
        fontFamily="var(--font-inter), Inter, system-ui, sans-serif"
        fontSize="15"
        fontWeight="600"
        letterSpacing="4"
      >
        CARD
      </text>
    </svg>
  );
}
