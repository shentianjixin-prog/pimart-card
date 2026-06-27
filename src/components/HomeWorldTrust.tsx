"use client";

import { useT } from "@/lib/lang-context";

const MAP_W = 1000;
const MAP_H = 500;
const HUB_KEY = "region_jp";

type Region = {
  key: string;
  lon: number;
  lat: number;
  labelLon: number;
  labelLat: number;
  code: string;
  flag: string;
  pokemon: number;
};

const REGIONS: Region[] = [
  {
    key: "region_us",
    lon: -98,
    lat: 38,
    labelLon: -102,
    labelLat: 41,
    code: "US",
    flag: "🇺🇸",
    pokemon: 6,
  },
  {
    key: "region_cn",
    lon: 116,
    lat: 39,
    labelLon: 104,
    labelLat: 31,
    code: "CN",
    flag: "🇨🇳",
    pokemon: 143,
  },
  {
    key: "region_jp",
    lon: 139,
    lat: 36,
    labelLon: 136,
    labelLat: 40,
    code: "JP",
    flag: "🇯🇵",
    pokemon: 25,
  },
  {
    key: "region_th",
    lon: 100.5,
    lat: 13.7,
    labelLon: 99,
    labelLat: 18,
    code: "TH",
    flag: "🇹🇭",
    pokemon: 94,
  },
  {
    key: "region_my",
    lon: 101.7,
    lat: 3.1,
    labelLon: 110,
    labelLat: 5,
    code: "MY",
    flag: "🇲🇾",
    pokemon: 658,
  },
  {
    key: "region_sg",
    lon: 103.8,
    lat: 1.35,
    labelLon: 106,
    labelLat: 2.2,
    code: "SG",
    flag: "🇸🇬",
    pokemon: 448,
  },
];

const LAND_PATHS = [
  "M 33.3 69.4 L 111.1 50.0 L 236.1 50.0 L 291.7 61.1 L 333.3 105.6 L 272.2 172.2 L 208.3 188.9 L 172.2 161.1 L 152.8 116.7 L 69.4 88.9 L 33.3 69.4 Z",
  "M 272.2 216.7 L 300.0 244.4 L 338.9 263.9 L 366.7 311.1 L 338.9 355.6 L 300.0 394.4 L 294.4 366.7 L 305.6 300.0 L 283.3 250.0 L 272.2 216.7 Z",
  "M 472.2 150.0 L 569.4 144.4 L 652.8 133.3 L 763.9 105.6 L 888.9 116.7 L 902.8 144.4 L 861.1 166.7 L 791.7 188.9 L 708.3 227.8 L 652.8 216.7 L 569.4 216.7 L 500.0 200.0 L 472.2 150.0 Z",
  "M 450.0 161.1 L 533.3 144.4 L 616.7 216.7 L 644.4 255.6 L 616.7 327.8 L 550.0 344.4 L 533.3 272.2 L 477.8 227.8 L 450.0 161.1 Z",
  "M 763.9 188.9 L 800.0 227.8 L 827.8 244.4 L 838.9 227.8 L 805.6 200.0 L 763.9 188.9 Z",
  "M 861.1 161.1 L 877.8 150.0 L 894.4 138.9 L 902.8 130.6 L 891.7 152.8 L 861.1 161.1 Z",
  "M 819.4 283.3 L 861.1 283.3 L 922.2 316.7 L 916.7 355.6 L 861.1 347.2 L 819.4 311.1 L 819.4 283.3 Z",
];

function project(lon: number, lat: number) {
  return {
    x: ((lon + 180) / 360) * MAP_W,
    y: ((90 - lat) / 180) * MAP_H,
  };
}

function pokemonSpriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function curvePath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.08;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

export function HomeWorldTrust() {
  const T = useT();
  const hub = REGIONS.find((r) => r.key === HUB_KEY)!;
  const hubPt = project(hub.lon, hub.lat);
  const spokes = REGIONS.filter((r) => r.key !== HUB_KEY);

  return (
    <section className="home-world-map-section mb-10 sm:mb-14 lg:mb-16">
      <div className="home-world-map-shell">
        <div className="home-world-map">
          <svg
            className="home-world-map-svg"
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={T("world_title")}
          >
            <defs>
              <linearGradient id="world-ocean" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eef4fb" />
                <stop offset="100%" stopColor="#e2ebf5" />
              </linearGradient>
              <linearGradient id="world-land" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dfe6ef" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="world-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#15803D" stopOpacity="0.15" />
                <stop offset="45%" stopColor="#15803D" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#111827" stopOpacity="0.2" />
              </linearGradient>
              <filter id="world-label-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#ffffff" floodOpacity="0.95" />
              </filter>
            </defs>

            <rect width={MAP_W} height={MAP_H} fill="url(#world-ocean)" rx="8" />

            <g fill="url(#world-land)" stroke="#94a3b8" strokeWidth="0.8" strokeLinejoin="round">
              {LAND_PATHS.map((d, i) => (
                <path key={`land-${i}`} d={d} />
              ))}
            </g>

            {/* 国家名称标注 */}
            {REGIONS.map((r) => {
              const label = project(r.labelLon, r.labelLat);
              return (
                <g key={`label-${r.key}`} filter="url(#world-label-shadow)">
                  <text
                    x={label.x}
                    y={label.y}
                    textAnchor="middle"
                    className="home-world-map-code"
                  >
                    {r.code}
                  </text>
                  <text
                    x={label.x}
                    y={label.y + 16}
                    textAnchor="middle"
                    className="home-world-map-name"
                  >
                    {T(r.key)}
                  </text>
                </g>
              );
            })}

            {/* 航线 */}
            <g className="home-world-lines">
              {spokes.map((r) => {
                const pt = project(r.lon, r.lat);
                return (
                  <path
                    key={`line-${r.key}`}
                    d={curvePath(hubPt.x, hubPt.y, pt.x, pt.y)}
                    className="home-world-line"
                  />
                );
              })}
            </g>

            {/* 节点：国旗 + 宝可梦 */}
            {REGIONS.map((r) => {
              const pt = project(r.lon, r.lat);
              const isHub = r.key === HUB_KEY;
              const radius = isHub ? 26 : 22;

              return (
                <g
                  key={`marker-${r.key}`}
                  className={isHub ? "home-world-map-marker home-world-map-marker--hub" : "home-world-map-marker"}
                  transform={`translate(${pt.x}, ${pt.y})`}
                >
                  <circle
                    className="home-world-map-marker-ring"
                    r={radius + 10}
                    fill="rgba(21, 128, 61, 0.12)"
                  />
                  <circle
                    className="home-world-map-marker-badge"
                    r={radius}
                    fill="#ffffff"
                    stroke={isHub ? "rgba(21, 128, 61, 0.35)" : "rgba(15, 23, 42, 0.08)"}
                    strokeWidth={isHub ? 2 : 1.5}
                  />
                  <text y={4} textAnchor="middle" className="home-world-map-flag">
                    {r.flag}
                  </text>
                  <image
                    href={pokemonSpriteUrl(r.pokemon)}
                    x={isHub ? 10 : 8}
                    y={isHub ? 10 : 8}
                    width={isHub ? 34 : 30}
                    height={isHub ? 34 : 30}
                    className="home-world-map-pokemon"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
