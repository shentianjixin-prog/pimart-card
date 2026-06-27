import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

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
  {
    name: "朱・紫ex 強化拡張パック BOX（简中）",
    category: "宝可梦原盒",
    series: "朱・紫ex",
    priceJpy: 3200,
    stock: 10,
    images: "/products/placeholder.svg",
    description: "简中宝可梦卡牌游戏 朱・紫ex 强化扩展包原盒，现货发售。",
    featured: true,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: null,
  },
  {
    name: "151 コレクターズセット（简中）",
    category: "宝可梦原盒",
    series: "151",
    priceJpy: 12800,
    stock: 5,
    images: "/products/placeholder.svg",
    description: "简中宝可梦151收藏套装，现货发售。",
    featured: true,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: null,
  },
  {
    name: "ポケモンカード151 BOX（简中）",
    category: "宝可梦原盒",
    series: "151",
    priceJpy: 8500,
    stock: 20,
    images: "/products/placeholder.svg",
    description: "简中宝可梦151原盒，预售商品，预计2026年8月发货。",
    featured: false,
    isPreorder: true,
    shippingDays: 7,
    releaseDate: new Date("2026-08-01"),
  },
  {
    name: "朱・紫 黒炎の支配者 BOX（简中）",
    category: "宝可梦原盒",
    series: "朱・紫",
    priceJpy: 4200,
    stock: 8,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 朱・紫 黑炎的支配者原盒，现货发售。",
    featured: false,
    isPreorder: false,
    shippingDays: 5,
    releaseDate: null,
  },
  {
    name: "スノーハザード+クレイバースト ダブルパック（简中）",
    category: "宝可梦原盒",
    series: "朱・紫",
    priceJpy: 6800,
    stock: 15,
    images: "/products/placeholder.svg",
    description: "简中宝可梦 雪 Hazard + Clay Burst 双包套装，预售商品。",
    featured: false,
    isPreorder: true,
    shippingDays: 7,
    releaseDate: null,
  },
  {
    name: "NARUTOP99 ウエハース第1弾 BOX",
    category: "火影忍者",
    series: "NARUTOP99",
    priceJpy: 2800,
    stock: 12,
    images: "/products/placeholder.svg",
    description: "火影忍者 NARUTOP99 威化卡第1弹 BOX，现货发售。",
    featured: true,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: null,
  },
  {
    name: "火影忍者 疾風伝 カードウエハース BOX",
    category: "火影忍者",
    series: "疾風伝",
    priceJpy: 3500,
    stock: 6,
    images: "/products/placeholder.svg",
    description: "火影忍者疾风传卡牌威化 BOX，现货发售。",
    featured: false,
    isPreorder: false,
    shippingDays: 6,
    releaseDate: null,
  },
  {
    name: "火影忍者 コレクタブルカード スターターセット",
    category: "火影忍者",
    series: "疾風伝",
    priceJpy: 1500,
    stock: 30,
    images: "/products/placeholder.svg",
    description: "火影忍者收藏卡牌入门套装，预售商品。",
    featured: false,
    isPreorder: true,
    shippingDays: 7,
    releaseDate: null,
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  for (const p of products) {
    const slug = slugify(p.name);
    await prisma.product.create({
      data: { ...p, slug },
    });
  }

  const adminUsername = process.env.SEED_ADMIN_USERNAME || "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin123456";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: { passwordHash },
    create: { username: adminUsername, passwordHash },
  });

  console.log(`已写入 ${products.length} 个商品示例数据。`);
  console.log(`后台管理员账号：${adminUsername} / 密码：${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
