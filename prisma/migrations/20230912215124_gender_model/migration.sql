-- CreateTable
CREATE TABLE "genders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_GenderToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_GenderToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "genders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GenderToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "genders_name_key" ON "genders"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_GenderToProduct_AB_unique" ON "_GenderToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_GenderToProduct_B_index" ON "_GenderToProduct"("B");
