/*
  Warnings:

  - Added the required column `quantity` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "quantity" INTEGER NOT NULL;
