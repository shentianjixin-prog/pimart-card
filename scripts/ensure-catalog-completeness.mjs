/**
 * 生产库目录补全：收集啦151 四版本 + 航海王简中官方目录缺项。
 *
 * 价格原则：只写入用户工作簿中已有的价格；未能从集换社公开网页核验的
 * 商品写 0 / 库存 0，并由前台显示“待核价”，绝不把 0 当作可购买价格。
 */
import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import { existsSync } from "fs";

const url = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = url.startsWith("file:") ? url.slice(5) : url;

if (!existsSync(dbPath)) {
  console.warn(`[catalog-completeness] 数据库不存在，跳过: ${dbPath}`);
  process.exit(0);
}

const db = new Database(dbPath);

const upsert = db.prepare(`
  INSERT INTO Product (
    id, name, slug, category, series, language, description, priceJpy, stock,
    images, boxType, featured, isPreorder, shippingDays, releaseDate, status,
    researchStatus, createdAt, updatedAt
  ) VALUES (
    @id, @name, @slug, @category, @series, '简中', @description, @priceJpy, 0,
    @images, @boxType, 0, 0, 6, @releaseDate, '上架', @researchStatus,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  )
  ON CONFLICT(slug) DO UPDATE SET
    name = excluded.name,
    category = excluded.category,
    series = excluded.series,
    language = excluded.language,
    description = excluded.description,
    priceJpy = excluded.priceJpy,
    stock = 0,
    images = excluded.images,
    boxType = excluded.boxType,
    releaseDate = excluded.releaseDate,
    status = '上架',
    researchStatus = excluded.researchStatus,
    updatedAt = CURRENT_TIMESTAMP
`);

const verifiedPrice = "官方目录已核对 · 用户工作簿价格";
const pendingPrice = "官方目录已核对 · 集换社价格待人工复核";
const products = [];

const editions151 = [
  { key: "lv", title: "旅", date: "2025-01-17", boxPrice: 8500 },
  { key: "wang", title: "望", date: "2025-04-18", boxPrice: 8200 },
  { key: "jing", title: "惊", date: "2025-07-18", boxPrice: 8000 },
  { key: "ju", title: "聚", date: "2025-10-17", boxPrice: 8300 },
];

for (const edition of editions151) {
  const series = `收集啦151 ${edition.title}`;
  const formats = [
    { slug: "slim-box", boxType: "瘦盒", label: "瘦盒", image: "slim", price: edition.boxPrice, spec: "每包5张、每盒15包" },
    { slug: "fat-box", boxType: "肥盒", label: "肥盒", image: "fat", price: edition.boxPrice, spec: "每包20张、每盒6包" },
    { slug: "slim-pack", boxType: "瘦散包", label: "瘦散包", image: "slim", price: 0, spec: "每包5张" },
    { slug: "fat-pack", boxType: "肥散包", label: "肥散包", image: "fat", price: 0, spec: "每包20张" },
    { slug: "slim-case", boxType: "瘦原箱", label: "瘦原箱", image: "slim", price: 0, spec: "5张装瘦盒原箱" },
    { slug: "fat-case", boxType: "肥原箱", label: "肥原箱", image: "fat", price: 0, spec: "20张装肥盒原箱" },
  ];

  for (const format of formats) {
    products.push({
      id: randomUUID(),
      name: `${series} ${format.label}（简中）`,
      slug: `pokemon-151-${edition.key}-${format.slug}-cn`,
      category: "宝可梦原盒",
      series,
      description: `${series}官方简中商品，${format.spec}。旅、望、惊、聚为四个不同版本，商品与图片不混用。`,
      priceJpy: format.price,
      images: `/products/pokemon151-official/151-${edition.key}-${format.image}.${edition.key === "lv" && format.image === "fat" ? "svg" : "png"}`,
      boxType: format.boxType,
      releaseDate: edition.date,
      researchStatus: format.price > 0 ? verifiedPrice : pendingPrice,
    });
  }
}

const opcSets = [
  { code: "12", title: "师徒之绊", date: "2025-07-17" },
  { code: "13", title: "继承的意志", date: "2025-09-16" },
  { code: "16", title: "决战之时", date: "2026-05-30" },
];

for (const set of opcSets) {
  const series = `OPC-${set.code} ${set.title}`;
  for (const format of [
    { slug: "box", label: "原盒", boxType: "原盒", price: 5500 },
    { slug: "pack", label: "散包", boxType: "散包", price: 200 },
    { slug: "case", label: "原箱", boxType: "原箱", price: 66000 },
  ]) {
    products.push({
      id: randomUUID(),
      name: `${series} ${format.label}（简中）`,
      slug: `opc-${set.code}-official-${format.slug}-cn`,
      category: "海贼王",
      series,
      description: `${series}官方简中补充包。目录与主图已按航海王卡牌对战简中官网校准。`,
      priceJpy: format.price,
      images: `/products/onepiece-official/opc-${set.code}-pack.png`,
      boxType: format.boxType,
      releaseDate: set.date,
      researchStatus: verifiedPrice,
    });
  }
}

