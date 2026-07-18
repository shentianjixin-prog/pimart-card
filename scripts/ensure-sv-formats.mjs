/**
 * 为简中朱・紫 CSV 补充包补齐规格 SKU（幂等）：
 * 瘦盒 / 肥散包 / 瘦散包 / 肥原箱 / 瘦原箱
 *
 * 规则（官网 + 集换社市场叫法）：
 * - 肥盒 = 20张装整盒（6 包/盒）——已有
 * - 瘦盒 = 5张装整盒（15 包/盒）≈ 肥盒价 / 2
 * - 散包按盒内包数拆分；原箱按约 20 盒/箱
 */
import Database from "better-sqlite3";
import { existsSync } from "fs";
import { randomUUID } from "crypto";

const FAT_PACKS_PER_BOX = 6;
const SLIM_PACKS_PER_BOX = 15;
const BOXES_PER_CASE = 20;

const url = process.env.DATABASE_URL || "file:./prisma/data/initial.db";
const dbPath = url.startsWith("file:") ? url.slice(5) : url;

if (!existsSync(dbPath)) {
  console.warn(`[sv-formats] 数据库不存在，跳过: ${dbPath}`);
  process.exit(0);
}

const db = new Database(dbPath);

const fatBoxes = db
  .prepare(
    `SELECT id, slug, name, series, language, category, description, priceJpy, stock, images,
            shippingDays, isPreorder, releaseDate, status, featured
     FROM Product
     WHERE boxType = '肥盒'
       AND series LIKE '朱・紫 CSV%'
       AND status = '上架'`
  )
  .all();

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

function setTitle(name, series) {
  const fromSeries = String(series || "").replace(/^朱・紫\s+CSV\d+c\s*/i, "").trim();
  if (fromSeries) return fromSeries;
  return String(name || "")
    .replace(/^补充包\s*/, "")
    .replace(/\s*肥盒\s*/, " ")
    .replace(/\s*瘦盒\s*/, " ")
    .replace(/\s*BOX.*$/i, "")
    .replace(/（简中）$/, "")
    .trim();
}

function csvCode(series) {
  const m = String(series || "").match(/CSV\d+c/i);
  return m ? m[0].toUpperCase().replace("C", "c").replace(/CSV(\d+)C/i, (_, n) => `CSV${n}c`) : "CSV";
}

function officialFormatImage(code, boxType, fallback) {
  const match = String(code).match(/CSV(\d+)C?/i);
  if (!match || Number(match[1]) < 2 || Number(match[1]) > 10) return fallback;
  const format = String(boxType).includes("瘦") ? "slim" : "fat";
  return `/products/csv${match[1]}c-${format}.png`;
}

let created = 0;
let skipped = 0;
const now = new Date().toISOString();

const tx = db.transaction(() => {
  for (const box of fatBoxes) {
    const title = setTitle(box.name, box.series);
    const code = csvCode(box.series);
    const lang = box.language || "简中";
    const fatPrice = Number(box.priceJpy);
    const slimPrice = roundYen(fatPrice / 2);
    const baseSlug = String(box.slug)
      .replace(/-fat-box-简中$/i, "")
      .replace(/-box-简中$/i, "")
      .replace(/-box$/i, "");

    const fatStock = Number(box.stock) || 0;

    const variants = [
      {
        boxType: "瘦盒",
        slug: `${baseSlug}-slim-box-简中`,
        name: `补充包 ${title} 瘦盒 BOX（${lang}）`,
        priceJpy: slimPrice,
        description: `${box.description || ""}\n官网/集换社：5张装整盒（约 ${SLIM_PACKS_PER_BOX} 包/盒），与肥盒同弹配对。`.trim(),
        stock: fatStock > 0 ? fatStock : 0,
      },
      {
        boxType: "肥散包",
        slug: `${baseSlug}-fat-pack-简中`,
        name: `补充包 ${title} 肥散包（${lang}）`,
        priceJpy: roundYen(fatPrice / FAT_PACKS_PER_BOX),
        description: `${box.description || ""}\n20张装散包，约 ${FAT_PACKS_PER_BOX} 包/肥盒。`.trim(),
        stock: fatStock > 0 ? Math.max(FAT_PACKS_PER_BOX, fatStock * FAT_PACKS_PER_BOX) : 0,
      },
      {
        boxType: "瘦散包",
        slug: `${baseSlug}-slim-pack-简中`,
        name: `补充包 ${title} 瘦散包（${lang}）`,
        priceJpy: roundYen(slimPrice / SLIM_PACKS_PER_BOX),
        description: `${box.description || ""}\n5张装散包，约 ${SLIM_PACKS_PER_BOX} 包/瘦盒。`.trim(),
        stock: fatStock > 0 ? Math.max(SLIM_PACKS_PER_BOX, fatStock * SLIM_PACKS_PER_BOX) : 0,
      },
      {
        boxType: "肥原箱",
        slug: `${baseSlug}-fat-case-简中`,
        name: `补充包 ${title} 肥原箱（${lang}）`,
        priceJpy: fatPrice * BOXES_PER_CASE,
        description: `${box.description || ""}\n肥盒原箱，约 ${BOXES_PER_CASE} 盒/箱。`.trim(),
        stock: Math.floor(fatStock / BOXES_PER_CASE),
      },
      {
        boxType: "瘦原箱",
        slug: `${baseSlug}-slim-case-简中`,
        name: `补充包 ${title} 瘦原箱（${lang}）`,
        priceJpy: slimPrice * BOXES_PER_CASE,
        description: `${box.description || ""}\n瘦盒原箱，约 ${BOXES_PER_CASE} 盒/箱。`.trim(),
        stock: Math.floor(fatStock / BOXES_PER_CASE),
      },
    ];

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
        images: officialFormatImage(code, v.boxType, box.images),
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
      console.log(`[sv-formats] 已创建 ${v.boxType}: ${v.slug} (${code})`);
    }
  }
});

tx();
db.close();

console.log(`[sv-formats] 完成：新建 ${created}，已存在跳过 ${skipped}，基准肥盒 ${fatBoxes.length}`);
