"use client";

import { useT } from "@/lib/lang-context";

type Region = {
  key: string;
  x: number;
  y: number;
  flag: string;
  /** PokeAPI national dex id */
  pokemon: number;
};

const REGIONS: Region[] = [
  { key: "region_jp", x: 78, y: 42, flag: "🇯🇵", pokemon: 25 },
  { key: "region_cn", x: 68, y: 38, flag: "🇨🇳", pokemon: 143 },
  { key: "region_us", x: 22, y: 36, flag: "🇺🇸", pokemon: 6 },
  { key: "region_sg", x: 72, y: 58, flag: "🇸🇬", pokemon: 448 },
  { key: "region_my", x: 70, y: 52, flag: "🇲🇾", pokemon: 658 },
  { key: "region_th", x: 74, y: 48, flag: "🇹🇭", pokemon: 94 },
];

const HUB_KEY = "region_jp";

function pokemonSpriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function curvePath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.06;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

export function HomeWorldTrust() {
  const T = useT();
  const hub = REGIONS.find((r) => r.key === HUB_KEY)!;
  const spokes = REGIONS.filter((r) => r.key !== HUB_KEY);

  return (
    <section className="home-world mb-10 pb-10 sm:mb-14 sm:pb-14 lg:mb-16 lg:pb-16">
      <div className="home-world-panel">
        <div className="mb-8 text-center lg:mb-10">
          <h2 className="trusted-section-title">{T("world_title")}</h2>
          <p className="trusted-section-subtitle mx-auto max-w-2xl">{T("world_subtitle")}</p>
        </div>

        <div className="home-world-map relative mx-auto aspect-[2/1] max-w-3xl overflow-hidden rounded-[32px] border border-[rgba(15,23,42,0.08)] bg-gradient-to-b from-[#F8FAFC] to-[#FAFAFA]">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.12) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute inset-[12%] rounded-[40%] border border-[rgba(15,23,42,0.06)] bg-white/40" />

          <svg
            className="home-world-lines absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="world-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#15803D" stopOpacity="0.15" />
                <stop offset="45%" stopColor="#15803D" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#111827" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {spokes.map((r) => (
              <path
                key={`line-${r.key}`}
                d={curvePath(hub.x, hub.y, r.x, r.y)}
                className="home-world-line"
              />
            ))}
          </svg>

          {REGIONS.map((r) => (
            <div
              key={r.key}
              className={`home-world-marker absolute ${r.key === HUB_KEY ? "home-world-marker--hub" : ""}`}
              style={{ left: `${r.x}%`, top: `${r.y}%` }}
            >
              <div className="home-world-marker-ring" aria-hidden />
              <div className="home-world-marker-badge">
                <span className="home-world-flag" aria-hidden>
                  {r.flag}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pokemonSpriteUrl(r.pokemon)}
                  alt=""
                  className="home-world-pokemon"
                  width={32}
                  height={32}
                  loading="lazy"
                />
              </div>
              <span className="home-world-label">{T(r.key)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3 lg:hidden">
          {REGIONS.map((r) => (
            <span
              key={r.key}
              className="home-world-mobile-pill inline-flex items-center gap-1.5 rounded-full border border-[rgba(15,23,42,0.08)] bg-white px-3 py-1.5 text-xs font-semibold text-[#374151]"
            >
              <span aria-hidden>{r.flag}</span>
              {T(r.key)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
