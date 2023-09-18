/*
  Warnings:

  - You are about to drop the `_ProductToSize` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `quantity` on the `sizes` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_ProductToSize_B_index";

-- DropIndex
DROP INDEX "_ProductToSize_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ProductToSize";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "quantities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "sizeId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "productId" TEXT,
    CONSTRAINT "quantities_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "sizes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "quantities_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sizes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_sizes" ("created_at", "id", "name", "updated_at") SELECT "created_at", "id", "name", "updated_at" FROM "sizes";
DROP TABLE "sizes";
ALTER TABLE "new_sizes" RENAME TO "sizes";
CREATE UNIQUE INDEX "sizes_name_key" ON "sizes"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
