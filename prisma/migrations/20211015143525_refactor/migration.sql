/*
  Warnings:

  - You are about to drop the column `keystrokes` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `testsCompleted` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wordsWritten` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CharsPerMinute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypingAccuracy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WordsPerMinute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CharsPerMinute" DROP CONSTRAINT "CharsPerMinute_userId_fkey";

-- DropForeignKey
ALTER TABLE "TypingAccuracy" DROP CONSTRAINT "TypingAccuracy_userId_fkey";

-- DropForeignKey
ALTER TABLE "WordsPerMinute" DROP CONSTRAINT "WordsPerMinute_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "keystrokes",
DROP COLUMN "testsCompleted",
DROP COLUMN "wordsWritten";

-- DropTable
DROP TABLE "CharsPerMinute";

-- DropTable
DROP TABLE "TypingAccuracy";

-- DropTable
DROP TABLE "WordsPerMinute";

-- CreateTable
CREATE TABLE "TestPresetHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testPresetId" TEXT NOT NULL,
    "wpm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cpm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "keystrokes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "correctChars" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "incorrectChars" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestPresetHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestPresetHistory" ADD CONSTRAINT "TestPresetHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPresetHistory" ADD CONSTRAINT "TestPresetHistory_testPresetId_fkey" FOREIGN KEY ("testPresetId") REFERENCES "TestPreset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
