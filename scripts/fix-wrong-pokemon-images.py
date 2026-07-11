# -*- coding: utf-8 -*-
"""最终选定正确主图并写回 DB。"""
from __future__ import annotations

import hashlib
import io
import re
import shutil
import sqlite3
import ssl
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "products"
PROBE = PUBLIC / "_probe2"
DBS = [ROOT / "dev.db", ROOT / "prisma" / "data" / "initial.db"]

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE
UA = {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://www.pokemon.cn/",
}


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        return r.read()


def clean(u: str) -> str:
    return u.replace("&#038;", "&").replace("&amp;", "&")


def is_img(data: bytes) -> bool:
    return data[:4] == b"\x89PNG" or data[:2] == b"\xff\xd8"


def write_v2(name: str, data: bytes) -> None:
    dest = PUBLIC / name
    dest.write_bytes(data)
    legacy = name.replace("-v2", "")
    # duanwu special
    if name.startswith("duanwu2026"):
        legacy = "duanwu2026-box.png"
    shutil.copy2(dest, PUBLIC / legacy)
    im = Image.open(io.BytesIO(data))
    print(f"SET {name} {im.size} {len(data)}b {hashlib.md5(data).hexdigest()[:10]}")


def update_db(mapping: dict[str, str]) -> None:
    for dbp in DBS:
        if not dbp.exists():
            continue
        db = sqlite3.connect(dbp)
        n = 0
        for pid, images in db.execute("SELECT id, images FROM Product"):
            nxt = images or ""
            for old, new in mapping.items():
                nxt = nxt.replace(old, new)
            if nxt != (images or ""):
                db.execute("UPDATE Product SET images=? WHERE id=?", (nxt, pid))
                n += 1
        cols = [r[1] for r in db.execute("PRAGMA table_info(Product)")]
        if "language" in cols:
            db.execute(
                "UPDATE Product SET language=? WHERE name LIKE ? OR name LIKE ?",
                ("日文", "%黑炎霸主%", "%雪危险%泥土%"),
            )
        db.commit()
        db.close()
        print(f"[{dbp.name}] image rows updated={n}")


