# -*- coding: utf-8 -*-
"""
为简中宝可梦原盒商品补充「每盒最贵 5 张卡」图片。

数据源：https://pikaqian.com/sets/{set_id}（页面已按 raw 价格降序）
图片写入：public/products/topcards/{set_id}-{n}.webp
数据库：把 Product.images 更新为「盒图 + 5 张 chase」逗号分隔
"""
from __future__ import annotations

import json
import re
import sqlite3
import time
import urllib.request
from pathlib import Path

ROOT = Path(r"C:\Users\33092\Documents\card-shop")
DB = ROOT / "dev.db"
OUT_DIR = ROOT / "public" / "products" / "topcards"
OUT_DIR.mkdir(parents=True, exist_ok=True)

UA = {"User-Agent": "Mozilla/5.0 (compatible; PIMART-card-bot/1.0)"}
CARD_RE = re.compile(
    r'<img[^>]+alt="([^"]+)"[^>]+src="(https://images\.pikaqian\.com/(?!sets/)[^"]+)"[^>]*>'
    r'.*?<p class="font-mono[^"]*">([a-z0-9.]+)<!-- --> · <!-- -->([^<]+)</p>',
    re.I | re.S,
)

# slug → PikaQian set_id（仅可开包的系列盒）
SLUG_TO_SET: dict[str, str] = {
    # 朱紫主系列
    "朱-紫ex-強化拡張パック-box-简中": "csv1c",
    "奇迹启程-box-简中": "csv2c",
    "无畏太晶-box-简中": "csv3c",
    "嘉奖回合-box-简中": "csv4c",
    "黑晶炽焰-box-简中": "csv5c",
    "真实玄虚-box-简中": "csv6c",
    "剑刃觉醒-box-简中": "csv7c",
    "璀璨诡幻-box-简中": "csv8c",
    "星彩晶璃-box-简中": "csv9c",
    "共逐荣光-box-简中": "csv10c",  # 可能尚未上架行情
    # 宝石包
    "宝石包第一弹-box-简中": "cbb1c",
    "宝石包第二弹-box-简中": "cbb2c",
    "宝石包第三弹-box-简中": "cbb3c",
    "宝石包第四弹-box-简中": "cbb4c",
    "宝石包第五弹-box-简中": "cbb5c",
    # 剑盾
    "极巨争锋-雷-box-简中": "cs1ac",
    "极巨争锋-焰-box-简中": "cs1bc",
    "极巨攻防-box-简中": "cs1.5c",
    "浓墨重彩-黎-box-简中": "cs2ac",
    "浓墨重彩-靛-box-简中": "cs2bc",
    "璀璨反击-box-简中": "cs2.5c",
    "洪荒演武-茂-box-简中": "cs3ac",
    "洪荒演武-激-box-简中": "cs3bc",
    "怒炎灼天-box-简中": "cs3.5c",
    "九彩汇聚-朋-box-简中": "cs4ac",
    "九彩汇聚-源-box-简中": "cs4bc",
    "终末炎舞-box-简中": "cs4.5c",
    "勇魅群星-魅-box-简中": "cs5ac",
    "勇魅群星-勇-box-简中": "cs5bc",
    "暗影夺辉-box-简中": "cs5.5c",
    "碧海暗影-box-简中": "cs6ac",
    "胜象星引-box-简中": "cs6.5c",
    # 日月
    "横空出世-赫-box-简中": "csm1ac",
    "横空出世-苍-box-简中": "csm1bc",
    "横空出世-泽-box-简中": "csm1cc",
    "sm-强化包-第一弹-box-简中": "csm1.5c",
    "交相辉映-沐-box-简中": "csm2ac",
    "交相辉映-魁-box-简中": "csm2bc",
    "交相辉映-唤-box-简中": "csm2cc",
    "sm-强化包-第二弹-box-简中": "csm2.5c",
    # 151 / 黑炎等
    "ポケモンカ-ド151-box-简中": "151c",
    "151-コレクタ-ズセット-简中": "151c",
    "朱-紫-黒炎の支配者-box-简中": "csv3c",  # 黑炎霸主对应无畏太晶同世代，优先用 csv3c chase
}


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=45) as resp:
        return resp.read().decode("utf-8", "replace")


def download(url: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 1000:
        return True
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=45) as resp:
            data = resp.read()
        dest.write_bytes(data)
        return True
    except Exception as e:
        print(f"  download fail {url}: {e}")
        return False


def top5_for_set(set_id: str) -> list[dict]:
    url = f"https://pikaqian.com/sets/{set_id}"
    try:
        html = fetch(url)
    except Exception as e:
        print(f"  fetch fail {set_id}: {e}")
        return []
    cards = CARD_RE.findall(html)
    out = []
    seen = set()
    for name, img, sid, num in cards:
        key = (sid.lower(), num)
        if key in seen:
            continue
        seen.add(key)
        out.append(
            {
                "name": name,
                "image_url": img,
                "set_id": sid.lower(),
                "number": num,
            }
        )
        if len(out) >= 5:
            break
    return out


def main() -> None:
    set_ids = sorted({s for s in SLUG_TO_SET.values()})
    set_cards: dict[str, list[dict]] = {}
    for sid in set_ids:
        print(f"[{sid}] fetching top5…")
        cards = top5_for_set(sid)
        set_cards[sid] = cards
        print(f"  got {len(cards)}")
        for i, c in enumerate(cards, 1):
            dest = OUT_DIR / f"{sid}-{i}.webp"
            ok = download(c["image_url"], dest)
            print(f"  {i}. #{c['number']} {c['name']} -> {dest.name} {'OK' if ok else 'FAIL'}")
            c["local"] = f"/products/topcards/{sid}-{i}.webp"
        time.sleep(0.4)

    # 写出清单，供 sync-product-images.mjs 使用
    manifest = {}
    for slug, sid in SLUG_TO_SET.items():
        cards = set_cards.get(sid) or []
        locals_ = [c["local"] for c in cards if c.get("local")]
        if locals_:
            manifest[slug] = {"set_id": sid, "topcards": locals_, "meta": cards}

    manifest_path = ROOT / "scripts" / "pokemon-topcards-manifest.json"
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print("manifest ->", manifest_path)

    if not DB.exists():
        print("dev.db 不存在，跳过数据库更新")
        return

    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    updated = 0
    for slug, info in manifest.items():
        row = cur.execute(
            "SELECT id, images FROM Product WHERE slug = ?", (slug,)
        ).fetchone()
        if not row:
            print(f"  skip missing product: {slug}")
            continue
        current = (row["images"] or "").strip()
        box = current.split(",")[0].strip() if current else ""
        if not box or box.endswith("placeholder.svg"):
            print(f"  skip no box image: {slug}")
            continue
        # 去掉旧 topcards，保留盒图
        parts = [p.strip() for p in current.split(",") if p.strip()]
        box = next((p for p in parts if "/topcards/" not in p), parts[0])
        new_images = ",".join([box] + info["topcards"])
        if new_images == current:
            print(f"  unchanged: {slug}")
            continue
        cur.execute(
            "UPDATE Product SET images = ?, updatedAt = CURRENT_TIMESTAMP WHERE slug = ?",
            (new_images, slug),
        )
        updated += 1
        print(f"  updated: {slug} -> {new_images}")
    conn.commit()
    conn.close()
    print(f"done. updated {updated} products")


if __name__ == "__main__":
    main()
