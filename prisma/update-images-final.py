import sqlite3

db = sqlite3.connect(r"C:\Users\33092\Documents\card-shop\dev.db")
c = db.cursor()

updates = [
    ("スノーハザード+クレイバースト ダブルパック（简中）", "/products/sv2-double-box.png"),
    ("朱・紫 黒炎の支配者 BOX（简中）",                  "/products/sv3-box.png"),
]

for name, img in updates:
    c.execute("UPDATE Product SET images=? WHERE name=?", (img, name))
    print(f"{'✅' if c.rowcount else '⬜'} {name}  → {img}")

db.commit()

# 最终汇总
c.execute("SELECT COUNT(*) FROM Product WHERE category='宝可梦原盒' AND images NOT LIKE '%placeholder%'")
has_img = c.fetchone()[0]
c.execute("SELECT COUNT(*) FROM Product WHERE category='宝可梦原盒' AND images LIKE '%placeholder%'")
no_img = c.fetchone()[0]
print(f"\n宝可梦原盒：已有图片 {has_img} 件 / 仍是占位 {no_img} 件")

db.close()
