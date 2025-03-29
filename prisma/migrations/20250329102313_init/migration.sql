/*
  Warnings:

  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `slNo` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Item" DROP CONSTRAINT "Item_pkey",
DROP COLUMN "slNo",
ADD COLUMN     "slNo" SERIAL NOT NULL,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("slNo");
