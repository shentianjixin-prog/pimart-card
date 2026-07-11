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

/** 最新网站圆标：黑白线条叠卡 + 实心 P */
function SiteMark({
  ink = BLACK,
  paper = WHITE,
  size = 40,
  x = 0,
  y = 0,
}: {
  ink?: string;
  paper?: string;
  size?: number;
  x?: number;
  y?: number;
}) {
  const s = size / 120;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="60" cy="60" r="54" stroke={ink} strokeWidth="5" fill={paper} />
      <circle cx="60" cy="60" r="49.5" stroke={ink} strokeWidth="1" fill="none" opacity="0.28" />
      <rect
        x="38"
        y="28"
        width="40"
        height="54"
        rx="7"
        fill="none"
        stroke={ink}
        strokeWidth="2"
        transform="rotate(-22 58 55)"
      />
      <rect
        x="40"
        y="30"
        width="40"
        height="54"
        rx="7"
        fill="none"
        stroke={ink}
        strokeWidth="2"
        transform="rotate(18 60 57)"
      />
      <rect
        x="39"
        y="29"
        width="42"
        height="56"
        rx="7"
        fill={paper}
        stroke={ink}
        strokeWidth="2.25"
        transform="rotate(-6 60 57)"
      />
      <g transform="translate(47 41)">
        <path
          fill={ink}
          fillRule="evenodd"
          d="M3 1.5 H16.2 C23.4 1.5 28.2 6.1 28.2 12.4 C28.2 18.8 23.2 23.2 15.8 23.2 H10.2 V36.5 H3 V1.5 Z M10.2 7.4 V17.3 H15.4 C18.9 17.3 21.1 15.2 21.1 12.4 C21.1 9.6 18.9 7.4 15.4 7.4 H10.2 Z M-0.2 9.6 H11.2 V11.5 H-0.2 Z M-1.6 13.2 H11.2 V15.1 H-1.6 Z M-0.2 16.8 H11.2 V18.7 H-0.2 Z"
        />
      </g>
    </g>
  );
}

export function PimartLogo({
  height = 36,
  className = "",
  variant = "full",
  tone = "dark",
}: Props) {
  const isLight = tone === "light";
  const ink = isLight ? WHITE : BLACK;
  const paper = isLight ? "transparent" : WHITE;
  const textFill = isLight ? WHITE : BLACK;

  if (variant === "mark") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 120"
        width={height}
        height={height}
        className={className}
        role="img"
        aria-label="PIMART"
      >
        <SiteMark ink={ink} paper={isLight ? BLACK : paper} size={120} />
      </svg>
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

  // full：最新圆标 + 原有 PIMARTCARD 文字
  const width = height * (240 / 40);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 40"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="PIMARTCARD"
    >
      <SiteMark ink={ink} paper={paper} size={40} x={0} y={0} />
      <line x1="50" y1="9" x2="50" y2="31" stroke="#9CA3AF" strokeWidth="1" opacity="0.5" />
      <Wordmark x={58} size={17} fill={textFill} />
    </svg>
  );
}
