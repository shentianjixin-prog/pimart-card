# -*- coding: utf-8 -*-
"""
上架后二次校准：
1) 礼盒/套装/STC/EBC 挂上已有官方图
2) 同系列规格族（原盒/散包/原箱）系列名对齐，保证详情页可选规格
3) 扩充包 description 补「可选规格」提示（不覆盖已有长说明开头）
"""
from __future__ import annotations

import re
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


def resolve_dbs() -> list[Path]:
    import os

    out: list[Path] = []
    url = (os.environ.get("DATABASE_URL") or "").strip()
    if url.startswith("file:"):
        p = Path(url[5:])
        if not p.is_absolute():
            p = (ROOT / p).resolve()
        out.append(p)
    for p in (ROOT / "dev.db", ROOT / "prisma" / "data" / "initial.db"):
        if p.resolve() not in {x.resolve() for x in out}:
            out.append(p)
    return out


DBS = resolve_dbs()


def exists(rel: str) -> bool:
    return (PUBLIC / rel.lstrip("/")).exists()


# slug 精确映射（优先）
SLUG_IMAGE = {
    "n-battle-box-简中": "/products/n-battle-box.png",
    "master-deck-多龙巴鲁托ex-简中": "/products/master-deck-hydreigon.png",
    "master-deck-猛雷鼓ex-简中": "/products/master-deck-thunderdrum.png",
    "master-deck-赛富豪ex-简中": "/products/master-deck-ceruledge.png",
    "happy-combo-简中": "/products/happy-combo.png",
    "rocket-gang-special-box-简中": "/products/rocket-gang-box.png",
    "lillie-battle-box-简中": "/products/lillie-battle-box.png",
    "eevee-gift-box-简中": "/products/eevee-gift-box.png",
    "特别补充包-纪念收藏合集-原盒-简中-": "/products/onepiece-official/ebc-01-pack.png",
    "特别补充包-纪念收藏合集-散包-简中-": "/products/onepiece-official/ebc-01-pack.png",
    "特别补充包-纪念收藏合集-原箱-简中-": "/products/onepiece-official/ebc-01-pack.png",
    "基本卡组-对战进阶套组2026-官方名称-简中定价待官方公布-": "/products/onepiece-official/stc-31-36-decks.png",
    "基本卡组-对战进阶套组2025-官方名称-简中定价待官方公布-": "/products/onepiece-official/stc-23-28-decks.png",
    "基本卡组-变档5档-官方名称-简中定价待官方公布-": "/products/onepiece-official/stc-15-deck.png",
    "基本卡组-路飞-艾斯-官方名称-简中定价待官方公布-": "/products/onepiece-official/stc-22-deck.png",
    "基本卡组-艾斯和纽哥特-官方名称-简中定价待官方公布-": "/products/onepiece-official/stc-30-deck.png",
    "30周年庆典-最初的伙伴-Vol3-简中": "/products/30th-vol2.png",  # 暂用 Vol.2 风格占位，后续官网图替换
}

# 名称关键字 → 图
NAME_IMAGE = [
    ("纪念收藏合集", "/products/onepiece-official/ebc-01-pack.png"),
    ("对战进阶套组2026", "/products/onepiece-official/stc-31-36-decks.png"),
    ("对战进阶套组2025", "/products/onepiece-official/stc-23-28-decks.png"),
    ("变档5档", "/products/onepiece-official/stc-15-deck.png"),
    ("路飞＆艾斯", "/products/onepiece-official/stc-22-deck.png"),
    ("路飞&艾斯", "/products/onepiece-official/stc-22-deck.png"),
    ("艾斯和纽哥特", "/products/onepiece-official/stc-30-deck.png"),
    ("最初的伙伴展示套装", "/products/151-box.png"),
    ("硬币收藏艺术展示框", "/products/151-box.png"),
]

# 系列名对齐：纪念收藏合集 → EBC-01，便于规格切换
SERIES_FIX = {
    "特别补充包-纪念收藏合集-原盒-简中-": "EBC-01",
    "特别补充包-纪念收藏合集-散包-简中-": "EBC-01",
    "特别补充包-纪念收藏合集-原箱-简中-": "EBC-01",
}


def cover_of(images: str | None) -> str:
    return (images or "").split(",")[0].strip()


def with_cover(images: str | None, cover: str) -> str:
    parts = [p.strip() for p in (images or "").split(",") if p.strip()]
    tops = [p for p in parts[1:] if "/topcards/" in p]
    return ",".join([cover] + tops)


def pick_for_row(slug: str, name: str, images: str | None) -> str | None:
    if slug in SLUG_IMAGE and exists(SLUG_IMAGE[slug]):
        return SLUG_IMAGE[slug]
    for key, path in NAME_IMAGE:
        if key in name and exists(path):
            return path
    # 已有正确图则不动
    c = cover_of(images)
    if c and "placeholder" not in c and exists(c):
        return None
    # 礼盒误挂 csv 瘦图时纠正
    if c and "csv10c" in c and any(k in name for k in ("礼盒", "套装", "嗨皮", "大师战略", "火箭队")):
        if slug in SLUG_IMAGE and exists(SLUG_IMAGE[slug]):
            return SLUG_IMAGE[slug]
    return None


