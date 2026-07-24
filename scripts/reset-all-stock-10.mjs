/**
 * 一次性：全部商品库存设为 10，状态设为上架。
 * 通过 Volume 标记文件保证只执行一次，避免每次 redeploy 冲掉真实库存。
 *
 * 说明：本脚本复制自 reset-all-stock-100.mjs，仅把库存目标值从 100 改为 10，
 * marker 文件名也换成新的（.stock-reset-10-v1），避免与旧的 100 版本 marker
 * 冲突，从而作为一次全新的一次性操作执行。
 */
import Database from "better-sqlite3";
import { existsSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const url = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = url.startsWith("file:") ? url.slice(5) : url;

const dataDir =
  process.env.RAILWAY_VOLUME_MOUNT_PATH ||
  (dbPath.includes("/data/") || dbPath.startsWith("/data")
    ? dirname(dbPath)
    : root);

const marker = join(dataDir, ".stock-reset-10-v1");
const force = process.env.FORCE_STOCK_RESET === "1";

if (!force && existsSync(marker)) {
  console.log(`[stock-reset] 已执行过，跳过（删除 ${marker} 或设 FORCE_STOCK_RESET=1 可重跑）`);
  process.exit(0);
}

if (!existsSync(dbPath)) {
  console.warn(`[stock-reset] 数据库不存在，跳过: ${dbPath}`);
  process.exit(0);
}

const db = new Database(dbPath);
const info = db
  .prepare(
    `UPDATE Product
     SET stock = 10,
         status = '上架',
         updatedAt = datetime('now')`
  )
  .run();

writeFileSync(marker, new Date().toISOString() + "\n", "utf8");
console.log(`[stock-reset] 已更新 ${info.changes} 件商品：stock=10，status=上架`);
db.close();
