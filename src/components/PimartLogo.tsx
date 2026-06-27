type Props = {
  height?: number;
  className?: string;
  variant?: "full" | "compact" | "wordmark";
};

const BLACK = "#111827";

function Wordmark({ x = 0, size = 19 }: { x?: number; size?: number }) {
  return (
    <text
      x={x}
      y="27"
      fontFamily="var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif"
      fontSize={size}
      fontWeight="800"
      fill={BLACK}
      letterSpacing="0.08em"
    >
      PIMART
    </text>
  );
}

export function PimartLogo({ height = 36, className = "", variant = "full" }: Props) {
  if (variant === "compact") {
    const width = height * 3.2;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 36"
        width={width}
        height={height}
        className={className}
        role="img"
        aria-label="PIMART"
      >
        <Wordmark size={18} />
      </svg>
    );
  }

  const width = height * (150 / 36);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 150 36"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="PIMART"
    >
      <Wordmark size={variant === "wordmark" ? 22 : 19} />
    </svg>
  );
}
