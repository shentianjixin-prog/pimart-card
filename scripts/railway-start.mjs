import { copyFileSync, existsSync, mkdirSync } from "fs";
import { spawn, execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Railway 挂载 Volume 时自动设置；本地 Docker 测试可手动设为 /data
const dataDir = process.env.RAILWAY_VOLUME_MOUNT_PATH || "/data";
const dbPath = join(dataDir, "dev.db");
const initialDb = join(root, "prisma", "data", "initial.db");

mkdirSync(dataDir, { recursive: true });

if (!existsSync(dbPath)) {
  if (existsSync(initialDb)) {
    copyFileSync(initialDb, dbPath);
    console.log(`[railway] 已从快照初始化数据库: ${dbPath}`);
  } else {
    console.warn("[railway] 未找到 prisma/data/initial.db，将使用空库路径");
  }
} else {
  console.log(`[railway] 使用已有数据库: ${dbPath}`);
}

process.env.DATABASE_URL = `file:${dbPath}`;

try {
  execSync(`node ${join(root, "scripts", "ensure-db-schema.mjs")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] 数据库结构同步失败:", err);
  process.exit(1);
}

try {
  execSync(`node ${join(root, "scripts", "sync-product-images.mjs")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] 图片路径同步失败:", err);
}

const port = process.env.PORT || "3000";
console.log(`[railway] 启动 Next.js，端口 ${port}`);

const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, "start", "--hostname", "0.0.0.0", "-p", port], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 1));
