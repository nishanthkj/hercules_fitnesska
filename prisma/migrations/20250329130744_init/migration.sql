/*
  Warnings:

  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `billId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `slNo` on the `Item` table. All the data in the column will be lost.
  - The required column `id` was added to the `Item` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_userId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_billId_fkey";

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "itemIds" TEXT[];

-- AlterTable
ALTER TABLE "Item" DROP CONSTRAINT "Item_pkey",
DROP COLUMN "billId",
DROP COLUMN "slNo",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");
