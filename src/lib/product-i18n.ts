import type { Lang } from "@/lib/translations";

/** 中文词条 → 日/英；按最长优先替换 */
type Tri = { ja: string; en: string };

const GLOSSARY: Record<string, Tri> = {
  // —— 语言版本 ——
  "（官方名称，简中定价待官方公布）": {
    ja: "（公式名称・中国語版価格は公式発表待ち）",
    en: " (Official name; CN pricing TBA)",
  },
  "（简中）": { ja: "（中国語版）", en: " (CN)" },
  简体中文版: { ja: "簡体字中国語版", en: "Simplified Chinese" },
  简中: { ja: "中国語版", en: "CN" },
  日版: { ja: "日本語版", en: "JP" },
  日文: { ja: "日本語版", en: "JP" },
  英文: { ja: "英語版", en: "EN" },
  英版: { ja: "英語版", en: "EN" },

  // —— 规格 / 品类词 ——
  强化扩张包: { ja: "強化拡張パック", en: "Enhanced Expansion" },
  特别补充包: { ja: "特別補充パック", en: "Special Booster" },
  豪华补充包: { ja: "デラックスブースター", en: "Deluxe Booster" },
  补充包: { ja: "ブースターパック", en: "Booster Pack" },
  强化包: { ja: "強化パック", en: "Enhanced Pack" },
  肥散包: { ja: "ジャンボパック", en: "Jumbo Pack" },
  瘦散包: { ja: "スリムパック", en: "Slim Pack" },
  肥原箱: { ja: "ジャンボカートン", en: "Jumbo Case" },
  瘦原箱: { ja: "スリムカートン", en: "Slim Case" },
  肥盒: { ja: "ブースターBOX", en: "Booster Box" },
  瘦盒: { ja: "強化拡張パックBOX", en: "Enhanced Box" },
  原盒: { ja: "BOX", en: "Sealed Box" },
  散包: { ja: "パック", en: "Single Pack" },
  原箱: { ja: "カートン", en: "Case" },
  盒子: { ja: "BOX", en: "Box" },
  礼盒: { ja: "ギフトBOX", en: "Gift Box" },
  宝石包: { ja: "ジェムパック", en: "Gem Pack" },
  基本卡组: { ja: "スタートデッキ", en: "Starter Deck" },
  预组牌组: { ja: "構築済みデッキ", en: "Preconstructed Deck" },
  卡组: { ja: "デッキ", en: "Deck" },
  双包: { ja: "2パックセット", en: "2-Pack" },
  套装: { ja: "セット", en: "Set" },
  典藏包: { ja: "プレミアムブースター", en: "Premium Booster" },
  特殊卡包: { ja: "スペシャルパック", en: "Special Pack" },

  // —— 品类 ——
  宝可梦对战套装: { ja: "ポケモン対戦セット", en: "Pokémon Battle Set" },
  宝可梦周边: { ja: "ポケモングッズ", en: "Pokémon Merch" },
  宝可梦套装: { ja: "ポケモンセット", en: "Pokémon Set" },
  宝可梦礼盒: { ja: "ポケモンギフトBOX", en: "Pokémon Gift Box" },
  宝可梦原盒: { ja: "ポケモン未開封BOX", en: "Pokémon Sealed Box" },
  宝可梦卡: { ja: "ポケモンカード", en: "Pokémon TCG" },
  宝可梦: { ja: "ポケモン", en: "Pokémon" },
  航海王卡牌对战: { ja: "ONE PIECEカードゲーム", en: "One Piece Card Game" },
  航海王礼盒: { ja: "ワンピースギフト", en: "One Piece Gift" },
  海贼王: { ja: "ワンピース", en: "One Piece" },
  火影忍者: { ja: "NARUTO", en: "Naruto" },
  疾风传: { ja: "疾風伝", en: "Shippuden" },

  // —— 世代 / 系列前缀 ——
  "太阳&月亮": { ja: "サン＆ムーン", en: "Sun & Moon" },
  "剑&盾": { ja: "ソード＆シールド", en: "Sword & Shield" },
  "朱・紫ex": { ja: "スカーレット＆バイオレットex", en: "Scarlet & Violet ex" },
  "朱&紫ex": { ja: "スカーレット＆バイオレットex", en: "Scarlet & Violet ex" },
  朱紫ex: { ja: "スカーレット＆バイオレットex", en: "Scarlet & Violet ex" },
  "朱・紫": { ja: "スカーレット＆バイオレット", en: "Scarlet & Violet" },
  "朱&紫": { ja: "スカーレット＆バイオレット", en: "Scarlet & Violet" },
  朱紫: { ja: "スカーレット＆バイオレット", en: "Scarlet & Violet" },
  节日礼盒: { ja: "季節ギフト", en: "Seasonal Gift" },
  游历系列: { ja: "トラベルシリーズ", en: "Travel Series" },
  "30周年庆典": { ja: "30周年セレブレーション", en: "30th Anniversary" },

  // —— 朱紫弹名 ——
  星彩晶璃: { ja: "ステラクリスタル", en: "Stellar Crystal" },
  黑晶炽诚: { ja: "ブラッククリスタルブレイズ", en: "Black Crystal Blaze" },
  黑晶炽焰: { ja: "ブラッククリスタルブレイズ", en: "Black Crystal Blaze" },
  利刃猛醒: { ja: "ブレイドアウェイクニング", en: "Blade Awakening" },
  剑刃觉醒: { ja: "ブレイドアウェイクニング", en: "Blade Awakening" },
  奇迹启程: { ja: "ミラクルビギニング", en: "Miracle Beginnings" },
  无畏太晶: { ja: "フィアレステラスタル", en: "Fearless Terastal" },
  嘉奖回合: { ja: "アワードラウンド", en: "Award Round" },
  真实玄虚: { ja: "トゥルーミステリー", en: "True Mystery" },
  璀璨诡幻: { ja: "ブリリアントイリュージョン", en: "Brilliant Illusion" },
  新帝降临: { ja: "ニューエンペラー", en: "New Emperor" },
  神速之拳: { ja: "スイフトフィスト", en: "Swift Fist" },
  共逐荣光: { ja: "グローリーチェイス", en: "Glory Chase" },
  亘古开来: { ja: "フロムエンシェント", en: "From Ancient Times" },
  黑炎霸主: { ja: "黒炎の支配者", en: "Obsidian Flames" },
  "雪危险+泥土猛击": { ja: "スノーハザード＋クレイバースト", en: "Snow Hazard + Clay Burst" },
  雪危险: { ja: "スノーハザード", en: "Snow Hazard" },
  泥土猛击: { ja: "クレイバースト", en: "Clay Burst" },

  // —— 剑盾 / 日月弹名 ——
  极巨争锋: { ja: "ダイマックスクラッシュ", en: "Dynamax Clash" },
  浓墨重彩: { ja: "リッチカラーズ", en: "Rich Colors" },
  洪荒演武: { ja: "プライマルアーツ", en: "Primordial Arts" },
  九彩汇聚: { ja: "ナインカラーズ", en: "Nine Colors" },
  勇魅群星: { ja: "ブレイブスターズ", en: "Brave Stars" },
  碧海暗影: { ja: "アズールシャドウ", en: "Azure Shadow" },
  横空出世: { ja: "ライジングサン", en: "Rising Debut" },
  交相辉映: { ja: "シャイントゥゲザー", en: "Shine Together" },
  极巨攻防: { ja: "ダイマックスバトル", en: "Dynamax Battle" },
  璀璨反击: { ja: "ブリリアントカウンター", en: "Brilliant Counter" },
  怒炎灼天: { ja: "レイジングフレイム", en: "Raging Flames" },
  终末炎舞: { ja: "ファイナルダンス", en: "Final Flame Dance" },
  暗影夺辉: { ja: "シャドウグロウ", en: "Shadow Glow" },
  胜象星引: { ja: "ビクトリースターズ", en: "Victory Stars" },

  // —— 151 / 周边套装 ——
  收集啦151硬币套装ex: { ja: "集めよう151コインセットex", en: "Gotta Collect 151 Coin Set ex" },
  收集啦151硬币套装: { ja: "集めよう151コインセット", en: "Gotta Collect 151 Coin Set" },
  收集啦151: { ja: "集めよう151", en: "Gotta Collect 151" },
  收藏家套装: { ja: "コレクターズセット", en: "Collector's Set" },
  最初的伙伴闪卡套装: { ja: "はじめてのパートナーキラセット", en: "First Partner Holo Set" },
  最初的伙伴展示套装: { ja: "はじめてのパートナースクリーンセット", en: "First Partner Display Set" },
  大师战略卡组构筑套装: { ja: "マスター戦略デッキ構築セット", en: "Master Strategy Deck Building Set" },
  历代典藏合集: { ja: "歴代コレクション", en: "Legacy Collection" },
  纪念收藏合集: { ja: "メモリアルコレクション", en: "Memorial Collection" },
  精选套装: { ja: "セレクトセット", en: "Select Set" },
  豪华卡牌收藏: { ja: "プレミアムカードコレクション", en: "Premium Card Collection" },
  迷你收藏套装: { ja: "ミニコレクション", en: "Mini Collection" },
  对战进阶套组2025: { ja: "対戦アドバンスセット2025", en: "Battle Advanced Set 2025" },
  对战进阶套组2026: { ja: "対戦アドバンスセット2026", en: "Battle Advanced Set 2026" },
  对战桌垫加卡牌盒套装: { ja: "プレイマット＋デッキケースセット", en: "Playmat + Deck Box Set" },
  "对战桌垫+卡牌盒套装": { ja: "プレイマット＋デッキケースセット", en: "Playmat + Deck Box Set" },
  "六种卡牌套装Vol.1": { ja: "6種カードセット Vol.1", en: "Six-Card Set Vol.1" },
  究极进阶卡组: { ja: "アルティメットアドバンスデッキ", en: "Ultimate Advanced Deck" },
  火箭队的宏图专属礼盒: { ja: "ロケット団の野望ギフト", en: "Team Rocket Ambition Gift Box" },
  "官方卡套&官方卡盒": { ja: "公式スリーブ＆デッキケース", en: "Official Sleeve & Deck Box" },
  宝可梦卡牌嗨皮组合: { ja: "ポケモンカードハッピーセット", en: "Pokémon TCG Happy Bundle" },
  日版两周年特别纪念: { ja: "日本語版2周年特別記念", en: "JP 2nd Anniversary Special" },
  硬币收藏艺术展示框: { ja: "コインコレクションアートフレーム", en: "Coin Collection Art Frame" },
  莉莉艾对战套装礼盒: { ja: "リーリエ対戦セットギフト", en: "Lillie Battle Set Gift" },
  "N对战套装礼盒": { ja: "N対戦セットギフト", en: "N Battle Set Gift" },
  伊布套装礼盒: { ja: "イーブイセットギフト", en: "Eevee Set Gift" },
  幻彩未来纪念礼盒: { ja: "プリズムフューチャー記念ギフト", en: "Prismatic Future Memorial Gift" },
  游历对战周边礼盒: { ja: "トラベル対戦グッズギフト", en: "Travel Battle Merch Gift" },
  游历收藏周边礼盒: { ja: "トラベルコレクショングッズギフト", en: "Travel Collection Merch Gift" },
  春节礼盒: { ja: "春節ギフト", en: "Spring Festival Gift" },
  端午节礼盒: { ja: "端午ギフト", en: "Dragon Boat Festival Gift" },
  宝石包第一弹: { ja: "ジェムパック第1弾", en: "Gem Pack Vol.1" },
  宝石包第二弹: { ja: "ジェムパック第2弾", en: "Gem Pack Vol.2" },
  宝石包第三弹: { ja: "ジェムパック第3弾", en: "Gem Pack Vol.3" },
  宝石包第四弹: { ja: "ジェムパック第4弾", en: "Gem Pack Vol.4" },
  宝石包第五弹: { ja: "ジェムパック第5弾", en: "Gem Pack Vol.5" },
  第一弹: { ja: "第1弾", en: "Vol.1" },
  第二弹: { ja: "第2弾", en: "Vol.2" },
  第三弹: { ja: "第3弾", en: "Vol.3" },
  第四弹: { ja: "第4弾", en: "Vol.4" },
  第五弹: { ja: "第5弾", en: "Vol.5" },

  // —— 海贼王套装 ——
  四周年纪念套装: { ja: "4周年記念セット", en: "4th Anniversary Set" },
  三周年纪念套装: { ja: "3周年記念セット", en: "3rd Anniversary Set" },
  一周年纪念套装: { ja: "1周年記念セット", en: "1st Anniversary Set" },
  动画25周年纪念合集: { ja: "アニメ25周年コレクション", en: "Anime 25th Anniversary Collection" },
  "-25周年版-": { ja: "-25周年版-", en: "-25th Anniversary-" },
  女英雄合集: { ja: "ヒロインコレクション", en: "Heroine Collection" },
  冒险的黎明: { ja: "冒険の夜明け", en: "Dawn of Adventure" },
  顶尖决战: { ja: "頂上決戦", en: "Paramount War" },
  强大的敌人: { ja: "強大な敵", en: "Powerful Enemy" },
  诡计的王国: { ja: "謀略の王国", en: "Kingdoms of Intrigue" },
  新时代的主角: { ja: "新時代の主役", en: "Pillars of Strength" },
  双壁的霸者: { ja: "双璧の覇者", en: "Two Legends" },
  "500年后的未来": { ja: "500年後の未来", en: "The Future 500 Years Later" },
  双子传说: { ja: "双子の伝説", en: "Twin Legends" },
  王之血脉: { ja: "王の血統", en: "Royal Bloodline" },
  苍海七杰: { ja: "蒼海の七傑", en: "Seven Warlords of the Sea" },
  神之岛的冒险: { ja: "神の島の冒険", en: "Adventure on the Isle of Gods" },
  决战之时: { ja: "決戦の時", en: "Time of Battle" },
  继承的意志: { ja: "受け継がれる意志", en: "Inherited Will" },
  师徒之绊: { ja: "師弟の絆", en: "Mentor & Disciple Bond" },
  艾格赫德危机: { ja: "エルバフの危機", en: "Elbaph Crisis" },
  继承御殿遗志的人: { ja: "御殿の遺志を継ぐ者", en: "Heir to the Palace Legacy" },
  第五个海上皇帝: { ja: "5人目の海の皇帝", en: "The Fifth Emperor of the Sea" },
  "-红发歌姬-": { ja: "-赤髪の歌姫-", en: "-Red-Hair Songstress-" },
  三方船长集结: { ja: "三船長集結", en: "Three Captains Assemble" },
  两年后再出发: { ja: "2年後の再出発", en: "Setting Out After 2 Years" },
  艾斯和纽哥特: { ja: "エース＆ニューゲート", en: "Ace & Newgate" },
  "佐罗＆山智": { ja: "ゾロ＆サンジ", en: "Zoro & Sanji" },
  "路飞＆艾斯": { ja: "ルフィ＆エース", en: "Luffy & Ace" },
  奇迹的再会: { ja: "奇跡の再会", en: "Miraculous Reunion" },
  大妈海盗团: { ja: "ビッグ・マム海賊団", en: "Big Mom Pirates" },
  百兽海盗团: { ja: "百獣海賊団", en: "Beasts Pirates" },
  百兽海贼团: { ja: "百獣海賊団", en: "Beasts Pirates" },
  王下七武海: { ja: "王下七武海", en: "Seven Warlords" },
  七武海: { ja: "七武海", en: "Warlords" },
  草帽一伙: { ja: "麦わらの一味", en: "Straw Hat Crew" },
  超新星们: { ja: "超新星たち", en: "Supernovas" },
  绝对正义: { ja: "絶対正義", en: "Absolute Justice" },
  最悪世代: { ja: "最悪の世代", en: "Worst Generation" },
  变档5档: { ja: "ギア5", en: "Gear 5" },
  艾格赫德: { ja: "エルバフ", en: "Elbaph" },
  威化卡第1弹: { ja: "ウエハースカード第1弾", en: "Wafer Card Vol.1" },
  威化卡: { ja: "ウエハースカード", en: "Wafer Card" },
  收藏卡入门套装: { ja: "コレクターズ入門セット", en: "Collector Starter Set" },
  多龙巴鲁托ex: { ja: "ドラパルトex", en: "Dragapult ex" },
  猛雷鼓ex: { ja: "イナダイキex", en: "Raging Bolt ex" },
  赛富豪ex: { ja: "サーフゴーex", en: "Gholdengo ex" },

  // 剑盾/日月分版字母（在弹名替换后单独残留）
  " 勇 ": { ja: " 勇 ", en: " Brave " },
  " 魅 ": { ja: " 魅 ", en: " Charm " },
  " 啸 ": { ja: " 啸 ", en: " Roar " },
  " 逐 ": { ja: " 逐 ", en: " Chase " },
  " 雷 ": { ja: " 雷 ", en: " Thunder " },
  " 焰 ": { ja: " 焰 ", en: " Flame " },
  " 靛 ": { ja: " 靛 ", en: " Indigo " },
  " 黎 ": { ja: " 黎 ", en: " Dawn " },
  " 激 ": { ja: " 激 ", en: " Surge " },
  " 茂 ": { ja: " 茂 ", en: " Verdant " },
  " 朋 ": { ja: " 朋 ", en: " Bond " },
  " 源 ": { ja: " 源 ", en: " Source " },
  " 赫 ": { ja: " 赫 ", en: " Crimson " },
  " 苍 ": { ja: " 苍 ", en: " Azure " },
  " 泽 ": { ja: " 泽 ", en: " Grace " },
  " 沐 ": { ja: " 沐 ", en: " Bathe " },
  " 魁 ": { ja: " 魁 ", en: " Chief " },
  " 唤 ": { ja: " 唤 ", en: " Call " },
  " 惊 ": { ja: " 驚 ", en: " Awe " },
  " 旅 ": { ja: " 旅 ", en: " Journey " },
  " 望 ": { ja: " 望 ", en: " Hope " },
  " 聚 ": { ja: " 聚 ", en: " Gather " },

  // —— 描述常用句 ——
  "可选规格：瘦盒 / 肥盒 / 瘦散包 / 肥散包 / 瘦原箱 / 肥原箱。": {
    ja: "選べる仕様：強化拡張BOX / ブースターBOX / スリムパック / ジャンボパック / スリムカートン / ジャンボカートン。",
    en: "Formats: Enhanced Box / Booster Box / Slim Pack / Jumbo Pack / Slim Case / Jumbo Case.",
  },
  "可选规格：原盒 / 散包 / 原箱。": {
    ja: "選べる仕様：BOX / パック / カートン。",
    en: "Formats: Sealed Box / Single Pack / Case.",
  },
  "可选规格：瘦盒 / 肥盒 / 散包 / 原箱。": {
    ja: "選べる仕様：強化拡張BOX / ブースターBOX / パック / カートン。",
    en: "Formats: Enhanced Box / Booster Box / Pack / Case.",
  },
  "补充包散装，约 30 包/肥盒。": {
    ja: "ブースターバラ売り、約30パック/ブースターBOX。",
    en: "Loose boosters, ~30 packs per booster box.",
  },
  "强化包散装，约 20 包/瘦盒。": {
    ja: "強化パックバラ売り、約20パック/強化拡張BOX。",
    en: "Loose enhanced packs, ~20 packs per enhanced box.",
  },
  "肥盒原箱，约 20 盒/箱。": {
    ja: "ブースターBOXカートン、約20BOX/カートン。",
    en: "Booster box case, ~20 boxes per case.",
  },
  "瘦盒原箱，约 20 盒/箱。": {
    ja: "強化拡張BOXカートン、約20BOX/カートン。",
    en: "Enhanced box case, ~20 boxes per case.",
  },
  现货发售: { ja: "現物販売中", en: "In stock" },
  预售商品: { ja: "予約商品", en: "Pre-order item" },
  官网: { ja: "公式サイト", en: "Official site" },
  集换社: { ja: "カードショップ", en: "Card shop" },
  "同弹肥瘦配对": { ja: "同弾の肥痩ペア", en: "Matched fat/slim SKUs of the same set" },
  "本行=肥盒": { ja: "本行=ブースターBOX", en: "This row = Booster Box" },
  "本行=瘦盒": { ja: "本行=強化拡張BOX", en: "This row = Enhanced Box" },
  "配对另一规格见同弹另一行": {
    ja: "ペア仕様は同弾の別行を参照",
    en: "See the paired format on another row of the same set",
  },
  "预计发货": { ja: "発送予定", en: "Expected ship" },
  张装: { ja: "枚入り", en: "-card" },
  "包/盒": { ja: "パック/BOX", en: " packs/box" },
  "盒/箱": { ja: "BOX/カートン", en: " boxes/case" },
  "张/包": { ja: "枚/パック", en: " cards/pack" },
  发售: { ja: "発売", en: "released" },
  含税: { ja: "税込", en: "tax included" },
  瘦包: { ja: "スリム", en: "Slim" },
  肥包: { ja: "ジャンボ", en: "Jumbo" },
  整盒: { ja: "BOX", en: "Box" },
  "1箱": { ja: "1カートン", en: "1 Case" },
  "官网/集换社：同弹肥瘦配对。本行=肥盒（20张装×6包/盒）。": {
    ja: "公式/ショップ：同弾の肥痩ペア。本行=ブースターBOX（20枚入り×6パック/BOX）。",
    en: "Official/shops: matched fat/slim SKUs. This row = Booster Box (20 cards × 6 packs/box).",
  },
  "官网/集换社：同弹肥瘦配对。本行=瘦盒（5张装×15包/盒）。": {
    ja: "公式/ショップ：同弾の肥痩ペア。本行=強化拡張BOX（5枚入り×15パック/BOX）。",
    en: "Official/shops: matched fat/slim SKUs. This row = Enhanced Box (5 cards × 15 packs/box).",
  },
  "配对另一规格见同弹另一行。": {
    ja: "ペア仕様は同弾の別行を参照。",
    en: "See the paired format on another row of the same set.",
  },
  "简中宝可梦": { ja: "中国語版ポケモン", en: "CN Pokémon TCG" },
  "每盒含": { ja: "1BOXあたり", en: "Each box contains" },
  "每包含": { ja: "1パックあたり", en: "Each pack contains" },
  "张卡牌": { ja: "枚のカード", en: " cards" },
  "均为闪卡": { ja: "すべてキラカード", en: " all holos" },
  "稀有度极高": { ja: "レアリティが非常に高い", en: "very high rarity" },
  "必出闪卡": { ja: "キラカード確定", en: "guaranteed holo" },
  "来自网站 DB。": { ja: "サイトDBより。", en: "From site DB." },
  "价格/库存/成本待你核实补录。": {
    ja: "価格・在庫・原価は確認後に追記予定。",
    en: "Price/stock/cost pending verification.",
  },
  "本店未查到对应商品页，暂未上架。": {
    ja: "当店では対応商品ページが見つからず、未掲載です。",
    en: "No matching product page found; not listed yet.",
  },
  "官方 onepiece-cardgame.cn 已发售的构筑卡组": {
    ja: "公式 onepiece-cardgame.cn で発売済みの構築デッキ",
    en: "Preconstructed decks released on official onepiece-cardgame.cn",
  },
  "官方 onepiece-cardgame.cn 已发售": {
    ja: "公式 onepiece-cardgame.cn で発売済み",
    en: "Released on official onepiece-cardgame.cn",
  },
  "预计": { ja: "予定", en: "Expected" },
  "年": { ja: "年", en: "/" },
  "月": { ja: "月", en: "/" },
  "日发售": { ja: "日発売", en: " release" },
  "日发货": { ja: "日発送", en: " ship date" },
  "全球同步发售": { ja: "グローバル同時発売", en: "global simultaneous release" },
  "零售价": { ja: "希望小売価格", en: "MSRP" },
  "元/包": { ja: "元/パック", en: " CNY/pack" },
  "官网建议零售价": { ja: "公式希望小売価格", en: "Official MSRP" },
  "含ex闪卡": { ja: "exキラカード入り", en: "includes ex holo" },
  "硬币": { ja: "コイン", en: "coin" },
  "适合收藏爱好者": { ja: "コレクター向け", en: "for collectors" },
  "适合关都图鉴收藏向玩家": { ja: "カントー図鑑コレクター向け", en: "for Kanto Pokédex collectors" },
  "现货/预售以库存为准": { ja: "現物/予約は在庫に準じます", en: "in-stock/pre-order subject to inventory" },
  "SS 时代最终弹": { ja: "ソード＆シールド時代の最終弾", en: "final Sword & Shield era set" },
  "简中初代首发": { ja: "中国語版初代リリース", en: "first CN generation release" },
  "与 CS6aC「碧海暗影 啸」为独立版本": {
    ja: "CS6aC「アズールシャドウ 啸」とは別バージョン",
    en: "Independent from CS6aC Azure Shadow Roar",
  },
  "朱&紫第一弹「亘古开来」": {
    ja: "スカーレット＆バイオレット第1弾「フロムエンシェント」",
    en: "Scarlet & Violet Vol.1 From Ancient Times",
  },
  "剑&盾第六弹「碧海暗影 逐」": {
    ja: "ソード＆シールド第6弾「アズールシャドウ 逐」",
    en: "Sword & Shield Vol.6 Azure Shadow Chase",
  },

  白色款: { ja: "ホワイト", en: "White" },
  黑色款: { ja: "ブラック", en: "Black" },
};

