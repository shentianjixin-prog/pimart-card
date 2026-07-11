/**
 * 生产库：补语言、强制上架、OPC 主图路径切到 v2（破缓存）。
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
  console.warn(`[ensure-catalog] 数据库不存在，跳过: ${dbPath}`);
  process.exit(0);
}

const IMAGE_RENAMES = [
  ["/products/opc-01-box.jpg", "/products/opc-01-box-v2.jpg"],
  ["/products/opc-02-box.jpg", "/products/opc-02-box-v2.jpg"],
  ["/products/opc-07-box.webp", "/products/opc-07-box-v2.jpg"],
  ["/products/opc-07-box-v2.webp", "/products/opc-07-box-v2.jpg"],
  ["/products/opc-04-box.jpg", "/products/opc-04-box-v2.jpg"],
  ["/products/opc-05-box.jpg", "/products/opc-05-box-v2.jpg"],
  ["/products/opc-06-box.jpg", "/products/opc-06-box-v2.jpg"],
  ["/products/opc-07-box.jpg", "/products/opc-07-box-v2.jpg"],
  ["/products/opc-10-box.jpg", "/products/opc-10-box-v2.jpg"],
  ["/products/opc-15-box.png", "/products/opc-15-box-v2.png"],
  ["/products/opc-15-box.webp", "/products/opc-15-box-v2.webp"],
];

const db = new Database(dbPath);

const listed = db
  .prepare(`UPDATE Product SET status = '上架', updatedAt = datetime('now') WHERE status IS NULL OR status != '上架'`)
  .run();

const lang = db
  .prepare(
    `UPDATE Product
     SET language = '简中', updatedAt = datetime('now')
     WHERE (language IS NULL OR trim(language) = '')
       AND (name LIKE '%简中%' OR name LIKE '%（简中）%')`
  )
  .run();

let imgRows = 0;
const rows = db.prepare(`SELECT id, images FROM Product WHERE images LIKE '%opc-%'`).all();
const updImg = db.prepare(`UPDATE Product SET images = ?, updatedAt = datetime('now') WHERE id = ?`);
for (const row of rows) {
  let next = row.images || "";
  for (const [from, to] of IMAGE_RENAMES) {
    next = next.split(from).join(to);
  }
  if (next !== row.images) {
    updImg.run(next, row.id);
    imgRows += 1;
  }
}

console.log(`[ensure-catalog] 上架 ${listed.changes} · 语言 ${lang.changes} · 图片路径 ${imgRows}`);
db.close();
