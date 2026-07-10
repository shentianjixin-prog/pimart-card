"""B2B 英雄图：干净横向裁切，不做中央白块（清晰度由 CSS 模糊→清晰蒙版控制）。"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
BACKUP = ROOT / "public" / "images" / "hero-b2b-lugia-original.png"
OUT = ROOT / "public" / "images" / "hero-b2b-lugia.png"


def main() -> None:
    src = Image.open(BACKUP if BACKUP.exists() else OUT).convert("RGB")
    if not BACKUP.exists():
        src.save(BACKUP)
        src = Image.open(BACKUP).convert("RGB")

    w, h = 2400, 1080
    target_ratio = w / h
    sw, sh = src.size
    src_ratio = sw / sh

    if src_ratio > target_ratio:
        new_w = int(sh * target_ratio)
        left = (sw - new_w) // 2
        crop = src.crop((left, 0, left + new_w, sh))
    else:
        new_h = int(sw / target_ratio)
        top = max(0, int((sh - new_h) * 0.3))
        crop = src.crop((0, top, sw, top + new_h))

    art = crop.resize((w, h), Image.Resampling.LANCZOS)
    art = ImageEnhance.Color(art).enhance(1.04)
    art = ImageEnhance.Contrast(art).enhance(1.03)
    art.save(OUT, "PNG", optimize=True)
    print(f"saved {OUT} {art.size}")


if __name__ == "__main__":
    main()
