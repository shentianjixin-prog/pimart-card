import sqlite3

db = sqlite3.connect(r"C:\Users\33092\Documents\card-shop\dev.db")
c = db.cursor()

updates = [
    # 新下载的 csv 系列
    ("朱・紫ex 強化拡張パック BOX（简中）", "/products/csv1c-box.png"),
    ("奇迹启程 BOX（简中）",               "/products/csv2c-box.png"),
    ("无畏太晶 BOX（简中）",               "/products/csv3c-box.png"),
    ("嘉奖回合 BOX（简中）",               "/products/csv4c-box.png"),
    # CS5 分两个子包
    ("勇魅群星 魅 BOX（简中）",            "/products/cs5-box.png"),
    ("勇魅群星 勇 BOX（简中）",            "/products/cs5b-box.png"),
]

for name, img in updates:
    c.execute("UPDATE Product SET images=? WHERE name=?", (img, name))
    print(f"{'✅' if c.rowcount else '⬜'} {name}  → {img}")

db.commit()
db.close()
print("\n完成。")
