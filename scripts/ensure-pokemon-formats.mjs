/**
 * 为非朱紫宝可梦盒装补齐「散包 / 原箱」SKU（幂等）：
 * - 宝石包：宝石包 + 散包 + 原箱（约 15 包/盒）
 * - 日月 / 剑盾 肥盒：肥散包 + 肥原箱（约 30 包/盒）
 * - 日月 / 剑盾 瘦盒：瘦散包 + 瘦原箱（约 20 包/盒）
 *
 * 价格按整盒推算；库存按盒内包数/箱内盒数估算，后台可改。
 */
import Database from "better-sqlite3";
import { existsSync } from "fs";
import { randomUUID } from "crypto";

const GEM_PACKS_PER_BOX = 15;
const FAT_PACKS_PER_BOX = 30;
const SLIM_PACKS_PER_BOX = 20;
const BOXES_PER_CASE = 20;

const url = process.env.DATABASE_URL || "file:./prisma/data/initial.db";
const dbPath = url.startsWith("file:") ? url.slice(5) : url;

if (!existsSync(dbPath)) {
  console.warn(`[pokemon-formats] 数据库不存在，跳过: ${dbPath}`);
  process.exit(0);
}

const db = new Database(dbPath);
const findBySlug = db.prepare(`SELECT id FROM Product WHERE slug = ?`);
const insert = db.prepare(`
  INSERT INTO Product (
    id, name, slug, category, series, language, description, priceJpy, stock, images,
    boxType, featured, isPreorder, shippingDays, releaseDate, status, createdAt, updatedAt
  ) VALUES (
    @id, @name, @slug, @category, @series, @language, @description, @priceJpy, @stock, @images,
    @boxType, @featured, @isPreorder, @shippingDays, @releaseDate, @status, @createdAt, @updatedAt
  )
`);

function roundYen(n) {
  return Math.max(100, Math.round(Number(n) / 100) * 100);
}

function baseSlug(slug) {
  return String(slug)
    .replace(/-slim-box-简中$/i, "")
    .replace(/-fat-box-简中$/i, "")
    .replace(/-box-简中$/i, "")
    .replace(/-box$/i, "");
}

