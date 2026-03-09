-- CreateTable
CREATE TABLE "TypingTest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wpm" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "correctChars" INTEGER NOT NULL,
    "incorrectChars" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TypingTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TypingTest_userId_idx" ON "TypingTest"("userId");

-- CreateIndex
CREATE INDEX "TypingTest_createdAt_idx" ON "TypingTest"("createdAt");

-- AddForeignKey
ALTER TABLE "TypingTest" ADD CONSTRAINT "TypingTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
