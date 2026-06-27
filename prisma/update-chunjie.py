import sqlite3
db = sqlite3.connect(r"C:\Users\33092\Documents\card-shop\dev.db")
c = db.cursor()
c.execute("UPDATE Product SET images=? WHERE name=?", ("/products/chunjie2026-box.png", "2026 春节礼盒（简中）"))
print(f"春节礼盒: {c.rowcount} 行更新")
db.commit()
db.close()