const onePiecePending = [
  ["onepiece-ebc-01-memorial-cn", "特别补充包 纪念收藏合集（简中）", "纪念收藏合集", "补充包", "2024-03-20", "ebc-01-pack.png"],
  ["onepiece-prbc-01-cn", "PRBC-01 历代典藏合集（简中）", "PRBC-01 历代典藏合集", "补充包", "2024-09-17", "prbc-01-pack.png"],
  ["onepiece-prbc-02-cn", "PRBC-02 历代典藏合集 Vol.2（简中）", "PRBC-02 历代典藏合集 Vol.2", "补充包", "2025-08-19", "prbc-02-pack.png"],
  ["onepiece-ebc-04-cn", "EBC-04 艾格赫德危机（简中）", "EBC-04 艾格赫德危机", "补充包", "2026-02-02", "ebc-04-pack.png"],
  ["onepiece-stc-05-cn", "STC-05 ONE PIECE FILM edition（简中）", "STC-05 ONE PIECE FILM edition", "卡组", "2022-12-09", "stc-05-deck.png"],
  ["onepiece-stc-07-cn", "STC-07 大妈海盗团（简中）", "STC-07 大妈海盗团", "卡组", "2023-04-21", "stc-07-deck.png"],
  ["onepiece-stc-08-cn", "STC-08 第五个海上皇帝（简中）", "STC-08 第五个海上皇帝", "卡组", "2023-08-11", "stc-08-deck.png"],
  ["onepiece-stc-09-cn", "STC-09 继承御殿遗志的人（简中）", "STC-09 继承御殿遗志的人", "卡组", "2023-08-11", "stc-09-deck.png"],
  ["onepiece-stc-10-cn", "STC-10 三方船长集结（简中）", "STC-10 三方船长集结", "卡组", "2023-10-27", "stc-10-deck.png"],
  ["onepiece-stc-12-cn", "STC-12 佐罗＆山智（简中）", "STC-12 佐罗＆山智", "卡组", "2024-01-12", "stc-12-deck.png"],
  ["onepiece-stc-13-cn", "STC-13 奇迹的再会（简中）", "STC-13 奇迹的再会", "卡组", "2024-03-13", "stc-13-deck.png"],
  ["onepiece-stc-14-cn", "STC-14 两年后再出发（简中）", "STC-14 两年后再出发", "卡组", "2024-06-25", "stc-14-deck.png"],
  ["onepiece-stc-23-28-cn", "STC-23～28 对战进阶套组2025（简中）", "STC-23～28 对战进阶套组2025", "卡组", "2025-08-07", "stc-23-28-decks.png"],
  ["onepiece-stc-29-cn", "STC-29 艾格赫德（简中）", "STC-29 艾格赫德", "卡组", "2025-12-26", "stc-29-deck.png"],
  ["onepiece-starter-gear5-cn", "基本卡组 变档5档（简中）", "航海王基本卡组", "卡组", "2025-01-22", "stc-15-deck.png"],
  ["onepiece-starter-ace-newgate-cn", "基本卡组 艾斯和纽哥特（简中）", "航海王基本卡组", "卡组", "2025-06-05", "stc-22-deck.png"],
  ["onepiece-starter-luffy-ace-cn", "基本卡组 路飞＆艾斯（简中）", "航海王基本卡组", "卡组", "2026-04-11", "stc-30-deck.png"],
  ["onepiece-stc-31-36-cn", "STC-31～36 对战进阶套组2026（简中）", "STC-31～36 对战进阶套组2026", "卡组", "2026-07-11", "stc-31-36-decks.png"],
];

for (const [slug, name, series, boxType, releaseDate, image] of onePiecePending) {
  products.push({
    id: randomUUID(),
    name,
    slug,
    category: "海贼王",
    series,
    description: `${name.replace("（简中）", "")}，商品名称、发售日与图片已按航海王卡牌对战简中官网校准；售价待集换社人工复核后开放购买。`,
    priceJpy: 0,
    images: `/products/onepiece-official/${image}`,
    boxType,
    releaseDate,
    researchStatus: pendingPrice,
  });
}

const transaction = db.transaction(() => {
  for (const product of products) {
    upsert.run({ ...product, releaseDate: `${product.releaseDate}T00:00:00.000Z` });
  }

  const officialOpc = [
    ["01", "冒险的黎明", "2022-11-18"], ["02", "顶尖决战", "2023-02-17"],
    ["03", "强大的敌人", "2023-04-28"], ["04", "诡计的王国", "2023-08-04"],
    ["05", "新纪元的主角", "2023-11-04"], ["06", "双璧的霸者", "2024-01-24"],
    ["07", "500年后的未来", "2024-04-24"], ["08", "传说的强者", "2024-07-15"],
    ["09", "新帝降临", "2024-10-18"], ["10", "王之血脉", "2025-01-16"],
    ["11", "神速之拳", "2025-04-09"], ["12", "师徒之绊", "2025-07-17"],
    ["13", "继承的意志", "2025-09-16"], ["14", "苍海七杰", "2025-12-04"],
    ["15", "神之岛的冒险", "2026-03-14"], ["16", "决战之时", "2026-05-30"],
  ];
  const updateOpc = db.prepare(`
    UPDATE Product SET series = ?, releaseDate = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE series LIKE ? OR name LIKE ?
  `);
  const renameOpc = db.prepare(`
    UPDATE Product SET
      name = ? || ' ' || CASE boxType
        WHEN '散包' THEN '散包'
        WHEN '原箱' THEN '原箱'
        ELSE '原盒'
      END || '（简中）',
      description = ? || '官方简中补充包。商品名称、发售日与主图已按航海王卡牌对战简中官网校准。',
      updatedAt = CURRENT_TIMESTAMP
    WHERE series = ? AND boxType IN ('原盒', '散包', '原箱')
  `);
  for (const [code, title, date] of officialOpc) {
    const series = `OPC-${code} ${title}`;
    updateOpc.run(series, `${date}T00:00:00.000Z`, `OPC-${code}%`, `%OPC-${code}%`);
    renameOpc.run(series, series, series);
  }
});

transaction();
console.log(`[catalog-completeness] 已校准/补齐 ${products.length} 个 151 与航海王商品规格`);
db.close();
