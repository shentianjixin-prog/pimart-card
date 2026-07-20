# -*- coding: utf-8 -*-
"""核对上架缺口：缺图 / 规格族不完整。"""
from __future__ import annotations

import sqlite3
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
DB = ROOT / "dev.db"


def main() -> None:
    conn = sqlite3.connect(DB)
    rows = conn.execute(
        """
        SELECT name, slug, series, boxType, images, catalogSort
        FROM Product
        WHERE status='上架' AND catalogSort < 999999
        ORDER BY catalogSort
        """
    ).fetchall()
    missing = []
    placeholder = []
    ok = 0
    for name, slug, series, box, images, cs in rows:
        cover = (images or "").split(",")[0].strip()
        if not cover or "placeholder" in cover:
            placeholder.append((cs, name, slug, cover, series, box))
            continue
        p = PUBLIC / cover.lstrip("/")
        if not p.exists():
            missing.append((cs, name, slug, cover, series, box))
        else:
            ok += 1
    print("OK files", ok)
    print("placeholder", len(placeholder))
    for x in placeholder:
        print(" PH", x)
    print("missing file", len(missing))
    for x in missing:
        print(" MF", x)

    g: dict[str, set[str]] = defaultdict(set)
    for name, slug, series, box, images, cs in rows:
        if series:
            g[str(series)].add(str(box or ""))
    print("--- series with <2 boxTypes ---")
    weak = []
    for s, boxes in sorted(g.items()):
        if len(boxes) < 2 and any(b in ("原盒", "瘦盒", "肥盒", "宝石包") for b in boxes):
            if any(k in s for k in ("CSV", "OPC", "EBC", "PRB", "STC", "收集啦", "CS", "CSM", "宝石")):
                weak.append((s, sorted(boxes)))
    print("weak", len(weak))
    for s, u in weak:
        print(s, u)

    # 列表可见主链（排除 VARIANT_ONLY）
    variant_only = {
        "散包",
        "原箱",
        "肥散包",
        "瘦散包",
        "肥原箱",
        "瘦原箱",
        "肥盒",
    }
    visible = [r for r in rows if r[3] not in variant_only]
    print("list-visible SKUs", len(visible))
    print("first10 visible:")
    for r in visible[:10]:
        print(r[5], r[3], r[0][:40], r[2])
    print("opc first visible:")
    for r in visible:
        if r[2] and str(r[2]).startswith("OPC"):
            print(r[5], r[3], r[0][:50], r[2])
            break
    conn.close()


if __name__ == "__main__":
    main()
