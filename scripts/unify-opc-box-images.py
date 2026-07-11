# -*- coding: utf-8 -*-
"""
统一海贼王原盒主图：去杂乱背景 / 去掉第三方水印角标，铺白底。
"""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "products"

# 需要处理的文件 → 目标保存名（保持 DB 路径可用）
TARGETS = {
    "opc-01-box.jpg": "opc-01-box.jpg",
    "opc-02-box.jpg": "opc-02-box.jpg",
    "opc-07-box.webp": "opc-07-box.webp",
    "opc-10-box.jpg": "opc-10-box.jpg",
    "opc-15-box.png": "opc-15-box.png",
    "opc-15-box.webp": "opc-15-box.webp",
}

# 角标区域（相对坐标 0~1）：盖住第三方 AUTHENTIC / BBB 等
BADGE_MASKS = {
    "opc-15-box.png": [
        (0.0, 0.0, 0.22, 0.18),  # 左上 AUTHENTIC
        (0.72, 0.0, 1.0, 0.16),  # 右上 BBB
    ],
    "opc-15-box.webp": [
        (0.0, 0.0, 0.22, 0.18),
        (0.72, 0.0, 1.0, 0.16),
    ],
}


def to_white_square(rgba: Image.Image, size: int = 1200) -> Image.Image:
    """把透明主体居中放到白底方图。"""
    rgba = rgba.convert("RGBA")
    # 裁切透明边
    bbox = rgba.getbbox()
    if bbox:
        rgba = rgba.crop(bbox)
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    # 留一点边距
    max_side = int(size * 0.9)
    w, h = rgba.size
    scale = min(max_side / w, max_side / h)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    resized = rgba.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (size - nw) // 2
    y = (size - nh) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas


def scrub_badges(im: Image.Image, masks: list[tuple[float, float, float, float]]) -> Image.Image:
    """用近邻背景色粗涂角标区域，便于 rembg 忽略。"""
    rgb = im.convert("RGB")
    draw = ImageDraw.Draw(rgb)
    w, h = rgb.size
    for x0, y0, x1, y1 in masks:
        box = (int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h))
        # 取右下角附近像素作为填充色（暗底）
        sample = rgb.getpixel((min(w - 2, box[2] + 2) if box[2] < w - 5 else w // 2, min(h - 2, box[3] + 2)))
        # 对暗底图用深灰更自然
        draw.rectangle(box, fill=sample if sum(sample) < 400 else (30, 30, 30))
    return rgb


def process_one(src_name: str, dest_name: str) -> None:
    src = PUBLIC / src_name
    if not src.exists():
        print("missing", src_name)
        return
    im = Image.open(src).convert("RGBA")
    if src_name in BADGE_MASKS:
        im = scrub_badges(im, BADGE_MASKS[src_name]).convert("RGBA")

    buf = BytesIO()
    im.save(buf, format="PNG")
    out = remove(buf.getvalue())
    cut = Image.open(BytesIO(out)).convert("RGBA")
    final = to_white_square(cut, size=1200)

    dest = PUBLIC / dest_name
    ext = dest.suffix.lower()
    if ext in (".jpg", ".jpeg"):
        final.save(dest, format="JPEG", quality=92, optimize=True)
    elif ext == ".webp":
        final.save(dest, format="WEBP", quality=90, method=6)
    else:
        # png 实际很多是 webp 伪装；统一存真 PNG
        final.save(dest, format="PNG", optimize=True)
    print("OK", dest_name, final.size, dest.stat().st_size)


def main() -> None:
    for src, dest in TARGETS.items():
        process_one(src, dest)
    # 同步 png/webp 副本（DB 可能指向其一）
    for a, b in [("opc-11-box.png", "opc-11-box.webp"), ("opc-14-box.png", "opc-14-box.webp")]:
        pa, pb = PUBLIC / a, PUBLIC / b
        if pa.exists() and pb.exists():
            # 已是干净白底的可跳过；若尺寸差异大可再处理
            pass


if __name__ == "__main__":
    main()
