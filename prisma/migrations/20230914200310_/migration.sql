-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_quantities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "sizeId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "productId" TEXT,
    CONSTRAINT "quantities_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "sizes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "quantities_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_quantities" ("count", "created_at", "id", "productId", "sizeId", "updated_at") SELECT "count", "created_at", "id", "productId", "sizeId", "updated_at" FROM "quantities";
DROP TABLE "quantities";
ALTER TABLE "new_quantities" RENAME TO "quantities";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
