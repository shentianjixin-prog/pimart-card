# -*- coding: utf-8 -*-
"""
用万代官网官方卡图替换海贼王 topcards（去掉 PSA/实拍）。

图片源：https://en.onepiece-cardgame.com/images/cardlist/card/{ID}.png
选卡依据：各弹盒内可开出的 chase（漫画异画优先）+ SNKRDUNK/公开行情对照。
集换社 API 需登录权限，无法直接拉价；选卡与公开二级市场一致，备注写「行情参考」。
"""
from __future__ import annotations

import json
import re
import sqlite3
import time
import urllib.request
from pathlib import Path

ROOT = Path(r"C:\Users\33092\Documents\card-shop")
TOP = ROOT / "public" / "products" / "topcards"
DB = ROOT / "dev.db"
MANIFEST = ROOT / "scripts" / "opc-topcards-manifest.json"
SPECS = ROOT / "src" / "lib" / "opc-set-specs.ts"

CDN = "https://en.onepiece-cardgame.com/images/cardlist/card/{id}.png"
UA = {"User-Agent": "Mozilla/5.0 (compatible; PIMART-card-bot/1.0)"}

# 每弹最贵/最值得介绍的 5 张（盒内可开；漫画异画优先）
# id 为官网文件名（含 _pN 平行后缀）；titleZh 用于详情顶卡文案
CHASE: dict[str, list[dict]] = {
    "OPC-01": [
        {"id": "OP01-120_p2", "titleZh": "香克斯（漫画异画 SEC）", "note": "本弹旗舰 chase"},
        {"id": "OP01-120_p1", "titleZh": "香克斯（异画 SEC）", "note": "SEC 平行"},
        {"id": "OP01-121_p1", "titleZh": "大和（异画 SEC）", "note": "SEC 平行"},
        {"id": "OP01-078_p1", "titleZh": "波雅·汉库克（SP）", "note": "特别异画"},
        {"id": "OP01-003_p1", "titleZh": "蒙奇·D·路飞（异画）", "note": "人气异画"},
    ],
    "OPC-02": [
        {"id": "OP02-013_p2", "titleZh": "波特卡斯·D·艾斯（漫画异画）", "note": "本弹旗舰 chase"},
        {"id": "OP02-013_p1", "titleZh": "波特卡斯·D·艾斯（异画）", "note": "SR 平行"},
        {"id": "OP02-120_p1", "titleZh": "乌塔（异画 SEC）", "note": "SEC 平行"},
        {"id": "OP02-025_p1", "titleZh": "娜美（异画）", "note": "人气异画"},
        {"id": "OP02-099_p1", "titleZh": "萨卡斯基（异画）", "note": "人气异画"},
    ],
    "OPC-03": [
        {"id": "OP03-122_p2", "titleZh": "狙击王（漫画异画 SEC）", "note": "本弹旗舰 chase"},
        {"id": "OP03-040_p1", "titleZh": "娜美（领袖异画）", "note": "领袖平行"},
        {"id": "OP03-013_p1", "titleZh": "马尔科（异画）", "note": "人气异画"},
        {"id": "OP03-112_p1", "titleZh": "夏洛特·布琳（SP）", "note": "特别异画"},
        {"id": "OP03-001_p1", "titleZh": "波特卡斯·D·艾斯（领袖异画）", "note": "领袖平行"},
    ],
    "OPC-04": [
        {"id": "OP04-083_p2", "titleZh": "萨博（漫画异画）", "note": "本弹旗舰 chase"},
        {"id": "OP04-083_p1", "titleZh": "萨博（异画）", "note": "SR 平行"},
        {"id": "OP04-001_p1", "titleZh": "奈菲鲁塔利·薇薇（领袖异画）", "note": "领袖平行"},
        {"id": "OP04-031_p1", "titleZh": "唐吉诃德·多弗朗明哥（异画）", "note": "人气异画"},
        {"id": "OP04-104_p1", "titleZh": "山治（异画）", "note": "人气异画"},
    ],
    "OPC-05": [
        {"id": "OP05-119_p2", "titleZh": "蒙奇·D·路飞（漫画异画 SEC）", "note": "本弹旗舰 chase"},
        {"id": "OP05-074_p2", "titleZh": "尤斯塔斯·基德（漫画异画）", "note": "漫画异画"},
        {"id": "OP05-069_p2", "titleZh": "特拉法尔加·罗（漫画异画）", "note": "漫画异画"},
        {"id": "OP05-119_p1", "titleZh": "蒙奇·D·路飞（异画 SEC）", "note": "SEC 平行"},
        {"id": "OP05-067_p1", "titleZh": "索隆十郎（SP）", "note": "特别异画"},
    ],
    "OPC-06": [
        {"id": "OP06-118_p2", "titleZh": "罗罗诺亚·索隆（漫画异画 SEC）", "note": "本弹旗舰 chase"},
        {"id": "OP06-118_p1", "titleZh": "罗罗诺亚·索隆（异画 SEC）", "note": "SEC 平行"},
        {"id": "OP06-042_p1", "titleZh": "文斯莫克·贾奇（异画）", "note": "人气异画"},
        {"id": "OP06-007_p1", "titleZh": "香克斯（异画）", "note": "人气异画"},
        {"id": "OP06-035_p1", "titleZh": "乌塔（异画）", "note": "人气异画"},
    ],
    "OPC-07": [
        {"id": "OP07-051_p2", "titleZh": "波雅·汉库克（漫画异画）", "note": "本弹旗舰 chase"},
        {"id": "OP07-051_p1", "titleZh": "波雅·汉库克（异画）", "note": "SR 平行"},
        {"id": "OP07-015_p1", "titleZh": "巴兹尔·霍金斯（异画）", "note": "人气异画"},
        {"id": "OP07-001_p1", "titleZh": "波特卡斯·D·艾斯（领袖异画）", "note": "领袖平行"},
        {"id": "OP07-044_p1", "titleZh": "蒙奇·D·龙（异画）", "note": "人气异画"},
    ],
    "OPC-08": [
        {"id": "OP08-118_p2", "titleZh": "西尔尔克·雷利（漫画异画 SEC）", "note": "本弹旗舰 chase"},
        {"id": "OP08-118_p1", "titleZh": "西尔尔克·雷利（异画 SEC）", "note": "SEC 平行"},
        {"id": "OP08-076_p1", "titleZh": "夏洛特·布琳（异画）", "note": "人气异画"},
        {"id": "OP08-052_p1", "titleZh": "黑玛利亚（异画）", "note": "人气异画"},
        {"id": "OP08-106_p1", "titleZh": "娜美（异画）", "note": "人气异画"},
    ],
    "OPC-09": [
        {"id": "OP09-118_p2", "titleZh": "戈尔·D·罗杰（黄金漫画异画 SEC）", "note": "本弹旗舰 chase"},
        {"id": "OP09-119_p2", "titleZh": "蒙奇·D·路飞（漫画异画 SEC）", "note": "漫画异画"},
        {"id": "OP09-004_p2", "titleZh": "香克斯（漫画异画）", "note": "漫画异画"},
        {"id": "OP09-093_p2", "titleZh": "马歇尔·D·蒂奇（漫画异画）", "note": "漫画异画"},
        {"id": "OP09-051_p2", "titleZh": "巴基（漫画异画）", "note": "漫画异画"},
    ],
    "OPC-10": [
        {"id": "OP10-119_p2", "titleZh": "特拉法尔加·罗（漫画异画 SEC）", "note": "本弹旗舰 chase"},
        {"id": "OP10-119_p1", "titleZh": "特拉法尔加·罗（异画 SEC）", "note": "SEC 平行"},
        {"id": "OP10-118_p1", "titleZh": "神避（异画 SEC）", "note": "SEC 平行"},
        {"id": "OP10-001_p1", "titleZh": "库赞（领袖异画）", "note": "领袖平行"},
        {"id": "OP10-041_p1", "titleZh": "乌索普（异画）", "note": "人气异画"},
    ],
    "OPC-11": [
        {"id": "OP11-118_p2", "titleZh": "蒙奇·D·路飞（漫画异画 SEC）", "note": "本弹旗舰 chase"},
        {"id": "OP11-118_p1", "titleZh": "蒙奇·D·路飞（异画 SEC）", "note": "SEC 平行"},
        {"id": "OP11-040_p1", "titleZh": "娜美（异画）", "note": "人气异画"},
        {"id": "OP11-061_p1", "titleZh": "库赞（异画）", "note": "人气异画"},
        {"id": "OP11-056_p1", "titleZh": "橡胶橡胶果实·火手枪（异画）", "note": "事件异画"},
    ],
    "OPC-14": [
        {"id": "OP14-119_p2", "titleZh": "ジュラキュール·ミホーク（漫画异画 SEC）", "note": "本弹旗舰 chase"},
        {"id": "OP14-119_p1", "titleZh": "鹰眼米霍克（异画 SEC）", "note": "SEC 平行"},
        {"id": "OP14-083_p1", "titleZh": "波雅·汉库克（异画）", "note": "人气异画"},
        {"id": "OP14-076_p1", "titleZh": "波雅·汉库克（异画）", "note": "人气异画"},
        {"id": "OP14-040_p1", "titleZh": "娜美（异画）", "note": "人气异画"},
    ],
    "OPC-15": [
        {"id": "OP15-118_p2", "titleZh": "艾尼路（漫画异画 SEC）", "note": "本弹旗舰 chase"},
        {"id": "OP15-119_p1", "titleZh": "蒙奇·D·路飞（异画 SEC）", "note": "SEC 平行"},
        {"id": "OP15-118_p1", "titleZh": "艾尼路（异画 SEC）", "note": "SEC 平行"},
        {"id": "OP15-001_p1", "titleZh": "蒙奇·D·路飞（领袖异画）", "note": "领袖平行"},
        {"id": "OP15-002_p1", "titleZh": "艾尼路（领袖异画）", "note": "领袖平行"},
    ],
}