def main() -> None:
    # ---- csv5: 官网宣传主视觉（含正确盒/包图）----
    write_v2("csv5c-box-v2.png", (PUBLIC / "csv5c-box-v2.png").read_bytes())

    # ---- csv7: 官网 650 宣传主视觉 ----
    write_v2("csv7c-box-v2.png", (PROBE / "csv7_650.png").read_bytes())

    # ---- ylsc battle: 已确认对战礼盒 ----
    write_v2("ylsc-battle-box-v2.png", (PROBE / "ylsc_battle_4.png").read_bytes())

    # ---- ylsc collect: 在「伤害指示物收纳盒」附近找礼盒图 ----
    print("\n=== find collect gift box ===")
    html = fetch("https://www.pokemon.cn/tcg/17590.html").decode("utf-8", "replace")
    # 收藏章节：从「游历收藏周边礼盒」到「游历对战周边礼盒」之间
    i0 = html.find("游历收藏周边礼盒")
    i1 = html.find("游历对战周边礼盒")
    chunk = html[i0:i1] if i0 >= 0 and i1 > i0 else ""
    print("collect section len", len(chunk))
    urls = []
    for m in re.finditer(
        r"https?://image\.pokemon\.com\.cn/wp-content/uploads/[^\s\"'<>]+",
        chunk,
        re.I,
    ):
        u = clean(m.group(0))
        if u not in urls:
            urls.append(u)
    print("urls in collect section", len(urls))
    battle_hash = hashlib.md5((PROBE / "ylsc_battle_4.png").read_bytes()).hexdigest()
    chosen = None
    for i, u in enumerate(urls):
        if any(x in u for x in ("icon512", "-150x", "-300x300")):
            continue
        try:
            data = fetch(u)
        except Exception:
            continue
        if not is_img(data) or len(data) < 100000:
            continue
        h = hashlib.md5(data).hexdigest()
        if h == battle_hash:
            continue
        im = Image.open(io.BytesIO(data))
        print(f"  cand{i} {im.size} {len(data)} {h[:10]} {u.split('/')[-1][:55]}")
        # 礼盒一般竖图接近 1000x1443
        if im.height > im.width * 1.2 and len(data) > 400000:
            chosen = data
            print("  -> pick as collect")
            break
    if chosen is None:
        # 退而用「伤害指示物」关键词后的第一张大竖图
        for m in re.finditer("伤害指示物收纳盒", html):
            sub = html[m.start() : m.start() + 3000]
            for im_m in re.finditer(
                r"https?://image\.pokemon\.com\.cn/wp-content/uploads/[^\s\"'<>]+",
                sub,
                re.I,
            ):
                u = clean(im_m.group(0))
                try:
                    data = fetch(u)
                except Exception:
                    continue
                if not is_img(data) or len(data) < 200000:
                    continue
                if hashlib.md5(data).hexdigest() == battle_hash:
                    continue
                im = Image.open(io.BytesIO(data))
                print("  damage-counter near", im.size, len(data))
                if im.height > im.width:
                    chosen = data
                    break
            if chosen:
                break

    if chosen:
        write_v2("ylsc-collect-box-v2.png", chosen)
    else:
        print("WARN: collect not found, keep separate from battle if possible")

    # ---- 黑炎霸主：日版宣传主视觉 ----
    write_v2("sv3-box-v2.png", (PROBE / "sv3_hero-visual_jpg.png").read_bytes())

    # ---- 雪危+泥土双包：日版双弹联合宣传图 ----
    write_v2("sv2-double-box-v2.png", (PROBE / "sv2hero.png").read_bytes())

    # ---- 端午：已正确，确保 v2 ----
    if (PUBLIC / "duanwu2026-box.png").exists():
        write_v2("duanwu2026-box-v2.png", (PUBLIC / "duanwu2026-box.png").read_bytes())

    mapping = {
        "/products/csv5c-box.png": "/products/csv5c-box-v2.png",
        "/products/csv7c-box.png": "/products/csv7c-box-v2.png",
        "/products/sv3-box.png": "/products/sv3-box-v2.png",
        "/products/sv2-double-box.png": "/products/sv2-double-box-v2.png",
        "/products/ylsc-battle-box.png": "/products/ylsc-battle-box-v2.png",
        "/products/ylsc-collect-box.png": "/products/ylsc-collect-box-v2.png",
        "/products/duanwu2026-box.png": "/products/duanwu2026-box-v2.png",
    }
    # 强制写路径（即使已是 v2）
    for dbp in DBS:
        if not dbp.exists():
            continue
        db = sqlite3.connect(dbp)
        # 按商品名精确绑定主图
        binds = [
            ("%黑晶炽诚%", "/products/csv5c-box-v2.png"),
            ("%利刃猛醒%", "/products/csv7c-box-v2.png"),
            ("%黑炎霸主%", "/products/sv3-box-v2.png"),
            ("%雪危险%泥土%", "/products/sv2-double-box-v2.png"),
            ("%游历对战%", "/products/ylsc-battle-box-v2.png"),
            ("%游历收藏%", "/products/ylsc-collect-box-v2.png"),
            ("%端午%", "/products/duanwu2026-box-v2.png"),
        ]
        for like, img in binds:
            rows = db.execute(
                "SELECT id, images FROM Product WHERE name LIKE ?", (like,)
            ).fetchall()
            for pid, images in rows:
                parts = [p for p in (images or "").split(",") if p.strip()]
                # 替换第一张主图，保留 topcards
                rest = [p for p in parts if "/topcards/" in p]
                nxt = ",".join([img] + rest)
                if nxt != images:
                    db.execute("UPDATE Product SET images=? WHERE id=?", (nxt, pid))
                    print(f"  bind [{dbp.name}] {like} -> {img}")
        db.commit()
        db.close()

    update_db(mapping)

    print("\n=== verify distinct ===")
    for a, b in [
        ("csv5c-box-v2.png", "csv7c-box-v2.png"),
        ("ylsc-battle-box-v2.png", "ylsc-collect-box-v2.png"),
    ]:
        ha = hashlib.md5((PUBLIC / a).read_bytes()).hexdigest()[:10]
        hb = hashlib.md5((PUBLIC / b).read_bytes()).hexdigest()[:10]
        print(a, ha, "|", b, hb, "|", "SAME!" if ha == hb else "ok different")


if __name__ == "__main__":
    main()
