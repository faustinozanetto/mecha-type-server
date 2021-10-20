-- CreateEnum
CREATE TYPE "FollowStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Follow" ADD COLUMN     "status" "FollowStatus" NOT NULL DEFAULT E'PENDING';
