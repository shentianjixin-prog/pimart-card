import sqlite3

db = sqlite3.connect(r"C:\Users\33092\Documents\card-shop\dev.db")
c = db.cursor()
c.execute(
    "SELECT id, name, slug, images FROM Product WHERE name LIKE ? OR slug LIKE ?",
    ("%黑晶%", "%黑晶%"),
)
for row in c.fetchall():
    print(row)
db.close()