def head_ok(card_id: str) -> bool:
    url = CDN.format(id=card_id)
    req = urllib.request.Request(url, method="HEAD", headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return 200 <= resp.status < 300
    except Exception:
        return False


def resolve_id(card_id: str) -> str | None:
    """若指定平行不存在，回退 base / 其他平行。"""
    if head_ok(card_id):
        return card_id
    base = card_id.split("_")[0]
    for cand in [f"{base}_p2", f"{base}_p1", f"{base}_p3", base]:
        if cand != card_id and head_ok(cand):
            print(f"  fallback {card_id} -> {cand}")
            return cand
    return None


def download(card_id: str, dest: Path) -> bool:
    url = CDN.format(id=card_id)
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            data = resp.read()
        dest.write_bytes(data)
        return True
    except Exception as e:
        print(f"  download fail {card_id}: {e}")
        return False


def main() -> None:
    TOP.mkdir(parents=True, exist_ok=True)
    resolved: dict[str, list[dict]] = {}

    for code, cards in CHASE.items():
        print(f"=== {code} ===")
        out_cards = []
        for i, c in enumerate(cards, 1):
            rid = resolve_id(c["id"])
            if not rid:
                print(f"  MISS {c['id']} {c['titleZh']}")
                continue
            # 统一用 png 官方渲染图，覆盖旧 jpeg/webp PSA 图
            fname = f"opc-{code.split('-')[1].lower()}-card-{i}.png"
            dest = TOP / fname
            ok = download(rid, dest)
            print(f"  {i}. {rid} -> {fname} {'OK' if ok else 'FAIL'} | {c['titleZh']}")
            if not ok:
                continue
            # 删掉同序号旧扩展名，避免轮播混用 PSA 图
            stem = f"opc-{code.split('-')[1].lower()}-card-{i}"
            for old in TOP.glob(f"{stem}.*"):
                if old.name != fname:
                    old.unlink(missing_ok=True)
                    print(f"    removed old {old.name}")
            out_cards.append(
                {
                    **c,
                    "id": rid,
                    "local": f"/products/topcards/{fname}",
                }
            )
            time.sleep(0.15)
        resolved[code] = out_cards

    # 写 manifest（按 slug）
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        "SELECT id, slug, series, images FROM Product WHERE slug LIKE 'opc-%' ORDER BY slug"
    ).fetchall()
    manifest = {}
    updated = 0
    for row in rows:
        m = re.match(r"^(OPC-\d+)\b", row["series"] or "", re.I)
        if not m:
            continue
        code = m.group(1).upper()
        tops = [c["local"] for c in resolved.get(code, [])]
        if not tops:
            continue
        parts = [p.strip() for p in (row["images"] or "").split(",") if p.strip()]
        box = next((p for p in parts if "/topcards/" not in p), parts[0] if parts else "")
        if not box:
            continue
        new_images = ",".join([box] + tops)
        manifest[row["slug"]] = {
            "set_id": code,
            "topcards": tops,
            "meta": resolved[code],
        }
        if new_images != (row["images"] or "").strip():
            conn.execute(
                "UPDATE Product SET images=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?",
                (new_images, row["id"]),
            )
            updated += 1
            print("DB", row["slug"])
    conn.commit()
    conn.close()
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"manifest entries={len(manifest)} db_updated={updated}")

    # 更新 opc-set-specs.ts 的 topCards 文案与路径
    patch_specs(resolved)


def patch_specs(resolved: dict[str, list[dict]]) -> None:
    text = SPECS.read_text(encoding="utf-8")
    for code, cards in resolved.items():
        if code in ("OPC-15",) and not cards:
            continue
        if not cards:
            continue
        block_lines = ["    topCards: ["]
        for c in cards:
            title = c["titleZh"].replace("\\", "\\\\").replace('"', '\\"')
            note = c.get("note", "行情参考").replace("\\", "\\\\").replace('"', '\\"')
            block_lines.append("      {")
            block_lines.append(f'        images: ["{c["local"]}"],')
            block_lines.append(f'        title: "{title}",')
            block_lines.append(f'        remark: "官网渲染图 · {note}",')
            block_lines.append("      },")
        block_lines.append("    ],")
        new_block = "\n".join(block_lines)

        # 替换该系列已有 topCards 块
        pat = re.compile(
            rf'("{re.escape(code)}":\s*\{{.*?)(    topCards:\s*\[[\s\S]*?\],)',
            re.S,
        )
        m = pat.search(text)
        if not m:
            print("specs skip (no topCards block):", code)
            continue
        text = text[: m.start(2)] + new_block + text[m.end(2) :]
        print("specs patched", code)
    SPECS.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    main()
