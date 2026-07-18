/** Read-only acceptance audit for the 151 / One Piece catalog migration. */
import Database from "better-sqlite3";
import { existsSync } from "fs";

const url = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = url.startsWith("file:") ? url.slice(5) : url;
if (!existsSync(dbPath)) throw new Error(`Database not found: ${dbPath}`);

const db = new Database(dbPath, { readonly: true });
const editions151 = db.prepare(`
  SELECT series, COUNT(*) AS count, COUNT(DISTINCT boxType) AS formats
  FROM Product WHERE series LIKE '收集啦151 %'
  GROUP BY series ORDER BY series
`).all();
const opc = db.prepare(`
  SELECT substr(series, 1, 6) AS code, COUNT(*) AS count, min(releaseDate) AS releaseDate
  FROM Product WHERE series GLOB 'OPC-[0-9][0-9] *'
  GROUP BY substr(series, 1, 6) ORDER BY code
`).all();
const pending = db.prepare(`
  SELECT COUNT(*) AS count FROM Product
  WHERE priceJpy = 0 AND stock = 0 AND researchStatus LIKE '%价格待人工复核%'
`).get();

const expected151 = new Set(["收集啦151 旅", "收集啦151 望", "收集啦151 惊", "收集啦151 聚"]);
if (editions151.length !== 4 || editions151.some((row) => !expected151.has(row.series) || row.formats !== 6)) {
  throw new Error(`151 catalog audit failed: ${JSON.stringify(editions151)}`);
}
if (opc.length !== 16 || opc.some((row) => row.count < 3)) {
  throw new Error(`One Piece OPC audit failed: ${JSON.stringify(opc)}`);
}

console.log(JSON.stringify({ editions151, opc, pendingPriceProducts: pending.count }, null, 2));
db.close();
