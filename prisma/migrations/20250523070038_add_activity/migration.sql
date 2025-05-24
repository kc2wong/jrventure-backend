-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('Closed', 'Open', 'Scheduled', 'Cancelled');

-- CreateEnum
CREATE TYPE "AchievementSubmissionRole" AS ENUM ('Teacher', 'Student', 'Both');

-- CreateTable
CREATE TABLE "activity_category" (
    "oid" SERIAL NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "name_en" VARCHAR(200),
    "name_zh_hant" VARCHAR(200),
    "name_zh_hans" VARCHAR(200),

    CONSTRAINT "activity_category_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "activity" (
    "oid" SERIAL NOT NULL,
    "category_oid" INTEGER NOT NULL,
    "name_en" VARCHAR(200),
    "name_en_up_case" VARCHAR(200),
    "name_zh_hant" VARCHAR(200),
    "name_zh_hans" VARCHAR(200),
    "description" TEXT NOT NULL,
    "participant_grade" INTEGER NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "end_date" TIMESTAMPTZ(6) NOT NULL,
    "sharable" BOOLEAN NOT NULL,
    "ratable" BOOLEAN NOT NULL,
    "e_coin" INTEGER NOT NULL,
    "achievement_submission_role" "AchievementSubmissionRole" NOT NULL,
    "status" "ActivityStatus" NOT NULL,
    "created_by_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_user_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("oid")
);

-- CreateIndex
CREATE UNIQUE INDEX "activity_category_code_key" ON "activity_category"("code");

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_category_oid_fkey" FOREIGN KEY ("category_oid") REFERENCES "activity_category"("oid") ON DELETE RESTRICT ON UPDATE CASCADE;
