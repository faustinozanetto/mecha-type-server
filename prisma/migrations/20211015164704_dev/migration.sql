-- CreateEnum
CREATE TYPE "UserBadge" AS ENUM ('PRO', 'TESTER', 'DEFAULT');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('DEFAULT', 'DISCORD', 'GITHUB', 'GOOGLE');

-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('WORDS', 'TIME');

-- CreateEnum
CREATE TYPE "TestLanguage" AS ENUM ('ENGLISH', 'SPANISH');

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "oauthId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT E'',
    "avatar" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT E'',
    "badge" "UserBadge" NOT NULL DEFAULT E'DEFAULT',
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "authProvider" "AuthProvider" NOT NULL DEFAULT E'DEFAULT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnUser" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOnUser_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "TestPreset" (
    "id" TEXT NOT NULL,
    "type" "TestType" NOT NULL DEFAULT E'WORDS',
    "language" "TestLanguage" NOT NULL DEFAULT E'ENGLISH',
    "time" INTEGER NOT NULL DEFAULT 0,
    "words" INTEGER NOT NULL DEFAULT 25,
    "creatorImage" TEXT NOT NULL DEFAULT E'',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestPreset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "User_oauthId_key" ON "User"("oauthId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "UserOnUser" ADD CONSTRAINT "UserOnUser_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnUser" ADD CONSTRAINT "UserOnUser_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPresetHistory" ADD CONSTRAINT "TestPresetHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPresetHistory" ADD CONSTRAINT "TestPresetHistory_testPresetId_fkey" FOREIGN KEY ("testPresetId") REFERENCES "TestPreset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPreset" ADD CONSTRAINT "TestPreset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
