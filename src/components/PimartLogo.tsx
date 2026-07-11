type Props = {
  height?: number;
  className?: string;
  variant?: "full" | "compact" | "wordmark";
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

/** 原始叠卡图标 */
function CardMark({ fill = BLACK }: { fill?: string }) {
  return (
    <g>
      <rect
        x="5"
        y="9"
        width="22"
        height="28"
        rx="3.5"
        fill="#E5E7EB"
        transform="rotate(-7 16 23)"
      />
      <rect
        x="9"
        y="5"
        width="22"
        height="28"
        rx="3.5"
        fill="#FFFFFF"
        stroke={fill}
        strokeWidth="1.25"
        transform="rotate(4 20 19)"
      />
      <path
        d="M14.5 14.5 C14.5 12.2 16.5 10.8 18.8 10.8 C20.8 10.8 22.3 12 22.3 13.6 C22.3 15.2 21.2 16.1 19.5 16.5 L22.5 21.5 H20 L17.8 16.8 H16.8 V21.5 H14.5 V14.5 Z M16.8 15.5 H18.8 C19.8 15.5 20.5 14.9 20.5 13.9 C20.5 12.9 19.8 12.3 18.8 12.3 H16.8 V15.5 Z"
        fill={fill}
        transform="translate(0.5 1) rotate(4 20 19)"
      />
    </g>
  );
}

export function PimartLogo({
  height = 36,
  className = "",
  variant = "full",
  tone = "dark",
}: Props) {
  const fill = tone === "light" ? WHITE : BLACK;

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
        <Wordmark size={22} fill={fill} />
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
        <Wordmark size={18} fill={fill} />
      </svg>
    );
  }

  // full：叠卡 + PIMARTCARD
  const width = height * (220 / 40);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 40"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="PIMARTCARD"
    >
      <CardMark fill={fill} />
      <line x1="42" y1="9" x2="42" y2="31" stroke="#9CA3AF" strokeWidth="1" opacity="0.5" />
      <Wordmark x={50} size={17} fill={fill} />
    </svg>
  );
}
