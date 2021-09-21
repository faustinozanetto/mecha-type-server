/*
  Warnings:

  - You are about to drop the column `authProivder` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "authProivder",
ADD COLUMN     "authProvider" "AuthProvider" NOT NULL DEFAULT E'DEFAULT';
