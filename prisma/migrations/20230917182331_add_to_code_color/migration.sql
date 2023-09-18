/*
  Warnings:

  - Added the required column `code` to the `colors` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_colors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_colors" ("created_at", "id", "name", "updated_at") SELECT "created_at", "id", "name", "updated_at" FROM "colors";
DROP TABLE "colors";
ALTER TABLE "new_colors" RENAME TO "colors";
CREATE UNIQUE INDEX "colors_name_key" ON "colors"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
