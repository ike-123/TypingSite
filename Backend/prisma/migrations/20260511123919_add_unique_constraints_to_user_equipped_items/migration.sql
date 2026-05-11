/*
  Warnings:

  - A unique constraint covering the columns `[userid,slot]` on the table `UserEquippedItems` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userid,itemid]` on the table `UserEquippedItems` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserEquippedItems_userid_slot_key" ON "UserEquippedItems"("userid", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "UserEquippedItems_userid_itemid_key" ON "UserEquippedItems"("userid", "itemid");
