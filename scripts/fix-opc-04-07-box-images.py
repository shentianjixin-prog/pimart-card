# -*- coding: utf-8 -*-
"""用中国官网简中包装图替换 OPC-04~07 错误的英文宣传横幅。"""
from __future__ import annotations

import shutil
import sqlite3
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "products"
DB = ROOT / "dev.db"
OBS_DIRS = [
    Path(r"C:\Users\33092\Documents\Obsidian Vault\KKCARD OS\Assets\Boxes"),
    Path(r"C:\Users\33092\Desktop\obsi\KANDA\KKCARD OS\Assets\Boxes"),
]

# 中国官网 productList 图（简中散包包装，白底）
SOURCES = {
    "opc-04-box.jpg": "https://source.windoent.com/OnePiecePc/Picture/1700450747672OPC04.png",
    "opc-05-box.jpg": "https://source.windoent.com/OnePiecePc/Picture/1700794268002opc05%E5%AE%98%E7%BD%91%E5%9B%BE.png",
    "opc-06-box.jpg": "https://source.windoent.com/OnePiecePc/Picture/1706520998821opc06%E5%B0%8F%E5%9B%BE.png",
    "opc-07-box.jpg": "https://source.windoent.com/OnePiecePc/Picture/1713836800869%E5%B0%8F%E5%9B%BE%E7%94%A8.png",
}

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}


def download(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=45) as resp:
        data = resp.read()
    if len(data) < 3000 or data[:1] == b"<":
        raise RuntimeError(f"bad image {url} ({len(data)}b)")
    return data


def to_white_square(im: Image.Image, size: int = 1200) -> Image.Image:
    im = im.convert("RGBA")
    # 若有透明边裁掉
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    max_side = int(size * 0.88)
    w, h = im.size
    scale = min(max_side / w, max_side / h)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (size - nw) // 2
    y = (size - nh) // 2
    if resized.mode == "RGBA":
        canvas.paste(resized, (x, y), resized)
    else:
        canvas.paste(resized.convert("RGB"), (x, y))
    return canvas


def publish_obs(path: Path) -> None:
    for d in OBS_DIRS:
        d.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, d / path.name)


def update_db() -> None:
    if not DB.exists():
        return
    conn = sqlite3.connect(DB)
    # opc-07 从 webp 切到 jpg
    rows = conn.execute(
        "SELECT id, slug, images FROM Product WHERE slug LIKE 'opc-04%' OR slug LIKE 'opc-05%' OR slug LIKE 'opc-06%' OR slug LIKE 'opc-07%'"
    ).fetchall()
    for pid, slug, images in rows:
        parts = [p.strip() for p in (images or "").split(",") if p.strip()]
        if not parts:
            continue
        first = parts[0]
        if "opc-04" in slug:
            parts[0] = "/products/opc-04-box.jpg"
        elif "opc-05" in slug:
            parts[0] = "/products/opc-05-box.jpg"
        elif "opc-06" in slug:
            parts[0] = "/products/opc-06-box.jpg"
        elif "opc-07" in slug:
            parts[0] = "/products/opc-07-box.jpg"
        new_images = ",".join(parts)
        if new_images != images:
            conn.execute("UPDATE Product SET images=? WHERE id=?", (new_images, pid))
            print("DB", slug, first, "->", parts[0])
    conn.commit()
    conn.close()


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    for dest_name, url in SOURCES.items():
        print("fetch", dest_name)
        data = download(url)
        tmp = PUBLIC / f"_tmp_{dest_name}.png"
        tmp.write_bytes(data)
        im = Image.open(tmp)
        final = to_white_square(im, 1200)
        dest = PUBLIC / dest_name
        final.save(dest, format="JPEG", quality=92, optimize=True)
        tmp.unlink(missing_ok=True)
        publish_obs(dest)
        print("OK", dest_name, final.size, dest.stat().st_size)

    # 兼容旧路径：opc-07-box.webp / v2 也指向新图内容
    src = PUBLIC / "opc-07-box.jpg"
    for alias in ["opc-07-box.webp", "opc-07-box-v2.webp"]:
        shutil.copy2(src, PUBLIC / alias)
        publish_obs(PUBLIC / alias)
        print("alias", alias)

    update_db()
    print("done")


if __name__ == "__main__":
    main()
