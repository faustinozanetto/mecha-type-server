-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('DEFAULT', 'DISCORD', 'GITHUB', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProivder" "AuthProvider" NOT NULL DEFAULT E'DEFAULT';
