/*
  Warnings:

  - You are about to drop the column `itemIds` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Bill` table. All the data in the column will be lost.
  - Added the required column `billedItems` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gstAmount` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netAmount` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "itemIds",
DROP COLUMN "userId",
ADD COLUMN     "bankDetails" TEXT,
ADD COLUMN     "billedItems" JSONB NOT NULL,
ADD COLUMN     "branch" TEXT,
ADD COLUMN     "contactPerson" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliveryTerms" TEXT,
ADD COLUMN     "gstAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "netAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paymentTerms" TEXT,
ADD COLUMN     "refNumber" TEXT,
ADD COLUMN     "warranty" TEXT;

-- CreateTable
CREATE TABLE "_BilledItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BilledItems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BilledItems_B_index" ON "_BilledItems"("B");

-- AddForeignKey
ALTER TABLE "_BilledItems" ADD CONSTRAINT "_BilledItems_A_fkey" FOREIGN KEY ("A") REFERENCES "Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BilledItems" ADD CONSTRAINT "_BilledItems_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
