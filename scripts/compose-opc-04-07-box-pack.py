# -*- coding: utf-8 -*-
"""
OPC-04~07：简中散包官图 → rembg 去底 → 白底「原盒+散包」合成（对齐 OPC-08），
写入 *-v2.jpg 破缓存。
"""
from __future__ import annotations

import io
import shutil
import sqlite3
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "products"
DBS = [ROOT / "dev.db", ROOT / "prisma" / "data" / "initial.db"]

SOURCES = {
    "opc-04": "https://source.windoent.com/OnePiecePc/Picture/1700450747672OPC04.png",
    "opc-05": "https://source.windoent.com/OnePiecePc/Picture/1700794268002opc05%E5%AE%98%E7%BD%91%E5%9B%BE.png",
    "opc-06": "https://source.windoent.com/OnePiecePc/Picture/1706520998821opc06%E5%B0%8F%E5%9B%BE.png",
    "opc-07": "https://source.windoent.com/OnePiecePc/Picture/1713836800869%E5%B0%8F%E5%9B%BE%E7%94%A8.png",
}

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
SIZE = 1200


def download_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=45) as resp:
        data = resp.read()
    if len(data) < 3000 or data[:1] == b"<":
        raise RuntimeError(f"bad image {url}")
    return data


def cutout_pack(data: bytes) -> Image.Image:
    """rembg 去灰/白底，裁到主体。"""
    out = remove(data)
    im = Image.open(io.BytesIO(out)).convert("RGBA")
    # 清理半透明灰边
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    a = arr[:, :, 3]
    near_bg = (rgb.min(axis=2) > 200) & (rgb.max(axis=2) - rgb.min(axis=2) < 25)
    a = np.where(near_bg & (a < 250), 0, a)
    arr[:, :, 3] = a
    im = Image.fromarray(arr, "RGBA")
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    return im


def find_coeffs(dest_pts, src_pts):
    matrix = []
    for d, s in zip(dest_pts, src_pts):
        matrix.append([d[0], d[1], 1, 0, 0, 0, -s[0] * d[0], -s[0] * d[1]])
        matrix.append([0, 0, 0, d[0], d[1], 1, -s[1] * d[0], -s[1] * d[1]])
    A = np.array(matrix, dtype=float)
    B = np.array([c for p in src_pts for c in p], dtype=float)
    return np.linalg.solve(A, B).reshape(8).tolist()


def perspective_paste(canvas: Image.Image, src: Image.Image, quad) -> None:
    w, h = src.size
    coeffs = find_coeffs(list(quad), [(0, 0), (w, 0), (w, h), (0, h)])
    warped = src.transform(
        (SIZE, SIZE),
        Image.Transform.PERSPECTIVE,
        coeffs,
        Image.Resampling.BICUBIC,
        fillcolor=(0, 0, 0, 0),
    )
    canvas.alpha_composite(warped)


def soft_shadow(size, xyxy, radius=18, blur=12, alpha=70) -> Image.Image:
    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(shadow)
    d.rounded_rectangle(xyxy, radius=radius, fill=(0, 0, 0, alpha))
    return shadow.filter(ImageFilter.GaussianBlur(blur))


def compose(pack: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (SIZE, SIZE), (255, 255, 255, 255))

    pack_h = int(SIZE * 0.72)
    scale = pack_h / pack.height
    pack_w = max(1, int(pack.width * scale))
    pack_r = pack.resize((pack_w, pack_h), Image.Resampling.LANCZOS)

    front_h = int(SIZE * 0.62)
    front_w = int(front_h * 0.72)
    front = pack.resize((front_w, front_h), Image.Resampling.LANCZOS)

    pack_x = int(SIZE * 0.52)
    pack_y = int((SIZE - pack_h) / 2) + 20
    box_left = int(SIZE * 0.10)
    box_top = int(SIZE * 0.22)
    depth = int(front_w * 0.18)

    tl = (box_left, box_top + 18)
    tr = (box_left + front_w, box_top)
    br = (box_left + front_w, box_top + front_h)
    bl = (box_left, box_top + front_h + 18)

    edge = front.crop((max(0, front_w - 6), 0, front_w, front_h)).resize((depth, front_h))
    edge = ImageEnhance.Brightness(edge).enhance(0.55)
    edge = ImageEnhance.Color(edge).enhance(0.85)
    side_quad = [tr, (tr[0] + depth, tr[1] + 10), (br[0] + depth, br[1] + 10), br]

    top_h = max(10, int(depth * 0.7))
    top_src = front.crop((0, 0, front_w, min(8, front_h))).resize((front_w, top_h))
    top_src = ImageEnhance.Brightness(top_src).enhance(0.75)
    top_quad = [
        (tl[0] + 8, tl[1] - top_h),
        (tr[0] + depth - 4, tr[1] - top_h + 8),
        tr,
        tl,
    ]

    canvas = Image.alpha_composite(
        canvas,
        soft_shadow(
            (SIZE, SIZE),
            [
                box_left - 10,
                box_top + front_h - 10,
                box_left + front_w + depth + 20,
                box_top + front_h + 55,
            ],
            radius=30,
            blur=18,
            alpha=55,
        ),
    )
    canvas = Image.alpha_composite(
        canvas,
        soft_shadow(
            (SIZE, SIZE),
            [pack_x - 8, pack_y + pack_h - 20, pack_x + pack_w + 8, pack_y + pack_h + 35],
            radius=20,
            blur=14,
            alpha=50,
        ),
    )

    perspective_paste(canvas, top_src, top_quad)
    perspective_paste(canvas, edge, side_quad)
    perspective_paste(canvas, front, [tl, tr, br, bl])

    pack_layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    pack_layer.paste(pack_r, (pack_x, pack_y), pack_r)
    canvas = Image.alpha_composite(canvas, pack_layer)
    return canvas.convert("RGB")


def update_dbs(path_map: dict[str, str]) -> None:
    for dbp in DBS:
        if not dbp.exists():
            continue
        db = sqlite3.connect(dbp)
        n = 0
        rows = db.execute(
            "SELECT id, slug, images FROM Product WHERE slug LIKE 'opc-04%' OR slug LIKE 'opc-05%' OR slug LIKE 'opc-06%' OR slug LIKE 'opc-07%'"
        ).fetchall()
        for pid, slug, images in rows:
            parts = [p.strip() for p in (images or "").split(",") if p.strip()]
            if not parts:
                continue
            for key, new_path in path_map.items():
                if key in slug:
                    parts[0] = new_path
                    break
            nxt = ",".join(parts)
            if nxt != images:
                db.execute("UPDATE Product SET images=? WHERE id=?", (nxt, pid))
                n += 1
        db.commit()
        db.close()
        print(f"[{dbp.name}] updated={n}")


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    path_map: dict[str, str] = {}
    for key, url in SOURCES.items():
        print(f"=== {key} ===")
        raw = download_bytes(url)
        pack = cutout_pack(raw)
        print(f"  cutout {pack.size}")
        final = compose(pack)
        v2 = f"{key}-box-v2.jpg"
        legacy = f"{key}-box.jpg"
        dest = PUBLIC / v2
        final.save(dest, format="JPEG", quality=92, optimize=True)
        shutil.copy2(dest, PUBLIC / legacy)
        print(f"  OK {v2} {dest.stat().st_size}b")
        path_map[key] = f"/products/{v2}"
        if key == "opc-07":
            for alias in ["opc-07-box.webp", "opc-07-box-v2.webp"]:
                final.save(PUBLIC / alias, format="WEBP", quality=90)

    update_dbs(path_map)
    print("done")


if __name__ == "__main__":
    main()
