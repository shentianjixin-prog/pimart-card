/**
 * 强制同步商品图片路径到运行时数据库（幂等）。
 * 解决 Railway Volume 旧库图片为 placeholder 的问题。
 * 宝可梦原盒会附带「每盒最贵 5 张卡」图（见 pokemon-topcards-manifest.json）。
 */
import Database from "better-sqlite3";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const url = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = url.startsWith("file:") ? url.slice(5) : url;

if (!existsSync(dbPath)) {
  console.log("[images] 数据库不存在，跳过");
  process.exit(0);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOPCARDS_MANIFESTS = [
  join(__dirname, "pokemon-topcards-manifest.json"),
  join(__dirname, "opc-topcards-manifest.json"),
];

/** 盒图路径；若有 chase 卡清单则拼成「盒图 + top5」 */
const IMAGE_MAP = {
  "30th-vol1-简中": "/products/30th-vol1.png",
  "30th-vol2-简中": "/products/30th-vol2.png",
  "30th-booster-box-简中": "/products/30th-booster-box.png",
  "共逐荣光-box-简中": "/products/csv10c-box.png",
  "大师战略-猛雷鼓ex-简中": "/products/master-deck-thunderdrum.png",
  "大师战略-多龙巴鲁托ex-简中": "/products/master-deck-hydreigon.png",
  "大师战略-赛富豪ex-简中": "/products/master-deck-ceruledge.png",
  "火箭队宏图礼盒-简中": "/products/rocket-gang-box.png",
  "宝可梦嗨皮组合-简中": "/products/happy-combo.png",
  "伊布套装礼盒-简中": "/products/eevee-gift-box.png",
  "151-コレクタ-ズセット-简中": "/products/151-box.png",
  "151-collectors-set-简中": "/products/151-box.png",
  "2026-春节礼盒-简中": "/products/chunjie2026-box.png",
  "2026-端午节礼盒-简中": "/products/duanwu2026-box-v2.png",
  "ebc-02-anime-25th-collection-box": "/products/ebc-02-box.jpg",
  "ebc-03-heroines-edition-box": "/products/ebc-03-box.png",
  "narutop99-ウエハ-ス第1弾-box": "/products/naruto-wafer-vol1.jpg",
  "opc-01-romance-dawn-box": "/products/opc-01-box-v2.jpg",
  "opc-02-paramount-war-box": "/products/opc-02-box-v2.jpg",
  "opc-03-pillars-of-strength-box": "/products/opc-03-box.jpg",
  "opc-04-kingdoms-of-intrigue-box": "/products/opc-04-box-v2.jpg",
  "opc-05-awakening-new-era-box": "/products/opc-05-box-v2.jpg",
  "opc-06-wings-of-the-captain-box": "/products/opc-06-box-v2.jpg",
  "opc-07-500-years-future-box": "/products/opc-07-box-v2.jpg",
  "opc-08-two-legends-box": "/products/opc-08-box.webp",
  "opc-09-emperors-new-world-box": "/products/opc-09-box.jpg",
  "opc-10-royal-blood-box": "/products/opc-10-box-v2.jpg",
  "opc-11-divine-speed-box": "/products/opc-11-box.png",
  "opc-14-cyan-sea-seven-box": "/products/opc-14-box.png",
  "opc-15-adventure-gods-island-box": "/products/opc-15-box-v2.png",
  "sm-强化包-第一弹-box-简中": "/products/sm15-box.png",
  "sm-强化包-第二弹-box-简中": "/products/sm25-box.webp",
  "stc-01-straw-hat-crew-deck": "/products/stc-01-deck.jpg",
  "stc-02-worst-generation-deck": "/products/stc-02-deck.jpg",
  "stc-03-warlords-deck": "/products/stc-03-deck.jpg",
  "stc-04-animal-kingdom-deck": "/products/stc-04-deck.jpg",
  "stc-06-absolute-justice-deck": "/products/stc-06-deck.jpg",
  "スノ-ハザ-ド-クレイバ-スト-ダブルパック-简中": "/products/sv2-double-box-v2.png",
  "sv2-double-pack-简中": "/products/sv2-double-box-v2.png",
  "ポケモンカ-ド151-box-简中": "/products/151-box.png",
  "pokemon-card-151-box-简中": "/products/151-box.png",
  "九彩汇聚-朋-box-简中": "/products/cs4a-box.jpg",
  "九彩汇聚-源-box-简中": "/products/cs4b-box.webp",
  "交相辉映-唤-box-简中": "/products/csm2c-box.png",
  "交相辉映-沐-box-简中": "/products/csm2a-box.png",
  "交相辉映-魁-box-简中": "/products/csm2b-box.png",
  "剑刃觉醒-box-简中": "/products/csv7c-box-v2.png",
  "勇魅群星-勇-box-简中": "/products/cs5b-box.png",
  "勇魅群星-魅-box-简中": "/products/cs5-box.png",
  "嘉奖回合-box-简中": "/products/csv4c-box.png",
  "奇迹启程-box-简中": "/products/csv2c-box.png",
  "宝石包第一弹-box-简中": "/products/cbb1c-box.png",
  "宝石包第三弹-box-简中": "/products/cbb3c-box.png",
  "宝石包第二弹-box-简中": "/products/cbb2c-box.png",
  "宝石包第五弹-box-简中": "/products/cbb5c-box.png",
  "宝石包第四弹-box-简中": "/products/cbb4c-box.png",
  "怒炎灼天-box-简中": "/products/cs35-box.png",
  "无畏太晶-box-简中": "/products/csv3c-box.png",
  "星彩晶璃-box-简中": "/products/csv9c-box.png",
  "暗影夺辉-box-简中": "/products/cs55-box.png",
  "朱-紫-黒炎の支配者-box-简中": "/products/sv3-box-v2.png",
  "朱-紫ex-強化拡張パック-box-简中": "/products/csv1c-box.png",
  "极巨争锋-焰-box-简中": "/products/cs1b-box.png",
  "极巨争锋-雷-box-简中": "/products/cs1a-box.png",
  "极巨攻防-box-简中": "/products/cs15-box.png",
  "横空出世-泽-box-简中": "/products/csm1c-box.png",
  "横空出世-苍-box-简中": "/products/csm1b-box.png",
  "横空出世-赫-box-简中": "/products/csm1a-box.png",
  "洪荒演武-激-box-简中": "/products/cs3b-box.png",
  "洪荒演武-茂-box-简中": "/products/cs3a-box.jpg",
  "浓墨重彩-靛-box-简中": "/products/cs2b-box.png",
  "浓墨重彩-黎-box-简中": "/products/cs2a-box.png",
  "游历对战周边礼盒-简中": "/products/ylsc-battle-box-v2.png",
  "游历收藏周边礼盒-简中": "/products/ylsc-collect-box-v2.png",
  "火影忍者-コレクタブルカ-ド-スタ-タ-セット": "/products/naruto-wafer-vol3.jpg",
  "naruto-collectible-starter-set": "/products/naruto-wafer-vol3.jpg",
  "火影忍者-疾風伝-カ-ドウエハ-ス-box": "/products/naruto-wafer-vol2.jpg",
  "璀璨反击-box-简中": "/products/cs25-box.png",
  "璀璨诡幻-box-简中": "/products/csv8c-box.png",
  "真实玄虚-box-简中": "/products/csv6c-box.png",
  "碧海暗影-box-简中": "/products/cs6a-box.png",
  "终末炎舞-box-简中": "/products/cs45-box.png",
  "胜象星引-box-简中": "/products/cs65-box.jpg",
  "黑晶炽焰-box-简中": "/products/csv5c-box-v2.png",
};

function loadTopcardsManifest(path) {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    console.warn(`[images] 读取 ${path} 失败:`, e.message);
    return {};
  }
}

