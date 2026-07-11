"""修复损坏/错误商品封面，并同步到 Obs 图库 Assets/Boxes。"""
from __future__ import annotations

import re
import shutil
import sqlite3
import ssl
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = ROOT / "public" / "products"
OBS_BOXES = Path(r"C:\Users\33092\Documents\Obsidian Vault\KKCARD OS\Assets\Boxes")
KANDA_BOXES = Path(r"C:\Users\33092\Desktop\obsi\KANDA\KKCARD OS\Assets\Boxes")
DB = ROOT / "dev.db"

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

# 官方图（宝可梦简中）
DOWNLOADS = {
    "csv5c-box.png": "https://image.pokemon.com.cn/wp-content/uploads/2025/09/250724_CSV5_650_488.png",
}

# WebP 误命名为 PNG → 改扩展名
RENAME_WEBP = [
    "opc-11-box.png",
    "opc-14-box.png",
    "opc-15-box.png",
    "ebc-03-box.png",
]

# 本地可用替代图（禁止把不同 SKU 互拷，避免串图）
FALLBACK_COPY = {
    "cbb3c-box.png": "cbb2c-box.png",
    "cs4a-box.png": "cs4a-box.jpg",
    "cs4b-box.png": "cs4b-box.webp",
    "cs65-box.png": "cs55-box.png",
}


def is_real_image(path: Path) -> bool:
    if not path.is_file():
        return False
    head = path.read_bytes()[:12]
    if head.startswith(b"<!") or head.startswith(b"<html"):
        return False
    if head[:4] == b"\x89PNG" or head[:2] == b"\xff\xd8" or head[:4] == b"RIFF":
        return True
    return False


def download(url: str, dest: Path) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"下载 {url} → {dest.name}")
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0", "Referer": "https://www.pokemon.cn/"},
    )
    with urllib.request.urlopen(req, timeout=60, context=CTX) as resp:
        data = resp.read()
    if data.startswith(b"<!") or data.startswith(b"<html"):
        print(f"  ⚠ 下载失败（返回 HTML），跳过 {dest.name}")
        return False
    dest.write_bytes(data)
    return True


def publish_to_obs(filename: str) -> None:
    src = PRODUCTS / filename
    if not src.is_file():
        return
    for obs_dir in (OBS_BOXES, KANDA_BOXES):
        obs_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, obs_dir / filename)
        print(f"同步 Obs 图库: {obs_dir / filename}")


def main() -> None:
    OBS_BOXES.mkdir(parents=True, exist_ok=True)
    KANDA_BOXES.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DB)
    cur = db.cursor()

    for filename, url in DOWNLOADS.items():
        dest = PRODUCTS / filename
        ok = download(url, dest)
        if not ok and filename in FALLBACK_COPY:
            src = PRODUCTS / FALLBACK_COPY[filename]
            if src.is_file():
                shutil.copy2(src, dest)
                print(f"  临时替代 {filename} ← {FALLBACK_COPY[filename]}")
        if is_real_image(dest):
            publish_to_obs(filename)
            cur.execute(
                "UPDATE Product SET images=? WHERE images LIKE ? OR name LIKE ?",
                (f"/products/{filename}", f"%{filename}%", "%黑晶%"),
            )

    for bad_name, good_name in FALLBACK_COPY.items():
        src = PRODUCTS / good_name
        dest = PRODUCTS / bad_name
        if src.is_file() and is_real_image(src):
            shutil.copy2(src, dest)
            publish_to_obs(bad_name)
            cur.execute("UPDATE Product SET images=? WHERE images LIKE ?", (f"/products/{bad_name}", f"%{bad_name}%"))
            print(f"替代 {bad_name} ← {good_name}")

    for filename in RENAME_WEBP:
        src = PRODUCTS / filename
        if not src.is_file():
            continue
        head = src.read_bytes()[:12]
        if head[:4] != b"RIFF":
            continue
        new_name = filename.replace(".png", ".webp")
        dest = PRODUCTS / new_name
        shutil.copy2(src, dest)
        publish_to_obs(new_name)
        cur.execute("UPDATE Product SET images=? WHERE images=?", (f"/products/{new_name}", f"/products/{filename}"))
        print(f"WebP 修正: {filename} → {new_name}")

    # 把现有正确封面也备份到 Obs 图库
    for path in sorted(PRODUCTS.glob("*-box.*")):
        if is_real_image(path) and path.stat().st_size > 50000:
            publish_to_obs(path.name)

    db.commit()
    db.close()
    print("完成。")


if __name__ == "__main__":
    main()
