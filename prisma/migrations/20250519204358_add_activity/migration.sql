-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('Closed', 'Open', 'Scheduled', 'Cancelled');

-- CreateEnum
CREATE TYPE "AchievementSubmissionBy" AS ENUM ('Teacher', 'Student', 'Both');

-- CreateTable
CREATE TABLE "activity_category" (
    "oid" SERIAL NOT NULL,
    "name_en" VARCHAR(200),
    "name_zh_hant" VARCHAR(200),
    "name_zh_hans" VARCHAR(200),

    CONSTRAINT "activity_category_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "activity" (
    "oid" SERIAL NOT NULL,
    "category_oid" INTEGER NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name_en" VARCHAR(200),
    "name_zh_hant" VARCHAR(200),
    "name_zh_hans" VARCHAR(200),
    "description_en" TEXT,
    "description_zh_hant" TEXT,
    "description_zh_hans" TEXT,
    "grade" INTEGER NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "end_date" TIMESTAMPTZ(6) NOT NULL,
    "sharable" BOOLEAN NOT NULL,
    "achievement_submission" "AchievementSubmissionBy" NOT NULL,
    "status" "ActivityStatus" NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("oid")
);