function withTopcards(imageMap) {
  const out = { ...imageMap };
  for (const path of TOPCARDS_MANIFESTS) {
    const manifest = loadTopcardsManifest(path);
    for (const [slug, info] of Object.entries(manifest)) {
      const tops = Array.isArray(info?.topcards) ? info.topcards.filter(Boolean) : [];
      if (!tops.length) continue;
      // IMAGE_MAP 可能只有 -box；清单里还有 -pack/-case，一并写入
      const existing = (out[slug] || "").split(",")[0].trim();
      const base = existing || tops[0];
      // 若已有盒图用盒图；否则保持原样（pack/case 会在下面用 box 图补）
      if (existing) {
        out[slug] = [existing, ...tops].join(",");
      } else {
        out[slug] = tops.join(",");
      }
      void base;
    }
  }
  // pack/case：若只有 chase 而无盒图，从同系列 -box 借盒图
  for (const [slug, images] of Object.entries(out)) {
    if (!slug.includes("-pack") && !slug.includes("-case")) continue;
    const boxSlug = slug.replace(/-(pack|case)$/, "-box");
    const boxImages = out[boxSlug];
    if (!boxImages) continue;
    const box = boxImages.split(",")[0].trim();
    const tops = images
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && !s.includes("-box.") && s.includes("/topcards/"));
    if (box && tops.length) out[slug] = [box, ...tops].join(",");
  }
  return out;
}

