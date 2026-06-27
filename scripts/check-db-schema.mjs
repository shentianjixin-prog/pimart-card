import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dbPath = process.argv[2] || join(root, "prisma", "data", "initial.db");
const db = new Database(dbPath, { readonly: true });
const cols = db.prepare("PRAGMA table_info(Product)").all();
console.log("DB:", dbPath);
console.log("Product columns:", cols.map((c) => c.name).join(", "));
db.close();
