/*
  Warnings:

  - You are about to drop the column `colorId` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `quantities` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `quantities` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `quantities` table. All the data in the column will be lost.
  - You are about to drop the `_CategoryToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ColorToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GenderToProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `colorId` to the `quantities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `units` to the `quantities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "_ColorToProduct" DROP CONSTRAINT "_ColorToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_ColorToProduct" DROP CONSTRAINT "_ColorToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "_GenderToProduct" DROP CONSTRAINT "_GenderToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_GenderToProduct" DROP CONSTRAINT "_GenderToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_colorId_fkey";

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_sizeId_fkey";

-- DropForeignKey
ALTER TABLE "quantities" DROP CONSTRAINT "quantities_productId_fkey";

-- DropForeignKey
ALTER TABLE "quantities" DROP CONSTRAINT "quantities_sizeId_fkey";

-- AlterTable
ALTER TABLE "carts" DROP COLUMN "colorId",
DROP COLUMN "quantity",
DROP COLUMN "sizeId";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "genderId" TEXT;

-- AlterTable
ALTER TABLE "quantities" DROP COLUMN "count",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "colorId" TEXT NOT NULL,
ADD COLUMN     "units" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CategoryToProduct";

-- DropTable
DROP TABLE "_ColorToProduct";

-- DropTable
DROP TABLE "_GenderToProduct";

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "genders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quantities" ADD CONSTRAINT "quantities_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quantities" ADD CONSTRAINT "quantities_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quantities" ADD CONSTRAINT "quantities_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
