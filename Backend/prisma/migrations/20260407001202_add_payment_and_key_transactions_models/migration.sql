/*
  Warnings:

  - You are about to drop the `Purchases` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "KeyTransactionType" AS ENUM ('earn', 'spend', 'admin_grant');

-- DropForeignKey
ALTER TABLE "Purchases" DROP CONSTRAINT "Purchases_keyPackageId_fkey";

-- DropForeignKey
ALTER TABLE "Purchases" DROP CONSTRAINT "Purchases_userId_fkey";

-- DropTable
DROP TABLE "Purchases";

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "type" "PurchaseType" NOT NULL,
    "itemName" TEXT NOT NULL,
    "pricePaid" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "keyPackageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyTransactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "KeyTransactionType" NOT NULL,
    "keyamount" INTEGER NOT NULL,
    "paymentId" TEXT,
    "shopitemId" TEXT,
    "newKeyAmount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KeyTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeSessionId_key" ON "Payment"("stripeSessionId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_keyPackageId_fkey" FOREIGN KEY ("keyPackageId") REFERENCES "KeyPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyTransactions" ADD CONSTRAINT "KeyTransactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyTransactions" ADD CONSTRAINT "KeyTransactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyTransactions" ADD CONSTRAINT "KeyTransactions_shopitemId_fkey" FOREIGN KEY ("shopitemId") REFERENCES "ShopItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
