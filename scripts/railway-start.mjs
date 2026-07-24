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
  execSync(`node ${join(root, "scripts", "ensure-opc-formats.mjs")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] OPC 规格补齐失败:", err);
}

try {
  execSync(`node ${join(root, "scripts", "ensure-sv-formats.mjs")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] 朱紫肥瘦/散包/原箱补齐失败:", err);
}

try {
  execSync(`node ${join(root, "scripts", "ensure-pokemon-formats.mjs")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] 宝石包/日月剑盾散包原箱补齐失败:", err);
}

try {
  execSync(`node ${join(root, "scripts", "ensure-product-listing.mjs")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] 上架/slug 修正失败:", err);
}

try {
  execSync(`node ${join(root, "scripts", "ensure-catalog-fixes.mjs")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] 目录修复失败:", err);
}

try {
  execSync(`node ${join(root, "scripts", "ensure-catalog-completeness.mjs")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] 151 / 航海王官方目录补全失败:", err);
}

try {
  execSync(`node ${join(root, "scripts", "ensure-release-dates.mjs")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] 发售日回填失败:", err);
}

try {
  // 优先用已导出的 JSON 目录（不依赖 openpyxl），写入 Volume DATABASE_URL
  execSync(`node ${join(root, "scripts", "sync-from-website-catalog.mjs")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] website-catalog.json 同步失败:", err);
}

try {
  // 本地/有 openpyxl 时再按 xlsx 覆盖（桌面表优先）
  execSync(`python3 ${join(root, "scripts", "sync-from-website-xlsx.py")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] 网站数据表 xlsx 同步跳过（无 openpyxl/表格时正常）:", err?.message || err);
}

try {
  // 礼盒/STC/EBC 图位与系列规格二次校准
  execSync(`python3 ${join(root, "scripts", "fix-listing-images-and-specs.py")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] 上架图/规格校准失败:", err?.message || err);
}

try {
  execSync(`node ${join(root, "scripts", "sync-product-images.mjs")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] 图片路径同步失败:", err);
}

try {
  // 必须放在 sync-from-website-xlsx.py / website-catalog 同步之后：
  // 那两步会用表格里的库存列覆盖 stock，若这个重置脚本排在它们前面，
  // 刚设置的 stock 会在同一次部署里被立刻覆盖掉。
  execSync(`node ${join(root, "scripts", "reset-all-stock-10.mjs")}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("[railway] 库存重置失败:", err);
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