function displayTitle(name) {
  return String(name || "")
    .replace(/^补充包\s*/, "")
    .replace(/^强化包\s*/, "")
    .replace(/\s*BOX.*$/i, "")
    .replace(/（简中）$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

let created = 0;
let skipped = 0;
const now = new Date().toISOString();

function createVariants(box, variants) {
  for (const v of variants) {
    if (findBySlug.get(v.slug)) {
      skipped += 1;
      continue;
    }
    insert.run({
      id: randomUUID(),
      name: v.name,
      slug: v.slug,
      category: box.category || "宝可梦",
      series: box.series,
      language: box.language,
      description: v.description,
      priceJpy: v.priceJpy,
      stock: v.stock,
      images: box.images,
      boxType: v.boxType,
      featured: 0,
      isPreorder: box.isPreorder ? 1 : 0,
      shippingDays: box.shippingDays ?? 6,
      releaseDate: box.releaseDate,
      status: box.status || "上架",
      createdAt: now,
      updatedAt: now,
    });
    created += 1;
    console.log(`[pokemon-formats] 已创建 ${v.boxType}: ${v.slug}`);
  }
}

const tx = db.transaction(() => {
  const gems = db
    .prepare(
      `SELECT id, slug, name, series, language, category, description, priceJpy, stock, images,
              shippingDays, isPreorder, releaseDate, status
       FROM Product
       WHERE boxType = '宝石包'
         AND status = '上架'`
    )
    .all();

  for (const box of gems) {
    const title = displayTitle(box.name);
    const lang = box.language || "简中";
    const price = Number(box.priceJpy);
    const stock = Number(box.stock) || 0;
    const root = baseSlug(box.slug);

    createVariants(box, [
      {
        boxType: "散包",
        slug: `${root}-pack-简中`,
        name: `${title} 散包（${lang}）`,
        priceJpy: roundYen(price / GEM_PACKS_PER_BOX),
        description: `${box.description || ""}\n宝石包散装，约 ${GEM_PACKS_PER_BOX} 包/盒。`.trim(),
        stock: stock > 0 ? Math.max(GEM_PACKS_PER_BOX, stock * GEM_PACKS_PER_BOX) : 0,
      },
      {
        boxType: "原箱",
        slug: `${root}-case-简中`,
        name: `${title} 原箱（${lang}）`,
        priceJpy: price * BOXES_PER_CASE,
        description: `${box.description || ""}\n宝石包原箱，约 ${BOXES_PER_CASE} 盒/箱。`.trim(),
        stock: Math.floor(stock / BOXES_PER_CASE),
      },
    ]);
  }

  const fatBoxes = db
    .prepare(
      `SELECT id, slug, name, series, language, category, description, priceJpy, stock, images,
              shippingDays, isPreorder, releaseDate, status
       FROM Product
       WHERE boxType = '肥盒'
         AND status = '上架'
         AND (series LIKE '剑&盾 %' OR series LIKE '太阳&月亮 %')
         AND series NOT LIKE '朱・紫%'`
    )
    .all();

  for (const box of fatBoxes) {
    const title = displayTitle(box.name);
    const lang = box.language || "简中";
    const price = Number(box.priceJpy);
    const stock = Number(box.stock) || 0;
    const root = baseSlug(box.slug);

    createVariants(box, [
      {
        boxType: "肥散包",
        slug: `${root}-fat-pack-简中`,
        name: `${title} 肥散包（${lang}）`,
        priceJpy: roundYen(price / FAT_PACKS_PER_BOX),
        description: `${box.description || ""}\n补充包散装，约 ${FAT_PACKS_PER_BOX} 包/肥盒。`.trim(),
        stock: stock > 0 ? Math.max(FAT_PACKS_PER_BOX, stock * FAT_PACKS_PER_BOX) : 0,
      },
      {
        boxType: "肥原箱",
        slug: `${root}-fat-case-简中`,
        name: `${title} 肥原箱（${lang}）`,
        priceJpy: price * BOXES_PER_CASE,
        description: `${box.description || ""}\n肥盒原箱，约 ${BOXES_PER_CASE} 盒/箱。`.trim(),
        stock: Math.floor(stock / BOXES_PER_CASE),
      },
    ]);
  }

  const slimBoxes = db
    .prepare(
      `SELECT id, slug, name, series, language, category, description, priceJpy, stock, images,
              shippingDays, isPreorder, releaseDate, status
       FROM Product
       WHERE boxType = '瘦盒'
         AND status = '上架'
         AND (series LIKE '剑&盾 %' OR series LIKE '太阳&月亮 %')`
    )
    .all();

  for (const box of slimBoxes) {
    const title = displayTitle(box.name);
    const lang = box.language || "简中";
    const price = Number(box.priceJpy);
    const stock = Number(box.stock) || 0;
    const root = baseSlug(box.slug);

    createVariants(box, [
      {
        boxType: "瘦散包",
        slug: `${root}-slim-pack-简中`,
        name: `${title} 瘦散包（${lang}）`,
        priceJpy: roundYen(price / SLIM_PACKS_PER_BOX),
        description: `${box.description || ""}\n强化包散装，约 ${SLIM_PACKS_PER_BOX} 包/瘦盒。`.trim(),
        stock: stock > 0 ? Math.max(SLIM_PACKS_PER_BOX, stock * SLIM_PACKS_PER_BOX) : 0,
      },
      {
        boxType: "瘦原箱",
        slug: `${root}-slim-case-简中`,
        name: `${title} 瘦原箱（${lang}）`,
        priceJpy: price * BOXES_PER_CASE,
        description: `${box.description || ""}\n瘦盒原箱，约 ${BOXES_PER_CASE} 盒/箱。`.trim(),
        stock: Math.floor(stock / BOXES_PER_CASE),
      },
    ]);
  }
});

tx();
db.close();

console.log(`[pokemon-formats] 完成：新建 ${created}，已存在跳过 ${skipped}`);
