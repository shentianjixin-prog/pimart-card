-- AlterTable
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BuybackRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameKana" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_BuybackRequest" ("id", "orderNo", "name", "nameKana", "email", "payload", "status", "createdAt")
SELECT "id", 'PIM-LEGACY-' || substr("id", 1, 8), "name", "nameKana", "email", json_object('message', "message"), "status", "createdAt"
FROM "BuybackRequest";
DROP TABLE "BuybackRequest";
ALTER TABLE "new_BuybackRequest" RENAME TO "BuybackRequest";
CREATE UNIQUE INDEX "BuybackRequest_orderNo_key" ON "BuybackRequest"("orderNo");
PRAGMA foreign_keys=ON;
