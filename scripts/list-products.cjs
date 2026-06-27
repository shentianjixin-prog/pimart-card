const { PrismaClient } = require("../src/generated/prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const p = new PrismaClient({ adapter });
p.product.findMany({
  select: { id: true, name: true, category: true, boxType: true, priceJpy: true, stock: true, isPreorder: true, images: true }
}).then(rows => {
  console.log(JSON.stringify(rows, null, 2));
  return p.$disconnect();
}).catch(e => { console.error(e); process.exit(1); });
