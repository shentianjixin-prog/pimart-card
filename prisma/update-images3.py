import sqlite3

db = sqlite3.connect(r"C:\Users\33092\Documents\card-shop\dev.db")
c = db.cursor()

updates = [
    ("游历对战周边礼盒（简中）",                     "/products/ylsc-battle-box.png"),
    ("游历收藏周边礼盒（简中）",                     "/products/ylsc-collect-box.png"),
    ("2026 端午节礼盒（简中）",                     "/products/duanwu2026-box.png"),
    # 151 系列（用收集啦151图片）
    ("ポケモンカード151 BOX（简中）",               "/products/151-box.png"),
    ("151 コレクターズセット（简中）",               "/products/151-box.png"),
]

for name, img in updates:
    c.execute("UPDATE Product SET images=? WHERE name=?", (img, name))
    print(f"{'✅' if c.rowcount else '⬜'} {name}  → {img}")

db.commit()
db.close()
print("\n完成。")
