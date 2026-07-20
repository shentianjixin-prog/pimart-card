/**
 * 按 prisma/data/website-catalog.json 全量上架到 DATABASE_URL。
 * 不依赖 openpyxl，供 Railway 启动链稳定同步。
 */
import Database from "better-sqlite3";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const url = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = url.startsWith("file:") ? url.slice(5) : url;
const catalogPath = join(root, "prisma", "data", "website-catalog.json");

if (!existsSync(catalogPath)) {
  console.warn(`[catalog-sync] 缺少 ${catalogPath}，跳过`);
  process.exit(0);
}
if (!existsSync(dbPath)) {
  console.warn(`[catalog-sync] 数据库不存在，跳过: ${dbPath}`);
  process.exit(0);
}

/** @type {Array<Record<string, any>>} */
const items = JSON.parse(readFileSync(catalogPath, "utf8"));
if (!Array.isArray(items) || items.length === 0) {
  console.warn("[catalog-sync] 目录为空，跳过");
  process.exit(0);
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

const cols = new Set(
  db.prepare(`PRAGMA table_info(Product)`).all().map((r) => r.name)
);
if (!cols.has("catalogSort")) {
  db.exec(`ALTER TABLE Product ADD COLUMN catalogSort INTEGER NOT NULL DEFAULT 999999`);
}

const selectImages = db.prepare(`SELECT images FROM Product WHERE slug = ?`);
const selectId = db.prepare(`SELECT id FROM Product WHERE slug = ?`);
const update = db.prepare(`
  UPDATE Product SET
    name = @name,
    series = @series,
    category = @category,
    language = @language,
    description = @description,
    priceJpy = @priceJpy,
    stock = @stock,
    images = @images,
    boxType = @boxType,
    featured = @featured,
    isPreorder = @isPreorder,
    shippingDays = @shippingDays,
    status = '上架',
    costPrice = COALESCE(@costPrice, costPrice),
    catalogSort = @catalogSort,
    releaseDate = COALESCE(@releaseDate, releaseDate),
    updatedAt = datetime('now')
  WHERE slug = @slug
`);
const insert = db.prepare(`
  INSERT INTO Product (
    id, name, slug, category, series, language, description,
    priceJpy, stock, images, boxType, featured, isPreorder,
    shippingDays, releaseDate, costPrice, status, researchStatus,
    catalogSort, createdAt, updatedAt
  ) VALUES (
    @id, @name, @slug, @category, @series, @language, @description,
    @priceJpy, @stock, @images, @boxType, @featured, @isPreorder,
    @shippingDays, @releaseDate, @costPrice, '上架', '表格同步',
    @catalogSort, datetime('now'), datetime('now')
  )
`);

function mergeTopcards(slug, cover) {
  const row = selectImages.get(slug);
  if (!row?.images) return cover;
  const tops = String(row.images)
    .split(",")
    .map((p) => p.trim())
    .filter((p, i) => i > 0 && p.includes("/topcards/"));
  return tops.length ? [cover, ...tops].join(",") : cover;
}

const slugSet = new Set(items.map((it) => it.slug));
let inserted = 0;
let updated = 0;

const tx = db.transaction(() => {
  for (const it of items) {
    const images = mergeTopcards(it.slug, it.images || "/products/placeholder.png");
    const row = {
      id: randomUUID(),
      name: it.name,
      slug: it.slug,
      category: it.category,
      series: it.series ?? null,
      language: it.language || "简中",
      description: it.description ?? null,
      priceJpy: Number(it.priceJpy || 0),
      stock: Number(it.stock || 0),
      images,
      boxType: it.boxType,
      featured: Number(it.featured || 0),
      isPreorder: Number(it.isPreorder || 0),
      shippingDays: Number(it.shippingDays || 6),
      releaseDate: it.releaseDate ?? null,
      costPrice: it.costPrice ?? null,
      catalogSort: Number(it.catalogSort ?? 999999),
    };
    if (selectId.get(it.slug)) {
      update.run(row);
      updated += 1;
    } else {
      insert.run(row);
      inserted += 1;
    }
  }

  // 表格外旧宝可梦/海贼王 SKU 下架
  const onShelf = db
    .prepare(
      `SELECT slug FROM Product
       WHERE status = '上架'
         AND (
           category LIKE '宝可梦%'
           OR category = '海贼王'
           OR category LIKE '%ONE%'
           OR series LIKE 'OPC%'
           OR series LIKE 'EB%'
           OR series LIKE 'EBC%'
           OR series LIKE 'PRB%'
           OR series LIKE 'STC%'
           OR series LIKE '航海王%'
           OR name LIKE '收集啦151%'
           OR slug LIKE 'pokemon-151%'
           OR slug LIKE '收集啦151%'
           OR slug LIKE 'onepiece-gift%'
         )`
    )
    .all();
  const delist = db.prepare(
    `UPDATE Product SET status = '下架', updatedAt = datetime('now') WHERE slug = ?`
  );
  let off = 0;
  for (const { slug } of onShelf) {
    if (!slugSet.has(slug)) {
      delist.run(slug);
      off += 1;
    }
  }
  return off;
});

const off = tx();
const total = db.prepare(`SELECT COUNT(*) AS n FROM Product WHERE status = '上架'`).get().n;
db.close();

console.log(
  `[catalog-sync] +${inserted} ~${updated} 下架旧SKU=${off} 上架总数=${total} ← ${catalogPath}`
);
