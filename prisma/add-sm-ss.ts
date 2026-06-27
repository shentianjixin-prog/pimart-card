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

const products = [
  // ══ 太阳&月亮 时代 补充包（SM，2022-2023）══════════════════════
  {
    name: "横空出世 赫 BOX（简中）",
    category: "宝可梦原盒",
    series: "太阳&月亮 CSM1a",
    priceJpy: 7500,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 太阳&月亮 横空出世 赫（CSM1aC），2022年10月28日发售，简中初代首发。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2022-10-28"),
  },
  {
    name: "横空出世 苍 BOX（简中）",
    category: "宝可梦原盒",
    series: "太阳&月亮 CSM1b",
    priceJpy: 7500,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 太阳&月亮 横空出世 苍（CSM1bC），2022年10月28日发售，简中初代首发。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2022-10-28"),
  },
  {
    name: "横空出世 泽 BOX（简中）",
    category: "宝可梦原盒",
    series: "太阳&月亮 CSM1c",
    priceJpy: 7500,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 太阳&月亮 横空出世 泽（CSM1cC），2022年10月28日发售，简中初代首发。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2022-10-28"),
  },
  {
    name: "SM 强化包 第一弹 BOX（简中）",
    category: "宝可梦原盒",
    series: "太阳&月亮 CSM1.5",
    priceJpy: 5500,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 太阳&月亮 强化包 第一弹（CSM1.5C），6张/包 × 20包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2023-03-01"),
  },
  {
    name: "交相辉映 沐 BOX（简中）",
    category: "宝可梦原盒",
    series: "太阳&月亮 CSM2a",
    priceJpy: 7000,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 太阳&月亮 交相辉映 沐（CSM2aC），2023年1月18日发售。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2023-01-18"),
  },
  {
    name: "交相辉映 魁 BOX（简中）",
    category: "宝可梦原盒",
    series: "太阳&月亮 CSM2b",
    priceJpy: 7000,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 太阳&月亮 交相辉映 魁（CSM2bC），2023年1月18日发售。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2023-01-18"),
  },
  {
    name: "交相辉映 唤 BOX（简中）",
    category: "宝可梦原盒",
    series: "太阳&月亮 CSM2c",
    priceJpy: 7000,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 太阳&月亮 交相辉映 唤（CSM2cC），2023年1月18日发售。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2023-01-18"),
  },
  {
    name: "SM 强化包 第二弹 BOX（简中）",
    category: "宝可梦原盒",
    series: "太阳&月亮 CSM2.5",
    priceJpy: 5500,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 太阳&月亮 强化包 第二弹（CSM2.5C），6张/包 × 20包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2023-05-01"),
  },

  // ══ 剑&盾 时代 主力补充包（SS，2023-2024）══════════════════════
  {
    name: "极巨争锋 雷 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS1a",
    priceJpy: 4800,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 极巨争锋 雷（CS1aC），2023年5月19日发售，5张/包×30包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2023-05-19"),
  },
  {
    name: "极巨争锋 焰 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS1b",
    priceJpy: 4800,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 极巨争锋 焰（CS1bC），2023年5月19日发售，5张/包×30包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2023-05-19"),
  },
  {
    name: "极巨攻防 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS1.5",
    priceJpy: 3800,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 强化包 极巨攻防（CS1.5C），6张/包×20包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2023-07-01"),
  },
  {
    name: "浓墨重彩 黎 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS2a",
    priceJpy: 4800,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 浓墨重彩 黎（CS2aC），2023年8月18日发售，5张/包×30包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2023-08-18"),
  },
  {
    name: "浓墨重彩 靛 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS2b",
    priceJpy: 4800,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 浓墨重彩 靛（CS2bC），2023年8月18日发售，5张/包×30包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2023-08-18"),
  },
  {
    name: "璀璨反击 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS2.5",
    priceJpy: 3800,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 强化包 璀璨反击（CS2.5C），6张/包×20包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2023-10-01"),
  },
  {
    name: "洪荒演武 茂 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS3a",
    priceJpy: 5000,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 洪荒演武 茂（CS3aC），2023年11月17日发售，5张/包×30包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2023-11-17"),
  },
  {
    name: "洪荒演武 激 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS3b",
    priceJpy: 5000,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 洪荒演武 激（CS3bC），2023年11月17日发售，5张/包×30包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2023-11-17"),
  },
  {
    name: "怒炎灼天 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS3.5",
    priceJpy: 3800,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 强化包 怒炎灼天（CS3.5C），6张/包×20包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2024-01-01"),
  },
  {
    name: "九彩汇聚 朋 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS4a",
    priceJpy: 5200,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 九彩汇聚 朋（CS4aC），2024年3月1日发售，5张/包×30包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2024-03-01"),
  },
  {
    name: "九彩汇聚 源 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS4b",
    priceJpy: 5200,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 九彩汇聚 源（CS4bC），2024年3月1日发售，5张/包×30包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2024-03-01"),
  },
  {
    name: "终末炎舞 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS4.5",
    priceJpy: 3800,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 强化包 终末炎舞（CS4.5C），6张/包×20包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2024-04-01"),
  },
  {
    name: "勇魅群星 魅 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS5a",
    priceJpy: 5400,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 勇魅群星 魅（CS5aC），2024年6月18日发售，5张/包×30包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2024-06-18"),
  },
  {
    name: "勇魅群星 勇 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS5b",
    priceJpy: 5400,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 勇魅群星 勇（CS5bC），2024年6月18日发售，5张/包×30包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2024-06-18"),
  },
  {
    name: "暗影夺辉 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS5.5",
    priceJpy: 3800,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 强化包 暗影夺辉（CS5.5C），6张/包×20包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2024-07-01"),
  },
  {
    name: "碧海暗影 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS6a",
    priceJpy: 5800,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 碧海暗影（CS6aC），2024年9月20日发售，SS 时代最终弹，5张/包×30包/盒。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2024-09-20"),
  },
  {
    name: "胜象星引 BOX（简中）",
    category: "宝可梦原盒",
    series: "剑&盾 CS6.5",
    priceJpy: 3800,
    stock: 0,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 剑&盾 强化包 胜象星引（CS6.5C），6张/包×20包/盒，SS 时代末代强化包。",
    featured: false, isPreorder: false, shippingDays: 6,
    releaseDate: new Date("2024-11-01"),
  },
];

async function main() {
  let created = 0, skipped = 0;

  for (const p of products) {
    const slug = slugify(p.name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      console.log(`跳过（已存在）：${p.name}`);
      skipped++;
    } else {
      await prisma.product.create({ data: { ...p, slug } });
      console.log(`✅ 写入：${p.name}  ¥${p.priceJpy}`);
      created++;
    }
  }

  console.log(`\n完成：新增 ${created} 件，跳过 ${skipped} 件。`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
