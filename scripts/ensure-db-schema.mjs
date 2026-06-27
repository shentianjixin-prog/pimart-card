/**
 * 启动前补齐 SQLite 缺失列，避免 Volume 旧库与 Prisma schema 不一致导致 502。
 * 幂等：已存在的列会跳过。
 */
import Database from "better-sqlite3";
import { existsSync } from "fs";

const url = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = url.startsWith("file:") ? url.slice(5) : url;

if (!existsSync(dbPath)) {
  console.warn(`[schema] 数据库不存在，跳过: ${dbPath}`);
  process.exit(0);
}

/** @type {{ name: string; ddl: string }[]} */
const PRODUCT_COLUMNS = [
  { name: "series", ddl: 'ALTER TABLE "Product" ADD COLUMN "series" TEXT' },
  { name: "boxType", ddl: 'ALTER TABLE "Product" ADD COLUMN "boxType" TEXT NOT NULL DEFAULT \'\'' },
  { name: "featured", ddl: 'ALTER TABLE "Product" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false' },
  { name: "isPreorder", ddl: 'ALTER TABLE "Product" ADD COLUMN "isPreorder" BOOLEAN NOT NULL DEFAULT false' },
  { name: "shippingDays", ddl: 'ALTER TABLE "Product" ADD COLUMN "shippingDays" INTEGER NOT NULL DEFAULT 6' },
  { name: "releaseDate", ddl: 'ALTER TABLE "Product" ADD COLUMN "releaseDate" DATETIME' },
  { name: "cardNumber", ddl: 'ALTER TABLE "Product" ADD COLUMN "cardNumber" TEXT' },
  { name: "rarity", ddl: 'ALTER TABLE "Product" ADD COLUMN "rarity" TEXT' },
  { name: "language", ddl: 'ALTER TABLE "Product" ADD COLUMN "language" TEXT' },
  { name: "costPrice", ddl: 'ALTER TABLE "Product" ADD COLUMN "costPrice" INTEGER' },
  { name: "marketRefPrice", ddl: 'ALTER TABLE "Product" ADD COLUMN "marketRefPrice" INTEGER' },
  { name: "minPrice", ddl: 'ALTER TABLE "Product" ADD COLUMN "minPrice" INTEGER' },
  { name: "status", ddl: 'ALTER TABLE "Product" ADD COLUMN "status" TEXT NOT NULL DEFAULT \'上架\'' },
  { name: "researchStatus", ddl: 'ALTER TABLE "Product" ADD COLUMN "researchStatus" TEXT' },
  { name: "priceUpdatedAt", ddl: 'ALTER TABLE "Product" ADD COLUMN "priceUpdatedAt" DATETIME' },
];

const db = new Database(dbPath);
const existing = new Set(
  db.prepare('PRAGMA table_info("Product")').all().map((row) => row.name)
);

let added = 0;
for (const col of PRODUCT_COLUMNS) {
  if (existing.has(col.name)) continue;
  db.exec(col.ddl);
  console.log(`[schema] Product.${col.name} 已添加`);
  added += 1;
}

if (added === 0) {
  console.log("[schema] Product 表结构已是最新");
} else {
  console.log(`[schema] 共补齐 ${added} 个字段`);
}

db.close();
