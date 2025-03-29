/*
  Warnings:

  - You are about to drop the column `price` on the `Item` table. All the data in the column will be lost.
  - Added the required column `modelNumber` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mrp` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slNo` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialPrice` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "price",
ADD COLUMN     "modelNumber" TEXT NOT NULL,
ADD COLUMN     "mrp" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "slNo" INTEGER NOT NULL,
ADD COLUMN     "specialPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;
