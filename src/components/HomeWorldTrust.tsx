"use client";

import { useT } from "@/lib/lang-context";

type Region = {
  key: string;
  x: number;
  y: number;
  flag: string;
  pokemon: number;
  bentoKey?: string;
};

const REGIONS: Region[] = [
  { key: "region_jp", x: 78, y: 42, flag: "🇯🇵", pokemon: 25, bentoKey: "jp" },
  { key: "region_cn", x: 68, y: 38, flag: "🇨🇳", pokemon: 143, bentoKey: "cn" },
  { key: "region_us", x: 22, y: 36, flag: "🇺🇸", pokemon: 6, bentoKey: "us" },
  { key: "region_sg", x: 72, y: 58, flag: "🇸🇬", pokemon: 448, bentoKey: "sg" },
  { key: "region_my", x: 70, y: 52, flag: "🇲🇾", pokemon: 658, bentoKey: "my" },
  { key: "region_th", x: 74, y: 48, flag: "🇹🇭", pokemon: 94, bentoKey: "th" },
];

const HUB_KEY = "region_jp";

const BENTO_SIDE_KEYS = ["region_us", "region_cn", "region_jp"] as const;
const BENTO_BOTTOM_KEYS = ["region_sg", "region_my", "region_th"] as const;

function pokemonSpriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function curvePath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.06;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

function BentoRegionTile({ regionKey }: { regionKey: string }) {
  const T = useT();
  const r = REGIONS.find((item) => item.key === regionKey)!;
  const isHub = regionKey === HUB_KEY;

  return (
    <div className={`home-world-bento-tile home-world-bento-tile--${r.bentoKey}`}>
      <div className="home-world-bento-tile-inner">
        <span className="home-world-bento-flag" aria-hidden>
          {r.flag}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pokemonSpriteUrl(r.pokemon)}
          alt=""
          className="home-world-bento-pokemon"
          width={36}
          height={36}
          loading="lazy"
        />
        <p className="home-world-bento-tile-label">{T(r.key)}</p>
        {isHub && <span className="home-world-bento-hub-tag">HUB</span>}
      </div>
    </div>
  );
}

export function HomeWorldTrust() {
  const T = useT();
  const hub = REGIONS.find((r) => r.key === HUB_KEY)!;
  const spokes = REGIONS.filter((r) => r.key !== HUB_KEY);

  return (
    <section className="home-world-bento-section mb-10 sm:mb-14 lg:mb-16">
      <div className="home-world-bento-shell">
        <div className="home-world-bento-grid">
          <header className="home-world-bento-cell home-world-bento-head">
            <h2 className="trusted-section-title text-left">{T("world_title")}</h2>
            <p className="trusted-section-subtitle mt-2 max-w-xl text-left">{T("world_subtitle")}</p>
          </header>

          <div className="home-world-bento-cell home-world-bento-waterfall">
            {BENTO_SIDE_KEYS.map((key) => (
              <BentoRegionTile key={key} regionKey={key} />
            ))}
          </div>

          <div className="home-world-bento-cell home-world-bento-map-wrap">
            <div className="home-world-map relative h-full min-h-[220px] w-full overflow-hidden sm:min-h-[280px] lg:min-h-[320px]">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.14) 1px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute inset-[10%] rounded-[40%] border border-[rgba(15,23,42,0.08)] bg-white/50" />

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
          </div>

          <div className="home-world-bento-cell home-world-bento-rail">
            {BENTO_BOTTOM_KEYS.map((key) => (
              <BentoRegionTile key={key} regionKey={key} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
