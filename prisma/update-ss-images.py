import sqlite3

db = sqlite3.connect(r'C:\Users\33092\Documents\card-shop\dev.db')
c = db.cursor()

updates = [
    # CS2 浓墨重彩 (刚下载)
    ('浓墨重彩 黎 BOX（简中）', '/products/cs2a-box.png'),
    ('浓墨重彩 靛 BOX（简中）', '/products/cs2b-box.png'),
    # CS3 洪荒演武 (之前下载，未入库)
    ('洪荒演武 茂 BOX（简中）', '/products/cs3a-box.jpg'),
    ('洪荒演武 激 BOX（简中）', '/products/cs3b-box.png'),
    # CSM2 交相辉映 (之前下载，未入库)
    ('交相辉映 魁 BOX（简中）', '/products/csm2b-box.png'),
    ('交相辉映 唤 BOX（简中）', '/products/csm2c-box.png'),
    # CS6 碧海暗影 (刚下载)
    ('碧海暗影 BOX（简中）', '/products/cs6a-box.png'),
]

for name, img in updates:
    c.execute('UPDATE Product SET images=? WHERE name=?', (img, name))
    status = 'OK' if c.rowcount else 'NOT FOUND'
    print(f'{status}  {name}')

db.commit()

c.execute("SELECT COUNT(*) FROM Product WHERE images LIKE '%placeholder%'")
print(f'\n剩余占位图: {c.fetchone()[0]} 件')
db.close()
