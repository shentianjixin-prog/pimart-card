type Props = {
  height?: number;
  className?: string;
  variant?: "full" | "compact" | "wordmark" | "mark";
  tone?: "dark" | "light";
};

const BLACK = "#111827";
const WHITE = "#FFFFFF";

function Wordmark({ x = 0, size = 19, fill = BLACK }: { x?: number; size?: number; fill?: string }) {
  return (
    <text
      x={x}
      y="27"
      fontFamily="var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif"
      fontSize={size}
      fontWeight="800"
      fill={fill}
      letterSpacing="0.08em"
    >
      PIMARTCARD
    </text>
  );
}

/** 用户上传的最新圆标 */
function SiteMarkImg({
  size,
  className = "",
  tone = "dark",
}: {
  size: number;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-mark.png"
      alt=""
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        // 深色底上反白显示
        filter: tone === "light" ? "invert(1) brightness(1.05)" : undefined,
      }}
      draggable={false}
    />
  );
}

export function PimartLogo({
  height = 36,
  className = "",
  variant = "full",
  tone = "dark",
}: Props) {
  const isLight = tone === "light";
  const textFill = isLight ? WHITE : BLACK;

  if (variant === "mark") {
    return (
      <span className={`inline-flex items-center ${className}`} role="img" aria-label="PIMART">
        <SiteMarkImg size={height} tone={tone} />
      </span>
    );
  }

  if (variant === "wordmark") {
    const width = height * (172 / 36);
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 172 36"
        width={width}
        height={height}
        className={className}
        role="img"
        aria-label="PIMARTCARD"
      >
        <Wordmark size={22} fill={textFill} />
      </svg>
    );
  }

  if (variant === "compact") {
    const width = height * 5.4;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 210 36"
        width={width}
        height={height}
        className={className}
        role="img"
        aria-label="PIMARTCARD"
      >
        <Wordmark size={18} fill={textFill} />
      </svg>
    );
  }

  // full：上传圆标 + PIMARTCARD 文字
  const markSize = height;
  const gap = Math.max(8, Math.round(height * 0.22));
  const textHeight = Math.round(height * 0.9);

  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap }}
      role="img"
      aria-label="PIMARTCARD"
    >
      <SiteMarkImg size={markSize} tone={tone} />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 172 36"
        width={height * (172 / 40)}
        height={textHeight}
        aria-hidden
      >
        <Wordmark size={20} fill={textFill} />
      </svg>
    </span>
  );
}
