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

  const width = height * (210 / 36);

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
      <Wordmark size={19} fill={fill} />
    </svg>
  );
}
