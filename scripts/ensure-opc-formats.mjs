/**
 * 为海贼王 OPC 原盒补齐「散包 / 原箱」SKU（幂等）。
 * 简中 OPC 惯例：24 包/盒，12 盒/箱。价格按原盒推算，库存默认 0（后台可改）。
 */
import Database from "better-sqlite3";
import { existsSync } from "fs";
import { randomUUID } from "crypto";

const PACKS_PER_BOX = 24;
const BOXES_PER_CASE = 12;

const url = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = url.startsWith("file:") ? url.slice(5) : url;

if (!existsSync(dbPath)) {
  console.warn(`[opc-formats] 数据库不存在，跳过: ${dbPath}`);
  process.exit(0);
}

const db = new Database(dbPath);

const boxes = db
  .prepare(
    `SELECT id, slug, name, series, language, category, description, priceJpy, stock, images,
            shippingDays, isPreorder, releaseDate, status, featured
     FROM Product
     WHERE boxType = '原盒'
       AND series LIKE 'OPC-%'
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

let created = 0;
let skipped = 0;
const now = new Date().toISOString();

const tx = db.transaction(() => {
  for (const box of boxes) {
    const baseSlug = String(box.slug).replace(/-box$/i, "");
    const seriesTitle = String(box.series || "").replace(/^OPC-\d+\s*/, "").trim();
    const code = String(box.series || "").match(/^(OPC-\d+)/i)?.[1]?.toUpperCase() || "OPC";

    const boxStock = Number(box.stock) || 0;
    const boxPrice = Number(box.priceJpy) || 0;

    const variants = [
      {
        boxType: "散包",
        slug: `${baseSlug}-pack`,
        name: `${code} ${seriesTitle} 散包（${box.language || "简中"}）`.replace(/\s+/g, " ").trim(),
        priceJpy: Math.max(100, Math.round(boxPrice / PACKS_PER_BOX)),
        description: `${box.description || ""}\n单包散装，约 ${PACKS_PER_BOX} 包/盒。`.trim(),
        stock: boxStock > 0 ? Math.max(PACKS_PER_BOX, boxStock * 4) : 0,
      },
      {
        boxType: "原箱",
        slug: `${baseSlug}-case`,
        name: `${code} ${seriesTitle} 原箱（${box.language || "简中"}）`.replace(/\s+/g, " ").trim(),
        priceJpy: boxPrice * BOXES_PER_CASE,
        description: `${box.description || ""}\n原箱整件，约 ${BOXES_PER_CASE} 盒/箱。`.trim(),
        stock: Math.floor(boxStock / BOXES_PER_CASE),
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
        category: box.category || "海贼王",
        series: box.series,
        language: box.language,
        description: v.description,
        priceJpy: v.priceJpy,
        stock: v.stock,
        images: box.images,
        boxType: v.boxType,
        featured: box.featured ? 1 : 0,
        isPreorder: box.isPreorder ? 1 : 0,
        shippingDays: box.shippingDays ?? 6,
        releaseDate: box.releaseDate,
        status: box.status || "上架",
        createdAt: now,
        updatedAt: now,
      });
      created += 1;
      console.log(`[opc-formats] 已创建 ${v.boxType}: ${v.slug}`);
    }
  }
});

tx();
db.close();

console.log(`[opc-formats] 完成：新建 ${created}，已存在跳过 ${skipped}`);
