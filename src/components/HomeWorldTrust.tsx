"use client";

import { useT } from "@/lib/lang-context";

const HUB_KEY = "region_jp";

/** 构图坐标（非真实经纬度）——为画面平衡与可读性设计 */
type Node = {
  key: string;
  code: string;
  x: number;
  y: number;
  pokemon: number;
  pokeX: number;
  pokeY: number;
  accent: string;
  size: "hub" | "major" | "minor";
};

const NODES: Node[] = [
  {
    key: "region_us",
    code: "US",
    x: 108,
    y: 168,
    pokemon: 6,
    pokeX: -8,
    pokeY: -52,
    accent: "#7BA3C9",
    size: "major",
  },
  {
    key: "region_de",
    code: "DE",
    x: 340,
    y: 132,
    pokemon: 149,
    pokeX: -42,
    pokeY: -28,
    accent: "#94A3B8",
    size: "major",
  },
  {
    key: "region_cn",
    code: "CN",
    x: 520,
    y: 148,
    pokemon: 143,
    pokeX: -48,
    pokeY: -18,
    accent: "#8FB89A",
    size: "major",
  },
  {
    key: "region_jp",
    code: "JP",
    x: 690,
    y: 156,
    pokemon: 25,
    pokeX: 22,
    pokeY: -48,
    accent: "#2DD4BF",
    size: "hub",
  },
  {
    key: "region_th",
    code: "TH",
    x: 500,
    y: 268,
    pokemon: 94,
    pokeX: -46,
    pokeY: 8,
    accent: "#A78BFA",
    size: "minor",
  },
  {
    key: "region_sg",
    code: "SG",
    x: 620,
    y: 292,
    pokemon: 448,
    pokeX: 28,
    pokeY: -8,
    accent: "#60A5FA",
    size: "minor",
  },
  {
    key: "region_my",
    code: "MY",
    x: 575,
    y: 340,
    pokemon: 658,
    pokeX: 10,
    pokeY: 22,
    accent: "#38BDF8",
    size: "minor",
  },
  {
    key: "region_id",
    code: "ID",
    x: 655,
    y: 355,
    pokemon: 727,
    pokeX: 18,
    pokeY: 16,
    accent: "#F59E0B",
    size: "minor",
  },
];

/** 装饰性色域——刻意抽象，不做地理还原 */
const BLOBS = [
  { cx: 130, cy: 190, rx: 120, ry: 90, fill: "url(#wm-blob-west)", opacity: 0.55, rotate: -12 },
  { cx: 145, cy: 300, rx: 55, ry: 70, fill: "url(#wm-blob-west-2)", opacity: 0.35, rotate: 18 },
  { cx: 340, cy: 150, rx: 95, ry: 70, fill: "url(#wm-blob-eu)", opacity: 0.42, rotate: -8 },
  { cx: 580, cy: 175, rx: 200, ry: 95, fill: "url(#wm-blob-east)", opacity: 0.5, rotate: -4 },
  { cx: 430, cy: 280, rx: 90, ry: 70, fill: "url(#wm-blob-mid)", opacity: 0.32, rotate: 8 },
  { cx: 620, cy: 320, rx: 110, ry: 80, fill: "url(#wm-blob-sea)", opacity: 0.4, rotate: -6 },
  { cx: 720, cy: 360, rx: 70, ry: 45, fill: "url(#wm-blob-au)", opacity: 0.28, rotate: 14 },
];

function pokemonSpriteUrl(id: number) {
  return `/images/pokemon/${id}.png`;
}

function arcPath(x1: number, y1: number, x2: number, y2: number, bend = 0.18) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * bend;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

function routeBend(key: string) {
  if (key === "region_us") return 0.22;
  if (key === "region_de") return 0.18;
  if (key === "region_id") return 0.1;
  return 0.14;
}

type WorldTrustMapProps = {
  variant?: "full" | "compact";
  className?: string;
};