const IMAGE_MAP_FINAL = withTopcards(IMAGE_MAP);

// 2026-07-16 朱紫第10弹「共逐荣光」相关的一批新商品，Railway Volume 旧库可能还没有这些行，
// 光靠上面的 UPDATE 是补不出来的，所以这里连行一起 upsert（按 slug 幂等）。
const NEW_PRODUCTS = [
{
  id: '78010756-aa89-4ef4-a687-e17fd0bdff99',
  name: '30周年庆典 最初的伙伴闪卡套装 Vol.1（简中）',
  slug: '30th-vol1-简中',
  category: '宝可梦礼盒',
  series: '30周年庆典',
  description: '9种之一随机闪卡（关都/神奥/阿罗拉初始宝可梦）+ 亚克力磁吸展示框 + 璀璨诡幻5张补充包，官方零售价39元。',
  priceJpy: 1500,
  stock: 0,
  images: '/products/30th-vol1.png',
  boxType: '礼盒',
  featured: false,
  isPreorder: false,
  shippingDays: 6,
  releaseDate: '2026-03-20',
  cardNumber: null,
  rarity: null,
  language: '简中',
  costPrice: null,
  marketRefPrice: null,
  minPrice: null,
  status: '上架',
  researchStatus: '待调研'
},
{
  id: '18573439-a107-4dfa-b003-79baf41c7e30',
  name: '30周年庆典 最初的伙伴闪卡套装 Vol.2（简中）',
  slug: '30th-vol2-简中',
  category: '宝可梦礼盒',
  series: '30周年庆典',
  description: '9种之一随机闪卡（城都/合众/伽勒尔初始宝可梦）+ 亚克力磁吸展示框 + 星彩晶璃5张补充包，官方零售价39元。',
  priceJpy: 1500,
  stock: 0,
  images: '/products/30th-vol2.png',
  boxType: '礼盒',
  featured: false,
  isPreorder: false,
  shippingDays: 6,
  releaseDate: '2026-06-19',
  cardNumber: null,
  rarity: null,
  language: '简中',
  costPrice: null,
  marketRefPrice: null,
  minPrice: null,
  status: '上架',
  researchStatus: '待调研'
},
{
  id: '178e152d-74cd-43d5-bd05-badcbcfc3777',
  name: '30周年庆典 补充包 BOX（简中）',
  slug: '30th-booster-box-简中',
  category: '宝可梦原盒',
  series: '30周年庆典',
  description: '2026-09-16全球同步发售。每包6张全为闪卡，含30位画师设计的30种皮卡丘插画，全新FUR稀有度首次登场，官方零售价18元/包。',
  priceJpy: 13000,
  stock: 0,
  images: '/products/30th-booster-box.png',
  boxType: '原盒',
  featured: true,
  isPreorder: true,
  shippingDays: 7,
  releaseDate: '2026-09-16',
  cardNumber: null,
  rarity: null,
  language: '简中',
  costPrice: null,
  marketRefPrice: null,
  minPrice: null,
  status: '上架',
  researchStatus: '待调研'
},
{
  id: 'f2fbc091-f7a8-47c7-bae8-862c76eed488',
  name: '共逐荣光 BOX（简中）',
  slug: '共逐荣光-box-简中',
  category: '宝可梦原盒',
  series: '朱・紫 CSV10c',
  description: '朱紫第10弹，2026-07-16发售。收录222+张卡牌，首次加入训练家的宝可梦卡牌类型，展现训练家与宝可梦的羁绊，5张装10元/包。',
  priceJpy: 6500,
  stock: 0,
  images: '/products/csv10c-box.png',
  boxType: '肥盒',
  featured: true,
  isPreorder: true,
  shippingDays: 5,
  releaseDate: '2026-07-16',
  cardNumber: null,
  rarity: null,
  language: '简中',
  costPrice: null,
  marketRefPrice: null,
  minPrice: null,
  status: '上架',
  researchStatus: '待调研'
},
{
  id: '96284a89-ffff-43de-ab97-9886f9b9de52',
  name: '大师战略卡组构筑套装 猛雷鼓ex（简中）',
  slug: '大师战略-猛雷鼓ex-简中',
  category: '宝可梦对战套装',
  series: '朱・紫 CSV10c',
  description: '2026-07-16发售，官方零售价390元。含猛雷鼓ex主题卡组60张 + 改造包15张 + 共逐荣光补充包4包（20张装）+ 艺术卡套 + 对战配件。',
  priceJpy: 8500,
  stock: 0,
  images: '/products/master-deck-thunderdrum.png',
  boxType: '对战套装',
  featured: false,
  isPreorder: true,
  shippingDays: 6,
  releaseDate: '2026-07-16',
  cardNumber: null,
  rarity: null,
  language: '简中',
  costPrice: null,
  marketRefPrice: null,
  minPrice: null,
  status: '上架',
  researchStatus: '待调研'
},
{
  id: '81ae6909-c675-4c81-9e34-d28135239261',
  name: '大师战略卡组构筑套装 多龙巴鲁托ex（简中）',
  slug: '大师战略-多龙巴鲁托ex-简中',
  category: '宝可梦对战套装',
  series: '朱・紫 CSV10c',
  description: '2026-07-16发售，官方零售价390元。含多龙巴鲁托ex主题卡组60张 + 改造包15张 + 共逐荣光补充包4包（20张装）+ 艺术卡套 + 对战配件。',
  priceJpy: 8500,
  stock: 0,
  images: '/products/master-deck-hydreigon.png',
  boxType: '对战套装',
  featured: false,
  isPreorder: true,
  shippingDays: 6,
  releaseDate: '2026-07-16',
  cardNumber: null,
  rarity: null,
  language: '简中',
  costPrice: null,
  marketRefPrice: null,
  minPrice: null,
  status: '上架',
  researchStatus: '待调研'
},
{
  id: 'db1831f2-65bc-46a5-8da6-30d5484e8c65',
  name: '大师战略卡组构筑套装 赛富豪ex（简中）',
  slug: '大师战略-赛富豪ex-简中',
  category: '宝可梦对战套装',
  series: '朱・紫 CSV10c',
  description: '2026-07-16发售，官方零售价390元。含赛富豪ex主题卡组60张 + 改造包15张 + 共逐荣光补充包4包（20张装）+ 艺术卡套 + 对战配件。',
  priceJpy: 8500,
  stock: 0,
  images: '/products/master-deck-ceruledge.png',
  boxType: '对战套装',
  featured: false,
  isPreorder: true,
  shippingDays: 6,
  releaseDate: '2026-07-16',
  cardNumber: null,
  rarity: null,
  language: '简中',
  costPrice: null,
  marketRefPrice: null,
  minPrice: null,
  status: '上架',
  researchStatus: '待调研'
},
{
  id: '403d09df-c7a3-4d7a-aa28-9aef2799cea8',
  name: '火箭队的宏图专属礼盒（简中）',
  slug: '火箭队宏图礼盒-简中',
  category: '宝可梦礼盒',
  series: '朱・紫 CSV10c',
  description: '2026-07-16发售，以火箭队R为主题，内含共逐荣光相关补充包及周边配件，官方零售价390元。',
  priceJpy: 8500,
  stock: 0,
  images: '/products/rocket-gang-box.png',
  boxType: '礼盒',
  featured: false,
  isPreorder: true,
  shippingDays: 6,
  releaseDate: '2026-07-16',
  cardNumber: null,
  rarity: null,
  language: '简中',
  costPrice: null,
  marketRefPrice: null,
  minPrice: null,
  status: '上架',
  researchStatus: '待调研'
},
{
  id: '31fe6011-65ae-48b0-8ab5-1c14a6fbed54',
  name: '宝可梦卡牌嗨皮组合（简中）',
  slug: '宝可梦嗨皮组合-简中',
  category: '宝可梦对战套装',
  series: '朱・紫 CSV10c',
  description: '2026-07-16发售，官方零售价88元。含快龙ex/超梦ex/喷火驼/来悲粗茶4套60张卡组 + 嗨皮包7包 + 改造包 + 入门配件，适合新手入门。',
  priceJpy: 2000,
  stock: 0,
  images: '/products/happy-combo.png',
  boxType: '对战套装',
  featured: false,
  isPreorder: true,
  shippingDays: 6,
  releaseDate: '2026-07-16',
  cardNumber: null,
  rarity: null,
  language: '简中',
  costPrice: null,
  marketRefPrice: null,
  minPrice: null,
  status: '上架',
  researchStatus: '待调研'
},
{
  id: '88341486-68c4-44f8-a405-ced66e3838f9',
  name: '伊布套装礼盒（简中）',
  slug: '伊布套装礼盒-简中',
  category: '宝可梦礼盒',
  series: '朱・紫 太晶盛聚',
  description: '2026-05-25发售，含太晶盛聚补充包8包（10张装）+ 伊布进化主题收藏卡册 + 主题艺术卡套64张，官方零售价390元，共9款可选。',
  priceJpy: 8200,
  stock: 0,
  images: '/products/eevee-gift-box.png',
  boxType: '礼盒',
  featured: false,
  isPreorder: false,
  shippingDays: 6,
  releaseDate: '2026-05-25',
  cardNumber: null,
  rarity: null,
  language: '简中',
  costPrice: null,
  marketRefPrice: null,
  minPrice: null,
  status: '上架',
  researchStatus: '待调研'
}
];

