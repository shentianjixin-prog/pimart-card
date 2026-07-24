/**
 * 一次性：把 username='admin' 的后台管理员密码重置为用户指定的新密码。
 * 通过 Volume 标记文件保证只执行一次，避免每次 redeploy 都强制改回这个密码
 * （万一之后在后台改了别的密码，不会被这个脚本覆盖）。
 *
 * 只存 bcrypt 哈希，不在仓库里保留明文密码。
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

const marker = join(dataDir, ".admin-pw-reset-v1");
const force = process.env.FORCE_ADMIN_PW_RESET === "1";

if (!force && existsSync(marker)) {
  console.log(`[admin-pw-reset] 已执行过，跳过（删除 ${marker} 或设 FORCE_ADMIN_PW_RESET=1 可重跑）`);
  process.exit(0);
}

if (!existsSync(dbPath)) {
  console.warn(`[admin-pw-reset] 数据库不存在，跳过: ${dbPath}`);
  process.exit(0);
}

const NEW_HASH = "$2b$10$oGUdsLYwtoMqv4qgpH8T2ehS7gqni9q3eespaRFTUjCg4TTGsjVc2";

const db = new Database(dbPath);
const info = db
  .prepare(`UPDATE AdminUser SET passwordHash = ? WHERE username = 'admin'`)
  .run(NEW_HASH);

writeFileSync(marker, new Date().toISOString() + "\n", "utf8");
console.log(`[admin-pw-reset] 已更新 ${info.changes} 个管理员账号密码`);
db.close();
