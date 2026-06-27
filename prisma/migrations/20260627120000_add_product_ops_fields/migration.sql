-- AlterTable: 卡牌运营字段与上下架状态（boxType 可能已由旧库手动存在，启动脚本 ensure-db-schema 会幂等补齐）
ALTER TABLE "Product" ADD COLUMN "cardNumber" TEXT;
ALTER TABLE "Product" ADD COLUMN "rarity" TEXT;
ALTER TABLE "Product" ADD COLUMN "language" TEXT;
ALTER TABLE "Product" ADD COLUMN "costPrice" INTEGER;
ALTER TABLE "Product" ADD COLUMN "marketRefPrice" INTEGER;
ALTER TABLE "Product" ADD COLUMN "minPrice" INTEGER;
ALTER TABLE "Product" ADD COLUMN "status" TEXT NOT NULL DEFAULT '上架';
ALTER TABLE "Product" ADD COLUMN "researchStatus" TEXT;
ALTER TABLE "Product" ADD COLUMN "priceUpdatedAt" DATETIME;