const db = new Database(dbPath);
const update = db.prepare('UPDATE "Product" SET images = ? WHERE slug = ? AND images != ?');

let updated = 0;
let skipped = 0;

for (const [slug, images] of Object.entries(IMAGE_MAP_FINAL)) {
  const result = update.run(images, slug, images);
  if (result.changes > 0) {
    updated++;
  } else {
    skipped++;
  }
}

const insertNew = db.prepare(`
  INSERT INTO "Product" (
    id, name, slug, category, series, description, priceJpy, stock, images,
    boxType, featured, isPreorder, shippingDays, releaseDate, cardNumber,
    rarity, language, costPrice, marketRefPrice, minPrice, status, researchStatus,
    createdAt, updatedAt
  ) VALUES (
    @id, @name, @slug, @category, @series, @description, @priceJpy, @stock, @images,
    @boxType, @featured, @isPreorder, @shippingDays, @releaseDate, @cardNumber,
    @rarity, @language, @costPrice, @marketRefPrice, @minPrice, @status, @researchStatus,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  )
  ON CONFLICT(slug) DO UPDATE SET images = excluded.images
`);

let inserted = 0;
for (const p of NEW_PRODUCTS) {
  const tops = IMAGE_MAP_FINAL[p.slug];
  const images = tops || p.images;
  const result = insertNew.run({
    ...p,
    images,
    featured: p.featured ? 1 : 0,
    isPreorder: p.isPreorder ? 1 : 0,
  });
  if (result.changes > 0) inserted++;
}

db.close();
console.log(`[images] 图片路径同步完成：更新 ${updated} 件，已是最新 ${skipped} 件，新品补齐/校正 ${inserted} 件`);
for (const path of TOPCARDS_MANIFESTS) {
  if (!existsSync(path)) continue;
  const n = Object.keys(JSON.parse(readFileSync(path, "utf8"))).length;
  console.log(`[images] 已合并 chase 卡图清单 ${path.split(/[/\\]/).pop()}：${n} 个商品`);
}