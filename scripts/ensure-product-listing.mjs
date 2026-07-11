/**
 * 生产库：确保全部上架，并修正异常日文 slug。
 * 每次启动幂等执行（仅改需要改的行）。
 */
import Database from "better-sqlite3";
import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const url = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = url.startsWith("file:") ? url.slice(5) : url;

if (!existsSync(dbPath)) {
  console.warn(`[ensure-listing] 数据库不存在，跳过: ${dbPath}`);
  process.exit(0);
}

const SLUG_RENAMES = [
  ["151-コレクタ-ズセット-简中", "151-collectors-set-简中", "151 收藏家套装（简中）"],
  ["ポケモンカ-ド151-box-简中", "pokemon-card-151-box-简中", "宝可梦卡 151 BOX（简中）"],
  ["火影忍者-コレクタブルカ-ド-スタ-タ-セット", "naruto-collectible-starter-set", "火影忍者 收藏卡入门套装"],
  ["スノ-ハザ-ド-クレイバ-スト-ダブルパック-简中", "sv2-double-pack-简中", "雪危险+泥土猛击 双包（简中）"],
];

const db = new Database(dbPath);

const listed = db
  .prepare(`UPDATE Product SET status = '上架', updatedAt = datetime('now') WHERE status IS NULL OR status != '上架'`)
  .run();
console.log(`[ensure-listing] 补上架 ${listed.changes} 件`);

let renamed = 0;
for (const [oldSlug, newSlug, newName] of SLUG_RENAMES) {
  const row = db.prepare(`SELECT id FROM Product WHERE slug = ?`).get(oldSlug);
  if (!row) continue;
  const conflict = db.prepare(`SELECT id FROM Product WHERE slug = ? AND id != ?`).get(newSlug, row.id);
  if (conflict) {
    console.warn(`[ensure-listing] slug 冲突，跳过 ${oldSlug} -> ${newSlug}`);
    continue;
  }
  db.prepare(
    `UPDATE Product SET slug = ?, name = ?, updatedAt = datetime('now') WHERE id = ?`
  ).run(newSlug, newName, row.id);
  renamed += 1;
  console.log(`[ensure-listing] rename ${oldSlug} -> ${newSlug}`);
}

console.log(`[ensure-listing] 完成，重命名 ${renamed} 件`);
db.close();
