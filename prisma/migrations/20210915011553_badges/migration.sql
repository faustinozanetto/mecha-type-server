-- CreateEnum
CREATE TYPE "UserBadge" AS ENUM ('PRO', 'TESTER', 'DEFAULT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "badge" "UserBadge" NOT NULL DEFAULT E'DEFAULT';
