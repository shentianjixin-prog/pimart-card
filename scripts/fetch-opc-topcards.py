# -*- coding: utf-8 -*-
"""
把海贼王 OPC 各弹最贵 5 张卡图写入 Product.images（盒图 + top5），
并生成 opc-topcards-manifest.json 供 Railway sync-product-images 使用。
"""
from __future__ import annotations

import json
import re
import sqlite3
from pathlib import Path

ROOT = Path(r"C:\Users\33092\Documents\card-shop")
DB = ROOT / "dev.db"
OUT = ROOT / "scripts" / "opc-topcards-manifest.json"
TOP = ROOT / "public" / "products" / "topcards"

# 系列代码 → 本地卡图（按贵→便宜，与 opc-set-specs topCards 一致）
SET_CARDS: dict[str, list[str]] = {}

for code in ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "14"]:
    paths = []
    for i in range(1, 6):
        for ext in ("jpeg", "jpg", "webp", "png"):
            p = TOP / f"opc-{code}-card-{i}.{ext}"
            if p.exists():
                paths.append(f"/products/topcards/{p.name}")
                break
    if paths:
        SET_CARDS[f"OPC-{code}"] = paths

# OPC-15：从官网策划图里挑 5 张代表性 chase（SEC/SP 优先）
opc15 = [
    "opc-15-1-1.png",  # 路飞 SEC
    "opc-15-1-2.png",  # 艾尼路 SEC
    "opc-15-4-1.png",  # 艾尼路超级异画
    "opc-15-3-1.png",
    "opc-15-3-2.png",
]
SET_CARDS["OPC-15"] = [f"/products/topcards/{n}" for n in opc15 if (TOP / n).exists()]

# OPC-16（若有商品）
opc16 = [
    "opc-16-2-1.png",
    "opc-16-2-2.png",
    "opc-16-3-1.png",
    "opc-16-3-2.png",
    "opc-16-3-3.png",
]
SET_CARDS["OPC-16"] = [f"/products/topcards/{n}" for n in opc16 if (TOP / n).exists()]

print("sets:", {k: len(v) for k, v in SET_CARDS.items()})

conn = sqlite3.connect(DB)
conn.row_factory = sqlite3.Row
rows = conn.execute(
    """
    SELECT id, slug, series, images
    FROM Product
    WHERE slug LIKE 'opc-%'
       OR series LIKE 'OPC-%'
    ORDER BY slug
    """
).fetchall()

manifest: dict[str, dict] = {}
updated = 0

for row in rows:
    series = row["series"] or ""
    m = re.match(r"^(OPC-\d+)\b", series, re.I)
    if not m:
        print("skip no code:", row["slug"], series)
        continue
    code = m.group(1).upper()
    # normalize OPC-1 → already OPC-01 style in our keys
    tops = SET_CARDS.get(code) or []
    if not tops:
        print("skip no cards:", row["slug"], code)
        continue

    parts = [p.strip() for p in (row["images"] or "").split(",") if p.strip()]
    box = next((p for p in parts if "/topcards/" not in p), parts[0] if parts else "")
    if not box:
        print("skip no box:", row["slug"])
        continue

    new_images = ",".join([box] + tops)
    manifest[row["slug"]] = {"set_id": code, "topcards": tops}

    if new_images != (row["images"] or "").strip():
        conn.execute(
            "UPDATE Product SET images = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
            (new_images, row["id"]),
        )
        updated += 1
        print("updated", row["slug"])
    else:
        print("unchanged", row["slug"])

conn.commit()
conn.close()

OUT.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"done. updated={updated} manifest={OUT} entries={len(manifest)}")
