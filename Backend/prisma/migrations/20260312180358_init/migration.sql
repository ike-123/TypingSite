/*
  Warnings:

  - You are about to drop the column `config` on the `TypingTest` table. All the data in the column will be lost.
  - Added the required column `configKey` to the `TypingTest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lengthDurationSetting` to the `TypingTest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `TypingTest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TypingTest_createdAt_idx";

-- DropIndex
DROP INDEX "TypingTest_userId_idx";

-- AlterTable
ALTER TABLE "TypingTest" DROP COLUMN "config",
ADD COLUMN     "configKey" TEXT NOT NULL,
ADD COLUMN     "lengthDurationSetting" TEXT NOT NULL,
ADD COLUMN     "mode" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TypingTest_userId_createdAt_idx" ON "TypingTest"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "TypingTest_userId_configKey_idx" ON "TypingTest"("userId", "configKey");
