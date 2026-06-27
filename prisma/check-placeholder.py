import sqlite3
c = sqlite3.connect(r'C:\Users\33092\Documents\card-shop\dev.db').cursor()
c.execute("SELECT name, slug, images FROM Product WHERE images LIKE '%placeholder%' ORDER BY name")
for r in c.fetchall():
    print(r[0], '|', r[1])
