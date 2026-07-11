type Props = {
  height?: number;
  className?: string;
  /** mark=网站圆标 | brand=企业字标 | lockup=圆标+字标 */
  variant?: "mark" | "brand" | "lockup" | "full" | "compact" | "wordmark";
  tone?: "dark" | "light";
};

const NAVY = "#0B1F3A";
const BLACK = "#111827";
const WHITE = "#FFFFFF";
const MUTED = "#6B7280";

function Mark({ fillBg, size }: { fillBg: string; size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      aria-hidden
    >
      <circle cx="60" cy="60" r="56" fill={fillBg} />
      <rect
        x="34"
        y="38"
        width="46"
        height="58"
        rx="7"
        fill="none"
        stroke={WHITE}
        strokeWidth="2.2"
        transform="rotate(-16 57 67)"
      />
      <rect
        x="38"
        y="34"
        width="46"
        height="58"
        rx="7"
        fill={fillBg}
        stroke={WHITE}
        strokeWidth="2"
        transform="rotate(-6 61 63)"
      />
      <rect
        x="40"
        y="30"
        width="48"
        height="60"
        rx="7"
        fill={WHITE}
        stroke={WHITE}
        strokeWidth="1"
        transform="rotate(8 64 60)"
      />
      <g transform="translate(46 56) rotate(8)">
        <path
          d="M0 10 V-8 H7.2 C10.6 -8 12.6 -5.8 12.6 -2.6 C12.6 0.8 10.4 2.8 7 2.8 H3.4 V10 H0 Z M3.4 -4.8 V0 H6.8 C8.4 0 9.4 -1 9.4 -2.5 C9.4 -4 8.4 -4.8 6.8 -4.8 H3.4 Z"
          fill={fillBg}
        />
        <path
          d="M4.2 -2.9 H9.8 M4.2 -1.5 H9.2 M4.2 -0.1 H8.4"
          stroke={fillBg}
          strokeWidth="0.85"
          strokeLinecap="round"
        />
        <text
          x="14.5"
          y="6.5"
          fontFamily="var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif"
          fontSize="11.5"
          fontWeight="800"
          fill={fillBg}
          letterSpacing="0.04em"
        >
          IMART
        </text>
      </g>
    </svg>
  );
}

function BrandWordmark({
  fill,
  muted,
  height,
}: {
  fill: string;
  muted: string;
  height: number;
}) {
  const width = height * (280 / 72);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 72"
      width={width}
      height={height}
      aria-hidden
    >
      <text
        x="0"
        y="42"
        fontFamily="var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif"
        fontSize="40"
        fontWeight="800"
        fill={fill}
        letterSpacing="0.06em"
      >
        PIMART
      </text>
      <text
        x="2"
        y="66"
        fontFamily="var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif"
        fontSize="13"
        fontWeight="600"
        fill={muted}
        letterSpacing="0.28em"
      >
        CARD
      </text>
    </svg>
  );
}

export function PimartLogo({
  height = 36,
  className = "",
  variant = "mark",
  tone = "dark",
}: Props) {
  const isLight = tone === "light";
  const markBg = isLight ? WHITE : NAVY;
  // 反白场景下圆标仍用白底深蓝卡面更清晰；深色场景用深蓝底
  const markFace = isLight ? NAVY : NAVY;
  const textFill = isLight ? WHITE : BLACK;
  const textMuted = isLight ? "rgba(255,255,255,0.62)" : MUTED;

  // 兼容旧 variant 名
  const mode =
    variant === "full" || variant === "compact"
      ? "mark"
      : variant === "wordmark"
        ? "brand"
        : variant;

  if (mode === "brand") {
    return (
      <span className={`inline-flex items-center ${className}`} role="img" aria-label="PIMART CARD">
        <BrandWordmark fill={textFill} muted={textMuted} height={height} />
      </span>
    );
  }

  if (mode === "lockup") {
    const markSize = height;
    const brandH = Math.round(height * 0.78);
    return (
      <span
        className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}
        role="img"
        aria-label="PIMART CARD"
      >
        <Mark fillBg={isLight ? WHITE : markFace} size={markSize} />
        <BrandWordmark fill={textFill} muted={textMuted} height={brandH} />
      </span>
    );
  }

  // 网站 Logo（圆标）
  return (
    <span className={`inline-flex items-center ${className}`} role="img" aria-label="PIMART">
      <Mark fillBg={isLight ? WHITE : markBg} size={height} />
    </span>
  );
}
