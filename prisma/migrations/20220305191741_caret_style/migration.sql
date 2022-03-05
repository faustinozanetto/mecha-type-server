-- CreateEnum
CREATE TYPE "CaretStyle" AS ENUM ('LINE', 'BLOCK', 'HOLLOW');

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "caretStyle" "CaretStyle" NOT NULL DEFAULT E'LINE';
