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

const buybackTable = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='BuybackRequest'")
  .get();

if (!buybackTable) {
  db.exec(`
    CREATE TABLE "BuybackRequest" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "orderNo" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "nameKana" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "payload" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'new',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX "BuybackRequest_orderNo_key" ON "BuybackRequest"("orderNo");
  `);
  console.log("[schema] BuybackRequest 表已创建");
} else {
  const buybackCols = new Set(
    db.prepare('PRAGMA table_info("BuybackRequest")').all().map((row) => row.name)
  );
  if (!buybackCols.has("orderNo") || !buybackCols.has("payload")) {
    db.exec(`
      CREATE TABLE "new_BuybackRequest" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "orderNo" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "nameKana" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "payload" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'new',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    const legacyRows = db.prepare('SELECT * FROM "BuybackRequest"').all();
    const insert = db.prepare(`
      INSERT INTO "new_BuybackRequest"
      ("id", "orderNo", "name", "nameKana", "email", "payload", "status", "createdAt")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const row of legacyRows) {
      const orderNo = `PIM-LEGACY-${String(row.id).slice(0, 8)}`;
      const payload = row.message
        ? JSON.stringify({ message: row.message, legacy: true })
        : JSON.stringify({ legacy: true });
      insert.run(
        row.id,
        orderNo,
        row.name,
        row.nameKana,
        row.email,
        payload,
        row.status || "new",
        row.createdAt
      );
    }
    db.exec('DROP TABLE "BuybackRequest";');
    db.exec('ALTER TABLE "new_BuybackRequest" RENAME TO "BuybackRequest";');
    db.exec('CREATE UNIQUE INDEX IF NOT EXISTS "BuybackRequest_orderNo_key" ON "BuybackRequest"("orderNo");');
    console.log("[schema] BuybackRequest 表已升级为承諾書结构");
  }
}

const customerTable = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Customer'")
  .get();

if (!customerTable) {
  db.exec(`
    CREATE TABLE "Customer" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "nameKana" TEXT,
      "phone" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
    CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
  `);
  console.log("[schema] Customer 表已创建");
}

const orderCols = new Set(
  db.prepare('PRAGMA table_info("Order")').all().map((row) => row.name)
);
if (!orderCols.has("customerId")) {
  db.exec('ALTER TABLE "Order" ADD COLUMN "customerId" TEXT;');
  console.log("[schema] Order.customerId 已添加");
}

const resetTable = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='PasswordResetToken'")
  .get();

if (!resetTable) {
  db.exec(`
    CREATE TABLE "PasswordResetToken" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "customerId" TEXT NOT NULL,
      "token" TEXT NOT NULL,
      "expiresAt" DATETIME NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "PasswordResetToken_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");
  `);
  console.log("[schema] PasswordResetToken 表已创建");
}

db.close();
