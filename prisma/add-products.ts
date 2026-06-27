import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9一-龯ぁ-んァ-ヶ]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const newProducts = [
  // ── 补充包 SV era ──────────────────────────────────────────
  {
    name: "奇迹启程 BOX（简中）",
    category: "宝可梦原盒",
    series: "朱・紫 CSV2c",
    priceJpy: 4800,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 朱&紫 奇迹启程（CSV2C）原盒，2025年3月21日发售，每盒30包，每包5张。",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: new Date("2025-03-21"),
  },
  {
    name: "无畏太晶 BOX（简中）",
    category: "宝可梦原盒",
    series: "朱・紫 CSV3c",
    priceJpy: 5000,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 朱&紫 无畏太晶（CSV3C）原盒，2025年5月16日发售，每盒30包，每包5张。",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: new Date("2025-05-16"),
  },
  {
    name: "嘉奖回合 BOX（简中）",
    category: "宝可梦原盒",
    series: "朱・紫 CSV4c",
    priceJpy: 5200,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 朱&紫 嘉奖回合（CSV4C）原盒，2025年7月18日发售，每盒30包，每包5张。",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: new Date("2025-07-18"),
  },
  {
    name: "真实玄虚 BOX（简中）",
    category: "宝可梦原盒",
    series: "朱・紫 CSV6c",
    priceJpy: 5600,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 朱&紫 真实玄虚（CSV6C）原盒，2025年11月7日发售，每盒30包，每包5张。",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: new Date("2025-11-07"),
  },
  {
    name: "璀璨诡幻 BOX（简中）",
    category: "宝可梦原盒",
    series: "朱・紫 CSV8c",
    priceJpy: 6000,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 朱&紫 璀璨诡幻（CSV8C）原盒，2026年3月13日发售，每盒30包，每包5张。",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: new Date("2026-03-13"),
  },
  // ── 宝石包 (CBB) ─────────────────────────────────────────
  {
    name: "宝石包第一弹 BOX（简中）",
    category: "宝可梦原盒",
    series: "宝石包",
    priceJpy: 9000,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 宝石包 第一弹（CBB1C）原盒，2025年1月17日发售，每盒15包，每包4张全闪。",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: new Date("2025-01-17"),
  },
  {
    name: "宝石包第二弹 BOX（简中）",
    category: "宝可梦原盒",
    series: "宝石包",
    priceJpy: 8500,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 宝石包 第二弹（CBB2C）原盒，2025年5月16日发售，每盒15包，每包4张全闪。",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: new Date("2025-05-16"),
  },
  {
    name: "宝石包第三弹 BOX（简中）",
    category: "宝可梦原盒",
    series: "宝石包",
    priceJpy: 8000,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 宝石包 第三弹（CBB3C）原盒，2025年9月26日发售，每盒15包，每包4张全闪。",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: new Date("2025-09-26"),
  },
  {
    name: "宝石包第四弹 BOX（简中）",
    category: "宝可梦原盒",
    series: "宝石包",
    priceJpy: 7600,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 宝石包 第四弹（CBB4C）原盒，2026年2月6日发售，每盒15包，每包4张全闪。",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: new Date("2026-02-06"),
  },
];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const p of newProducts) {
    const slug = slugify(p.name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      console.log(`跳过（已存在）：${p.name}`);
      skipped++;
    } else {
      await prisma.product.create({ data: { ...p, slug } });
      console.log(`已写入：${p.name}  slug=${slug}  ¥${p.priceJpy}`);
      created++;
    }
  }

  console.log(`\n完成：新增 ${created} 件，跳过 ${skipped} 件。`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
