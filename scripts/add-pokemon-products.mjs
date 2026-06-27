import Database from "better-sqlite3";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

const projectRoot = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const db = new Database(join(projectRoot, "dev.db"));

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^\w一-龯ぁ-んァ-ヶ]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const now = new Date().toISOString();

const newProducts = [
  // ── 朱紫系列原盒 ──────────────────────────────────────
  {
    name: "星彩晶璃 BOX（简中）",
    category: "宝可梦原盒",
    series: "朱・紫 CSV9c",
    description: "简中宝可梦 朱・紫 星彩晶璃（Stellar Crown）原盒，2026年4月24日发售。每盒含10包，每包含5张卡牌，必出闪卡。",
    priceJpy: 6200,
    stock: 20,
    images: "/products/placeholder.svg",
    featured: true,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: "2026-04-24T00:00:00.000Z",
  },
  {
    name: "黑晶炽焰 BOX（简中）",
    category: "宝可梦原盒",
    series: "朱・紫 CSV5c",
    description: "简中宝可梦 朱・紫 黑晶炽焰（Black Crystal Blaze）原盒，现货发售。",
    priceJpy: 5500,
    stock: 15,
    images: "/products/placeholder.svg",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: null,
  },
  {
    name: "剑刃觉醒 BOX（简中）",
    category: "宝可梦原盒",
    series: "朱・紫 CSV7c",
    description: "简中宝可梦 朱・紫 剑刃觉醒（Blade Awakening）原盒，现货发售。",
    priceJpy: 5800,
    stock: 18,
    images: "/products/placeholder.svg",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: null,
  },
  {
    name: "宝石包第五弹 BOX（简中）",
    category: "宝可梦原盒",
    series: "宝石包",
    description: "简中宝可梦 宝石包第五弹原盒，每包含4张卡牌均为闪卡，稀有度极高。",
    priceJpy: 7800,
    stock: 10,
    images: "/products/placeholder.svg",
    featured: true,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: null,
  },
  // ── 礼盒系列 ──────────────────────────────────────────
  {
    name: "2026 春节礼盒（简中）",
    category: "宝可梦原盒",
    series: "节日礼盒",
    description: "2026年春节限定礼盒，内含：剑刃觉醒补充包×5、春节主题冰箱贴×1、邮票×1、红包×6。",
    priceJpy: 7400,
    stock: 8,
    images: "/products/placeholder.svg",
    featured: true,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: null,
  },
  {
    name: "2026 端午节礼盒（简中）",
    category: "宝可梦原盒",
    series: "节日礼盒",
    description: "2026年端午节限定礼盒，内含：星彩晶璃补充包×5、端午节主题冰箱贴×1、粽子袋×1。",
    priceJpy: 7400,
    stock: 8,
    images: "/products/placeholder.svg",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: null,
  },
  {
    name: "游历收藏周边礼盒（简中）",
    category: "宝可梦原盒",
    series: "游历系列",
    description: "宝可梦游历系列收藏周边礼盒，含主题收藏配件及补充包，适合收藏爱好者。",
    priceJpy: 5000,
    stock: 12,
    images: "/products/placeholder.svg",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: null,
  },
  {
    name: "游历对战周边礼盒（简中）",
    category: "宝可梦原盒",
    series: "游历系列",
    description: "宝可梦游历系列对战周边礼盒，含主题对战配件及补充包，适合对战玩家。",
    priceJpy: 5000,
    stock: 12,
    images: "/products/placeholder.svg",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: null,
  },
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO Product
    (id, name, slug, category, series, description, priceJpy, stock, images,
     featured, isPreorder, shippingDays, releaseDate, createdAt, updatedAt)
  VALUES
    (@id, @name, @slug, @category, @series, @description, @priceJpy, @stock, @images,
     @featured, @isPreorder, @shippingDays, @releaseDate, @createdAt, @updatedAt)
`);

const insertMany = db.transaction((products) => {
  let added = 0;
  for (const p of products) {
    const result = insert.run({
      ...p,
      id: randomUUID(),
      slug: slugify(p.name),
      featured: p.featured ? 1 : 0,
      isPreorder: p.isPreorder ? 1 : 0,
      releaseDate: p.releaseDate ?? null,
      createdAt: now,
      updatedAt: now,
    });
    if (result.changes > 0) added++;
  }
  return added;
});

const added = insertMany(newProducts);
const total = db.prepare("SELECT COUNT(*) as count FROM Product").get().count;

console.log(`✅ 新增商品：${added} 个（slug 重复的自动跳过）`);
console.log(`📦 数据库商品总数：${total} 个`);
db.close();
