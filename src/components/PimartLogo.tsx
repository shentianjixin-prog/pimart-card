type Props = {
  height?: number;
  className?: string;
  variant?: "full" | "compact" | "wordmark";
};

/** 深林绿 +  sage + 箔金点缀 */
const INK = "#0C1F17";
const FOREST = "#14532D";
const SAGE = "#3F7D5A";
const FOIL = "#B8956B";
const MIST = "#E8F3ED";

function Mark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
    >
      <rect x="4" y="10" width="26" height="34" rx="4.5" fill={MIST} transform="rotate(-7 17 27)" />
      <rect
        x="10"
        y="4"
        width="26"
        height="34"
        rx="4.5"
        fill="#FFFFFF"
        stroke={FOREST}
        strokeWidth="1.15"
        transform="rotate(4 23 21)"
      />
      <path
        d="M14 11.5 H30"
        stroke={FOIL}
        strokeWidth="1.35"
        strokeLinecap="round"
        transform="rotate(4 23 21)"
      />
      <path
        d="M17 18 C17 14.5 19.8 12.5 23.2 12.5 C26.2 12.5 28.5 14 28.5 16.8 C28.5 19.2 27 20.5 24.6 21.2 L28.8 28.5 H25.4 L21.6 21.6 H20.2 V28.5 H17 V18 Z M20.2 19.2 H23 C24.6 19.2 25.6 18.4 25.6 16.9 C25.6 15.5 24.6 14.7 23 14.7 H20.2 V19.2 Z"
        fill={FOREST}
        transform="translate(1.5 2) rotate(4 23 21)"
      />
    </svg>
  );
}

export function PimartLogo({ height = 36, className = "", variant = "full" }: Props) {
  if (variant === "compact") {
    return (
      <span className={`inline-flex shrink-0 items-center ${className}`} role="img" aria-label="PIMARTCARD">
        <Mark size={height} />
      </span>
    );
  }

  if (variant === "wordmark") {
    const width = height * 5.2;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 36"
        width={width}
        height={height}
        className={className}
        role="img"
        aria-label="PIMARTCARD"
      >
        <text
          x="0"
          y="27"
          fontFamily="var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif"
          fontSize="22"
          fill={INK}
        >
          <tspan fontWeight="600" letterSpacing="0.04em">
            PIMART
          </tspan>
          <tspan fontWeight="400" letterSpacing="0.18em" fill={SAGE}>
            CARD
          </tspan>
        </text>
      </svg>
    );
  }

  const width = height * (232 / 40);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 232 40"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="PIMARTCARD"
    >
      <g transform="translate(0 0)">
        <rect x="5" y="9" width="22" height="28" rx="3.5" fill={MIST} transform="rotate(-7 16 23)" />
        <rect
          x="9"
          y="5"
          width="22"
          height="28"
          rx="3.5"
          fill="#FFFFFF"
          stroke={FOREST}
          strokeWidth="1"
          transform="rotate(4 20 19)"
        />
        <path
          d="M12 10 H28"
          stroke={FOIL}
          strokeWidth="1.1"
          strokeLinecap="round"
          transform="rotate(4 20 19)"
        />
        <path
          d="M14.5 14.5 C14.5 12.2 16.5 10.8 18.8 10.8 C20.8 10.8 22.3 12 22.3 13.6 C22.3 15.2 21.2 16.1 19.5 16.5 L22.5 21.5 H20 L17.8 16.8 H16.8 V21.5 H14.5 V14.5 Z M16.8 15.5 H18.8 C19.8 15.5 20.5 14.9 20.5 13.9 C20.5 12.9 19.8 12.3 18.8 12.3 H16.8 V15.5 Z"
          fill={FOREST}
          transform="translate(0.5 1) rotate(4 20 19)"
        />
      </g>

      <line x1="44" y1="8" x2="44" y2="32" stroke={FOIL} strokeWidth="0.75" opacity="0.55" />

      <text
        x="52"
        y="27"
        fontFamily="var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif"
        fontSize="19"
        fill={INK}
      >
        <tspan fontWeight="600" letterSpacing="0.06em">
          PIMART
        </tspan>
        <tspan fontWeight="400" letterSpacing="0.2em" fill={SAGE}>
          CARD
        </tspan>
      </text>
    </svg>
  );
}
