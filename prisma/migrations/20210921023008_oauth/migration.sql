/*
  Warnings:

  - You are about to drop the column `discordId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[oauthId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `oauthId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_discordId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "discordId",
ADD COLUMN     "oauthId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_oauthId_key" ON "User"("oauthId");
