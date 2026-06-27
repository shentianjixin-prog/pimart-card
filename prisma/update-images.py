import sqlite3

db = sqlite3.connect(r"C:\Users\33092\Documents\card-shop\dev.db")
c = db.cursor()

# ── 1. 先修正两个错误产品名 ──────────────────────────────────────
name_fixes = [
    ("黑晶炽诚 BOX（简中）", "黑晶炽焰 BOX（简中）"),
    ("利刃猛醒 BOX（简中）", "剑刃觉醒 BOX（简中）"),
]
for new_name, old_name in name_fixes:
    c.execute("UPDATE Product SET name=? WHERE name=?", (new_name, old_name))
    print(f"{'✅' if c.rowcount else '⬜'} 名称修正：{old_name} → {new_name}  ({c.rowcount} 行)")

# ── 2. 图片更新映射（name片段 → 本地路径）────────────────────────
image_map = [
    # 精确名称 → 本地图片
    ("星彩晶璃 BOX（简中）",        "/products/csv9c-box.png"),
    ("宝石包第五弹 BOX（简中）",     "/products/cbb5c-box.png"),
    ("璀璨诡幻 BOX（简中）",         "/products/csv8c-box.png"),
    ("宝石包第四弹 BOX（简中）",     "/products/cbb4c-box.png"),
    ("利刃猛醒 BOX（简中）",         "/products/csv7c-box.png"),
    ("真实玄虚 BOX（简中）",         "/products/csv6c-box.png"),
    ("宝石包第三弹 BOX（简中）",     "/products/cbb3c-box.png"),
    ("黑晶炽诚 BOX（简中）",         "/products/csv5c-box.png"),
    ("宝石包第一弹 BOX（简中）",     "/products/cbb1c-box.png"),
    ("宝石包第二弹 BOX（简中）",     "/products/cbb2c-box.png"),
    # CS5 勇魅群星 两款共用一张封面图
    ("勇魅群星 魅 BOX（简中）",      "/products/cs5-box.png"),
    ("勇魅群星 勇 BOX（简中）",      "/products/cs5-box.png"),
]

for name, img in image_map:
    c.execute(
        "UPDATE Product SET images=? WHERE name=? AND (images='' OR images='/products/placeholder.svg' OR images LIKE '%placeholder%')",
        (img, name)
    )
    print(f"{'✅' if c.rowcount else '⬜'} {name}  → {img}  ({c.rowcount} 行)")

db.commit()
db.close()
print("\n全部完成。")
