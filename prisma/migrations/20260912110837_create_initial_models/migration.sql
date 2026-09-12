-- CreateEnum
CREATE TYPE "seriesStatus" AS ENUM ('ongoing', 'ended', 'cenceled');

-- CreateEnum
CREATE TYPE "userWatchStatus" AS ENUM ('plan_to_watch', 'watching', 'watched', 'not_worth_it');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "genres" TEXT[],
    "overview" TEXT NOT NULL,
    "status" "seriesStatus" NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSeries" (
    "userId" INTEGER NOT NULL,
    "seriesId" INTEGER NOT NULL,
    "status" "userWatchStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSeries_pkey" PRIMARY KEY ("userId","seriesId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserSeries" ADD CONSTRAINT "UserSeries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSeries" ADD CONSTRAINT "UserSeries_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;
