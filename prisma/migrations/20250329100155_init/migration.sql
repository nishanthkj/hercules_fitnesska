/*
  Warnings:

  - You are about to drop the column `mrp` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `specialPrice` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Item` table. All the data in the column will be lost.
  - Added the required column `price` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "mrp",
DROP COLUMN "specialPrice",
DROP COLUMN "total",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "slNo" SET DATA TYPE TEXT;