let _sortedKeys: string[] | null = null;

function sortedGlossaryKeys(): string[] {
  if (!_sortedKeys) {
    _sortedKeys = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  }
  return _sortedKeys;
}

/** 将中文商品文案按站点语言替换（zh 原样返回） */
export function localizeProductText(text: string | null | undefined, lang: Lang): string {
  if (!text) return "";
  if (lang === "zh") return text;

  let out = text;
  for (const key of sortedGlossaryKeys()) {
    const tri = GLOSSARY[key];
    if (!tri) continue;
    if (!out.includes(key)) continue;
    out = out.split(key).join(lang === "ja" ? tri.ja : tri.en);
  }
  return out;
}

export function localizeLanguageLabel(value: string | null | undefined, lang: Lang, fallbackName?: string): string {
  const raw =
    value?.trim() ||
    (fallbackName?.includes("简中")
      ? "简中"
      : fallbackName?.includes("日版") || fallbackName?.includes("日文")
        ? "日文"
        : "");
  if (!raw) return "—";
  return localizeProductText(raw, lang);
}

export function localizeProductName(name: string, lang: Lang): string {
  return localizeProductText(name, lang);
}

export function localizeSeries(series: string | null | undefined, lang: Lang): string | null {
  if (!series) return null;
  return localizeProductText(series, lang);
}

export function localizeCategory(category: string | null | undefined, lang: Lang): string | null {
  if (!category) return null;
  return localizeProductText(category, lang);
}

export function localizeDescription(description: string | null | undefined, lang: Lang): string | null {
  if (!description) return null;
  return localizeProductText(description, lang);
}
