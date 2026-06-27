import sqlite3

db = sqlite3.connect(r'C:\Users\33092\Documents\card-shop\dev.db')
c = db.cursor()

# 肥盒 = 补充包系列（SM主包25张/包, SS主包5张×30包, SV主包5张×30包）
fat_slugs = [
    # SM 横空出世
    '横空出世-赫-box-简中', '横空出世-苍-box-简中', '横空出世-泽-box-简中',
    # SM 交相辉映
    '交相辉映-沐-box-简中', '交相辉映-魁-box-简中', '交相辉映-唤-box-简中',
    # SS 极巨争锋
    '极巨争锋-雷-box-简中', '极巨争锋-焰-box-简中',
    # SS 浓墨重彩
    '浓墨重彩-黎-box-简中', '浓墨重彩-靛-box-简中',
    # SS 洪荒演武
    '洪荒演武-茂-box-简中', '洪荒演武-激-box-简中',
    # SS 九彩汇聚
    '九彩汇聚-朋-box-简中', '九彩汇聚-源-box-简中',
    # SS 勇魅群星
    '勇魅群星-魅-box-简中', '勇魅群星-勇-box-简中',
    # SS 碧海暗影
    '碧海暗影-box-简中',
    # SV 系列 (csv1c-csv9c)
    '朱-紫ex-強化拡張パック-box-简中', '奇迹启程-box-简中', '无畏太晶-box-简中',
    '嘉奖回合-box-简中', '黑晶炽诚-box-简中', '真实玄虚-box-简中',
    '利刃猛醒-box-简中', '璀璨诡幻-box-简中', '星彩晶璃-box-简中',
]

# 瘦盒 = 强化包系列（6张×20包）
slim_slugs = [
    # SM 强化包
    'sm-强化包-第一弹-box-简中', 'sm-强化包-第二弹-box-简中',
    # SS 强化包
    '极巨攻防-box-简中', '璀璨反击-box-简中', '怒炎灼天-box-简中',
    '终末炎舞-box-简中', '暗影夺辉-box-简中', '胜象星引-box-简中',
]

# 宝石包 = CBB系列（4张全闪×15包）
gem_slugs = [
    '宝石包第一弹-box-简中', '宝石包第二弹-box-简中', '宝石包第三弹-box-简中',
    '宝石包第四弹-box-简中', '宝石包第五弹-box-简中',
]

# 礼盒 = 特殊套装/礼盒
gift_slugs = [
    'sv2-double-box', 'sv3-box', '151-collectors-set', 'pokemon-card-151-box',
    '游历对战周边礼盒-简中', '游历收藏周边礼盒-简中',
    '2026-春节礼盒-简中', '2026-端午节礼盒-简中',
]

def apply(slug_list, box_type):
    count = 0
    for slug in slug_list:
        c.execute('UPDATE Product SET boxType=? WHERE slug=?', (box_type, slug))
        count += c.rowcount
    return count

fat  = apply(fat_slugs, '肥盒')
slim = apply(slim_slugs, '瘦盒')
gem  = apply(gem_slugs, '宝石包')
gift = apply(gift_slugs, '礼盒')

print(f'肥盒: {fat}件  瘦盒: {slim}件  宝石包: {gem}件  礼盒: {gift}件')

db.commit()

# 查看结果
c.execute("SELECT slug FROM Product WHERE boxType='' AND category='宝可梦原盒'")
unset = c.fetchall()
if unset:
    print('\n⚠ 以下宝可梦产品 boxType 未设置:')
    for r in unset: print(' ', r[0])

c.execute("SELECT boxType, COUNT(*) FROM Product GROUP BY boxType")
print('\n汇总:')
for r in c.fetchall():
    print(f'  {r[0] or "(空)"}: {r[1]}件')

db.close()
