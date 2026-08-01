/*
  Warnings:

  - You are about to drop the column `ModelUrl` on the `ShopItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShopItem" DROP COLUMN "ModelUrl",
ADD COLUMN     "assetUrl" TEXT,
ADD COLUMN     "spriteSheetUrl" TEXT;
