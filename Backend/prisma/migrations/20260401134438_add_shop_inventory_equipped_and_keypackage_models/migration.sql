-- CreateEnum
CREATE TYPE "EquipSlot" AS ENUM ('avatar', 'celebration', 'character');

-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('multiplayer', 'shooterGame');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "Ads_Removed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Keys" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'GBP',
ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateTable
CREATE TABLE "ShopItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mode" "GameMode" NOT NULL,
    "slot" "EquipSlot" NOT NULL,
    "priceKeys" INTEGER NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "ModelUrl" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyPackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keysAmount" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "KeyPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInventory" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "itemid" TEXT NOT NULL,

    CONSTRAINT "UserInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEquippedItems" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "itemid" TEXT NOT NULL,
    "slot" "EquipSlot" NOT NULL,

    CONSTRAINT "UserEquippedItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInventory_userid_itemid_key" ON "UserInventory"("userid", "itemid");

-- AddForeignKey
ALTER TABLE "UserInventory" ADD CONSTRAINT "UserInventory_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInventory" ADD CONSTRAINT "UserInventory_itemid_fkey" FOREIGN KEY ("itemid") REFERENCES "ShopItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEquippedItems" ADD CONSTRAINT "UserEquippedItems_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEquippedItems" ADD CONSTRAINT "UserEquippedItems_itemid_fkey" FOREIGN KEY ("itemid") REFERENCES "ShopItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
