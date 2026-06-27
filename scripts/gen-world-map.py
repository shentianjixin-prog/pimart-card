"""生成简化世界地图 SVG（等距圆柱投影）。"""

from pathlib import Path

W, H = 1000, 500

# 简化大陆轮廓（经度, 纬度）
LANDS = {
    "north_america": [
        (-168, 65), (-140, 72), (-95, 72), (-75, 68), (-60, 52), (-82, 28),
        (-105, 22), (-118, 32), (-125, 48), (-155, 58), (-168, 65),
    ],
    "south_america": [
        (-82, 12), (-72, 2), (-58, -5), (-48, -22), (-58, -38), (-72, -52),
        (-74, -42), (-70, -18), (-78, 0), (-82, 12),
    ],
    "eurasia": [
        (-10, 36), (25, 38), (55, 42), (95, 52), (140, 48), (145, 38),
        (130, 30), (105, 22), (75, 8), (55, 12), (25, 12), (0, 18),
        (-10, 36),
    ],
    "africa": [
        (-18, 32), (12, 38), (42, 12), (52, -2), (42, -28), (18, -34),
        (12, -8), (-8, 8), (-18, 32),
    ],
    "se_asia": [
        (95, 22), (108, 8), (118, 2), (122, 8), (110, 18), (95, 22),
    ],
    "japan": [
        (130, 32), (136, 36), (142, 40), (145, 43), (141, 35), (130, 32),
    ],
    "australia": [
        (115, -12), (130, -12), (152, -24), (150, -38), (130, -35), (115, -22), (115, -12),
    ],
}


def project(lon: float, lat: float) -> tuple[float, float]:
    x = (lon + 180) / 360 * W
    y = (90 - lat) / 180 * H
    return x, y


def to_path(points: list[tuple[float, float]]) -> str:
    coords = [project(lon, lat) for lon, lat in points]
    parts = [f"M {coords[0][0]:.1f} {coords[0][1]:.1f}"]
    for x, y in coords[1:]:
        parts.append(f"L {x:.1f} {y:.1f}")
    parts.append("Z")
    return " ".join(parts)


paths = "\n    ".join(
    f'<path class="land" d="{to_path(pts)}" />' for pts in LANDS.values()
)

svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" aria-hidden="true">
  <defs>
    <linearGradient id="ocean" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#eef4fb" />
      <stop offset="100%" stop-color="#e2ebf5" />
    </linearGradient>
    <linearGradient id="landGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#dfe6ef" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
  </defs>
  <rect width="{W}" height="{H}" fill="url(#ocean)" />
  <g fill="url(#landGrad)" stroke="#94a3b8" stroke-width="0.8" stroke-linejoin="round">
    {paths}
  </g>
</svg>
"""

out = Path(__file__).resolve().parents[1] / "public/decor/world-map.svg"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(svg, encoding="utf-8")
print(f"Wrote {out}")
