import sqlite3
c = sqlite3.connect(r'C:\Users\33092\Documents\card-shop\dev.db').cursor()
c.execute("SELECT slug, name, category FROM Product WHERE boxType='' ORDER BY category, name")
for r in c.fetchall():
    print(repr(r[0]), '|', r[1], '|', r[2])
