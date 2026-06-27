import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const rows = await p.product.findMany({
  select: { id: true, name: true, category: true, boxType: true, priceJpy: true, stock: true, isPreorder: true, images: true }
});
console.log(JSON.stringify(rows, null, 2));
await p.$disconnect();
