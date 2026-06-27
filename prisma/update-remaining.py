import sqlite3

db = sqlite3.connect(r'C:\Users\33092\Documents\card-shop\dev.db')
c = db.cursor()

updates = [
    # CS4 九彩汇聚
    ('九彩汇聚 朋 BOX（简中）',       '/products/cs4a-box.jpg'),
    ('九彩汇聚 源 BOX（简中）',       '/products/cs4b-box.webp'),
    # CSM1 横空出世
    ('横空出世 赫 BOX（简中）',       '/products/csm1a-box.png'),
    ('横空出世 苍 BOX（简中）',       '/products/csm1b-box.png'),
    ('横空出世 泽 BOX（简中）',       '/products/csm1c-box.png'),
    # SS 强化包
    ('极巨攻防 BOX（简中）',          '/products/cs15-box.png'),
    ('璀璨反击 BOX（简中）',          '/products/cs25-box.png'),
    ('怒炎灼天 BOX（简中）',          '/products/cs35-box.png'),
    ('终末炎舞 BOX（简中）',          '/products/cs45-box.png'),
    ('暗影夺辉 BOX（简中）',          '/products/cs55-box.png'),
    ('胜象星引 BOX（简中）',          '/products/cs65-box.jpg'),
    # SM 强化包
    ('SM 强化包 第一弹 BOX（简中）',  '/products/sm15-box.png'),
    ('SM 强化包 第二弹 BOX（简中）',  '/products/sm25-box.webp'),
]

ok = 0
for name, img in updates:
    c.execute('UPDATE Product SET images=? WHERE name=?', (img, name))
    if c.rowcount:
        ok += 1
        print(f'OK   {name}')
    else:
        print(f'MISS {name}')

db.commit()

c.execute("SELECT COUNT(*) FROM Product WHERE images LIKE '%placeholder%'")
remaining = c.fetchone()[0]
print(f'\n更新 {ok}/{len(updates)}  剩余占位图: {remaining} 件')
db.close()