def ensure_spec_note(desc: str | None, box_type: str, series: str | None) -> str | None:
    """扩充包/OPC/EBC 说明里补可选规格一行。"""
    if box_type not in {"原盒", "散包", "原箱", "瘦盒", "肥盒", "瘦散包", "肥散包", "瘦原箱", "肥原箱", "宝石包"}:
        return desc
    note = None
    if box_type in {"原盒", "散包", "原箱"}:
        note = "可选规格：原盒 / 散包 / 原箱。"
    elif box_type.startswith("瘦") or box_type.startswith("肥"):
        note = "可选规格：瘦盒 / 肥盒 / 瘦散包 / 肥散包 / 瘦原箱 / 肥原箱。"
    elif box_type == "宝石包":
        note = "可选规格：宝石包 / 散包 / 原箱。"
    if not note:
        return desc
    text = (desc or "").strip()
    if "可选规格" in text:
        return text or desc
    if text:
        return f"{note}\n{text}"
    return note


def fix_db(db: Path) -> None:
    if not db.exists():
        print("skip", db)
        return
    conn = sqlite3.connect(db)
    rows = conn.execute(
        """
        SELECT id, slug, name, series, boxType, images, description
        FROM Product WHERE status='上架'
        """
    ).fetchall()
    n_img = n_series = n_desc = 0
    for pid, slug, name, series, box_type, images, desc in rows:
        cover = pick_for_row(slug, name, images)
        new_images = images
        if cover:
            new_images = with_cover(images, cover)
            n_img += 1
        new_series = SERIES_FIX.get(slug, series)
        if new_series != series:
            n_series += 1
        # 纪念收藏合集 series 统一
        if "纪念收藏合集" in name and series != "EBC-01":
            new_series = "EBC-01"
            n_series += 1
        new_desc = ensure_spec_note(desc, box_type or "", new_series)
        if new_desc != desc:
            n_desc += 1
        if new_images != images or new_series != series or new_desc != desc:
            conn.execute(
                """
                UPDATE Product
                SET images=?, series=?, description=?, updatedAt=CURRENT_TIMESTAMP
                WHERE id=?
                """,
                (new_images, new_series, new_desc, pid),
            )
    conn.commit()
    # EBC-02 等：确保同系列至少有 原盒/散包/原箱 且 description 含规格
    ebc = conn.execute(
        """
        SELECT series, GROUP_CONCAT(boxType)
        FROM Product
        WHERE status='上架' AND series LIKE 'EBC-%'
        GROUP BY series
        """
    ).fetchall()
    print(db.name, f"images~{n_img} series~{n_series} desc~{n_desc}")
    for s, boxes in ebc:
        print(" ", s, boxes)
    conn.close()


def main() -> None:
    # 兼容若干礼盒文件名
    aliases = {
        "/products/n-battle-box.png": [
            "/products/n-battle-box.png",
            "/products/n-vs-box.png",
        ],
        "/products/lillie-battle-box.png": [
            "/products/lillie-battle-box.png",
            "/products/lillie-box.png",
        ],
        "/products/master-deck-hydreigon.png": [
            "/products/master-deck-hydreigon.png",
            "/products/master-deck-多龙巴鲁托.png",
        ],
    }
    for canon, cands in aliases.items():
        if exists(canon):
            continue
        for c in cands[1:]:
            if exists(c):
                SLUG_IMAGE_KEYS = [k for k, v in SLUG_IMAGE.items() if v == canon]
                for k in SLUG_IMAGE_KEYS:
                    SLUG_IMAGE[k] = c
                break

    # 探测实际礼盒文件
    for slug, path in list(SLUG_IMAGE.items()):
        if not exists(path):
            # 模糊找
            stem = Path(path).stem
            hits = list((PUBLIC / "products").glob(f"*{stem.split('-')[0]}*"))
            # 专用探测
            if "master-deck-hydreigon" in path:
                for p in (PUBLIC / "products").glob("master-deck*"):
                    if "hydreigon" in p.name.lower() or "多龙" in p.name:
                        SLUG_IMAGE[slug] = f"/products/{p.name}"
                        break
            elif "thunderdrum" in path:
                for p in (PUBLIC / "products").glob("master-deck*"):
                    if "thunder" in p.name.lower() or "猛雷" in p.name:
                        SLUG_IMAGE[slug] = f"/products/{p.name}"
                        break
            elif "ceruledge" in path:
                for p in (PUBLIC / "products").glob("master-deck*"):
                    if "ceru" in p.name.lower() or "赛富" in p.name:
                        SLUG_IMAGE[slug] = f"/products/{p.name}"
                        break
            elif "happy-combo" in path:
                for p in (PUBLIC / "products").glob("happy*"):
                    SLUG_IMAGE[slug] = f"/products/{p.name}"
                    break
            elif "rocket" in path:
                for p in (PUBLIC / "products").glob("rocket*"):
                    SLUG_IMAGE[slug] = f"/products/{p.name}"
                    break
            elif "n-battle" in path:
                for p in (PUBLIC / "products").glob("n-*"):
                    SLUG_IMAGE[slug] = f"/products/{p.name}"
                    break
            elif "lillie" in path:
                for p in (PUBLIC / "products").glob("lillie*"):
                    SLUG_IMAGE[slug] = f"/products/{p.name}"
                    break

    print("resolved maps:")
    for k, v in SLUG_IMAGE.items():
        print(" ", k, "->", v, "OK" if exists(v) else "MISSING")

    for db in DBS:
        fix_db(db)


if __name__ == "__main__":
    main()
