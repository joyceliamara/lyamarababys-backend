/*
  Warnings:

  - You are about to drop the column `contactId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `contacts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_contactId_fkey";

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "contactId";

-- CreateIndex
CREATE UNIQUE INDEX "addresses_userId_key" ON "addresses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_userId_key" ON "contacts"("userId");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
