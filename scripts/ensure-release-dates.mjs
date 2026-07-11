/**
 * 回填 releaseDate：OPC 用官方发售日；其余用 createdAt，避免 SQLite DESC 时 NULL 排最前。
 */
import Database from "better-sqlite3";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const url = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = url.startsWith("file:") ? url.slice(5) : url;

if (!existsSync(dbPath)) {
  console.warn(`[release-dates] 数据库不存在，跳过: ${dbPath}`);
  process.exit(0);
}

/** 从 opc-set-specs.ts 提取 OPC-XX → YYYY-MM-DD */
function loadOpcReleaseDates() {
  const text = readFileSync(join(root, "src", "lib", "opc-set-specs.ts"), "utf8");
  const map = {};
  const blockRe = /"(OPC-\d+)"\s*:\s*\{([\s\S]*?)\n  \},/g;
  let m;
  while ((m = blockRe.exec(text))) {
    const code = m[1];
    const body = m[2];
    const dm = body.match(/releaseDate:\s*"(\d{4}-\d{2}-\d{2})"/);
    if (dm) map[code] = dm[1];
  }
  return map;
}

function opcCodeFromRow(series, name, slug) {
  const blob = `${series || ""} ${name || ""} ${slug || ""}`;
  const m = blob.match(/OPC-(\d{1,2})/i) || blob.match(/opc-(\d{1,2})/i);
  if (!m) return null;
  return `OPC-${String(m[1]).padStart(2, "0")}`;
}

const opcDates = loadOpcReleaseDates();
console.log(`[release-dates] OPC 规格发售日 ${Object.keys(opcDates).length} 条`);

const db = new Database(dbPath);
const rows = db
  .prepare(`SELECT id, name, slug, series, releaseDate, createdAt FROM Product`)
  .all();

const upd = db.prepare(
  `UPDATE Product SET releaseDate = ?, updatedAt = datetime('now') WHERE id = ?`
);

let filled = 0;
let touched = 0;
const tx = db.transaction(() => {
  for (const row of rows) {
    const code = opcCodeFromRow(row.series, row.name, row.slug);
    let next = null;
    if (code && opcDates[code]) {
      next = `${opcDates[code]}T00:00:00.000Z`;
    } else if (row.releaseDate) {
      continue;
    } else if (row.createdAt) {
      // 无官方发售日：用创建日，保证非 NULL
      const d = String(row.createdAt).slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) next = `${d}T00:00:00.000Z`;
    }
    if (!next) continue;
    // 已有且相同则跳过；OPC 以规格为准覆盖
    const cur = row.releaseDate ? String(row.releaseDate).slice(0, 10) : "";
    const want = next.slice(0, 10);
    if (cur === want && !(code && opcDates[code])) continue;
    if (code && opcDates[code] && cur === want) continue;
    upd.run(next, row.id);
    touched += 1;
    if (code) filled += 1;
  }
});
tx();

console.log(`[release-dates] 更新 ${touched} 件（其中 OPC 规格 ${filled}）`);
db.close();