export function WorldTrustMap({ variant = "full", className = "" }: WorldTrustMapProps) {
  const T = useT();
  const hub = NODES.find((n) => n.key === HUB_KEY)!;
  const spokes = NODES.filter((n) => n.key !== HUB_KEY);
  const uid = variant === "compact" ? "c" : "f";
  const isCompact = variant === "compact";

  return (
    <div className={`home-world-map home-world-map--atelier home-world-map--${variant} ${className}`.trim()}>
      <svg
        className="home-world-map-svg"
        viewBox="0 0 820 420"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={T("world_title")}
      >
        <defs>
          <linearGradient id={`wm-sky-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7F4EF" />
            <stop offset="40%" stopColor="#EEF3F8" />
            <stop offset="100%" stopColor="#E4EDF5" />
          </linearGradient>
          <radialGradient id={`wm-glow-${uid}`} cx="72%" cy="38%" r="45%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#93C5FD" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#93C5FD" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="wm-blob-west" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B8D0E8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8FB0D0" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="wm-blob-west-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A8C4A0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7FA078" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="wm-blob-eu" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C8D0DC" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#9AA8B8" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="wm-blob-east" x1="0%" y1="30%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C5DCC8" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#A8D4C8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7EB8C8" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="wm-blob-mid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8D5B0" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#C8B088" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="wm-blob-sea" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B8E0D8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7EC8C0" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="wm-blob-au" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0C8A0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#C0A070" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id={`wm-route-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F766E" stopOpacity="0" />
            <stop offset="35%" stopColor="#14B8A6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.15" />
          </linearGradient>
          <filter id={`wm-blur-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id={`wm-soft-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
          <filter id={`wm-glow-line-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`wm-label-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#F7F4EF" floodOpacity="0.95" />
          </filter>
          <pattern id={`wm-grain-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="#0F172A" fillOpacity="0.04" />
            <circle cx="4" cy="3.5" r="0.45" fill="#0F172A" fillOpacity="0.03" />
          </pattern>
        </defs>

        {/* 底：纸感天空 */}
        <rect width="820" height="420" rx="20" fill={`url(#wm-sky-${uid})`} />
        <ellipse cx="590" cy="150" rx="280" ry="160" fill={`url(#wm-glow-${uid})`} />
        <rect width="820" height="420" fill={`url(#wm-grain-${uid})`} opacity="0.9" />

        {/* 抽象色域 */}
        <g filter={`url(#wm-blur-${uid})`} className="home-world-blobs">
          {BLOBS.map((b, i) => (
            <ellipse
              key={`blob-${i}`}
              cx={b.cx}
              cy={b.cy}
              rx={b.rx}
              ry={b.ry}
              fill={b.fill}
              opacity={b.opacity}
              transform={`rotate(${b.rotate} ${b.cx} ${b.cy})`}
            />
          ))}
        </g>

        {/* 细环装饰 */}
        <g className="home-world-rings" fill="none" stroke="#0F172A" strokeOpacity="0.05">
          <circle cx={hub.x} cy={hub.y} r="118" strokeDasharray="1 14" className="home-world-ring-spin" />
        </g>

        {/* 航线光晕 */}
        <g filter={`url(#wm-glow-line-${uid})`} opacity="0.55">
          {spokes.map((n) => (
            <path
              key={`glow-${n.key}`}
              d={arcPath(hub.x, hub.y, n.x, n.y, routeBend(n.key))}
              fill="none"
              stroke="#2DD4BF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* 航线 */}
        <g className="home-world-lines">
          {spokes.map((n, i) => (
            <path
              key={`line-${n.key}`}
              d={arcPath(hub.x, hub.y, n.x, n.y, routeBend(n.key))}
              className="home-world-line home-world-line--atelier"
              style={{ animationDelay: `${i * 0.28}s` }}
              stroke={`url(#wm-route-${uid})`}
            />
          ))}
        </g>

        {/* 流动光点 */}
        {spokes.map((n, i) => {
          const d = arcPath(hub.x, hub.y, n.x, n.y, routeBend(n.key));
          return (
            <circle key={`pkt-${n.key}`} r="2.8" fill="#0F766E" className="home-world-packet">
              <animateMotion dur={`${2.8 + i * 0.4}s`} repeatCount="indefinite" path={d} />
            </circle>
          );
        })}

        {/* 节点：仅国码 + 国名 + 精灵，无圆圈底 */}
        {NODES.map((n) => {
          const isHub = n.key === HUB_KEY;
          const poke = isHub ? 46 : n.size === "major" ? 40 : 36;

          return (
            <g key={n.key} className="home-world-map-marker" transform={`translate(${n.x}, ${n.y})`}>
              {/* 航线端点小点 */}
              <circle r={isHub ? 3.2 : 2.4} fill={isHub ? "#14B8A6" : n.accent} opacity="0.9" />

              <text
                y={isHub ? -10 : -8}
                textAnchor="middle"
                className={isHub ? "home-world-map-code home-world-map-code--hub" : "home-world-map-code"}
              >
                {n.code}
              </text>

              <text
                y={isHub ? 18 : 16}
                textAnchor="middle"
                className="home-world-map-name"
                filter={`url(#wm-label-${uid})`}
              >
                {T(n.key)}
              </text>

              <image
                href={pokemonSpriteUrl(n.pokemon)}
                x={n.pokeX}
                y={n.pokeY}
                width={poke}
                height={poke}
                className="home-world-map-pokemon"
              />
            </g>
          );
        })}

        {/* 角落签名式标注 */}
        {!isCompact && (
          <text x="36" y="392" className="home-world-map-caption">
            PIMART · GLOBAL NETWORK
          </text>
        )}
      </svg>
    </div>
  );
}

export function HomeWorldTrust() {
  return (
    <section className="home-world-map-section mb-10 sm:mb-14 lg:mb-16">
      <div className="home-world-map-shell">
        <WorldTrustMap variant="full" />
      </div>
    </section>
  );
}
