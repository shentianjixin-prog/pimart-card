-- AlterTable: 卡牌运营字段与上下架状态
-- boxType 若旧库已存在则跳过；Railway 启动脚本 scripts/ensure-db-schema.mjs 会幂等补齐
-- ALTER TABLE "Product" ADD COLUMN "boxType" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Product" ADD COLUMN "cardNumber" TEXT;
ALTER TABLE "Product" ADD COLUMN "rarity" TEXT;
ALTER TABLE "Product" ADD COLUMN "language" TEXT;
ALTER TABLE "Product" ADD COLUMN "costPrice" INTEGER;
ALTER TABLE "Product" ADD COLUMN "marketRefPrice" INTEGER;
ALTER TABLE "Product" ADD COLUMN "minPrice" INTEGER;
ALTER TABLE "Product" ADD COLUMN "status" TEXT NOT NULL DEFAULT '上架';
ALTER TABLE "Product" ADD COLUMN "researchStatus" TEXT;
ALTER TABLE "Product" ADD COLUMN "priceUpdatedAt" DATETIME;
