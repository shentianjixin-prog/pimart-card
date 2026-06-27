import sqlite3

db = sqlite3.connect(r'C:\Users\33092\Documents\card-shop\dev.db')
c = db.cursor()

fixes = [
    # SV 肥盒（slug 因为历史原因保留旧名）
    ('肥盒', '黑晶炽焰-box-简中'),   # 黑晶炽诚
    ('肥盒', '剑刃觉醒-box-简中'),   # 利刃猛醒
    # 礼盒
    ('礼盒', '151-コレクタ-ズセット-简中'),
    ('礼盒', 'ポケモンカ-ド151-box-简中'),
    ('礼盒', 'スノ-ハザ-ド-クレイバ-スト-ダブルパック-简中'),
    ('礼盒', '朱-紫-黒炎の支配者-box-简中'),
    # 火影忍者
    ('其他', 'narutop99-ウエハ-ス第1弾-box'),
    ('其他', '火影忍者-コレクタブルカ-ド-スタ-タ-セット'),
    ('其他', '火影忍者-疾風伝-カ-ドウエハ-ス-box'),
]

for bt, slug in fixes:
    c.execute('UPDATE Product SET boxType=? WHERE slug=?', (bt, slug))
    print(f'{"OK" if c.rowcount else "MISS"}  {bt}  {slug}')

db.commit()

c.execute("SELECT boxType, COUNT(*) FROM Product GROUP BY boxType")
print('\n最终汇总:')
for r in c.fetchall():
    print(f'  {r[0] or "(空)"}: {r[1]}件')

db.close()
