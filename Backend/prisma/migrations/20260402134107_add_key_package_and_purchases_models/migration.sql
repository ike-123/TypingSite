-- CreateEnum
CREATE TYPE "PurchaseType" AS ENUM ('keys');

-- CreateTable
CREATE TABLE "Purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "type" "PurchaseType" NOT NULL,
    "itemName" TEXT NOT NULL,
    "pricePaid" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "keyPackageId" TEXT,

    CONSTRAINT "Purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Purchases_stripeSessionId_key" ON "Purchases"("stripeSessionId");

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_keyPackageId_fkey" FOREIGN KEY ("keyPackageId") REFERENCES "KeyPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
