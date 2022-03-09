-- CreateEnum
CREATE TYPE "TestContent" AS ENUM ('RANDOM', 'QUOTE');

-- AlterTable
ALTER TABLE "TestPreset" ADD COLUMN     "content" "TestContent" NOT NULL DEFAULT E'RANDOM';
