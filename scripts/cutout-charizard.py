"""抠出喷火龙主体，去掉壁纸天空与水印区域。"""
from pathlib import Path

from PIL import Image
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public/images/hero-psa-charizard-src.png"
OUT = ROOT / "public/images/hero-psa-charizard-cutout.png"

def main() -> None:
    img = Image.open(SRC).convert("RGBA")
    w, h = img.size

    # 裁掉手机状态栏、底部水印与右侧滚动条区域
    left = int(w * 0.02)
    top = int(h * 0.055)
    right = int(w * 0.97)
    bottom = int(h * 0.82)
    cropped = img.crop((left, top, right, bottom))

    cutout = remove(cropped)
    # 自动裁切透明边距，保留火焰拖尾
    bbox = cutout.getbbox()
    if bbox:
        cutout = cutout.crop(bbox)

    w, h = cutout.size
    cutout = cutout.resize((w * 2, h * 2), Image.Resampling.LANCZOS)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    cutout.save(OUT, optimize=True)
    print(f"Saved {OUT} ({cutout.size[0]}x{cutout.size[1]})")

if __name__ == "__main__":
    main()
