-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('Closed', 'Open', 'Scheduled', 'Cancelled');

-- CreateEnum
CREATE TYPE "AchievementSubmissionRole" AS ENUM ('Teacher', 'Student', 'Both');

-- CreateEnum
CREATE TYPE "AchievementStatus" AS ENUM ('Approved', 'Published');

-- CreateEnum
CREATE TYPE "AchievementApprovalStatus" AS ENUM ('Pending', 'Rejected');

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

-- CreateTable
CREATE TABLE "achievement" (
    "oid" SERIAL NOT NULL,
    "activity_oid" INTEGER NOT NULL,
    "student_oid" INTEGER NOT NULL,
    "achievement_submission_role" "AchievementSubmissionRole" NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER,
    "status" "AchievementStatus" NOT NULL,
    "created_by_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_user_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "achievement_approval" (
    "oid" SERIAL NOT NULL,
    "activity_oid" INTEGER NOT NULL,
    "student_oid" INTEGER NOT NULL,
    "achievement_oid" INTEGER,
    "achievement_submission_role" "AchievementSubmissionRole" NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER,
    "status" "AchievementApprovalStatus" NOT NULL,
    "created_by_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_user_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "achievement_approval_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "achievement_approval_review" (
    "oid" SERIAL NOT NULL,
    "achievement_approval_oid" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_by_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_user_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "achievement_approval_review_pkey" PRIMARY KEY ("oid")
);

-- CreateIndex
CREATE UNIQUE INDEX "activity_category_code_key" ON "activity_category"("code");

-- CreateIndex
CREATE UNIQUE INDEX "achievement_activity_oid_student_oid_achievement_submission_key" ON "achievement"("activity_oid", "student_oid", "achievement_submission_role");

-- CreateIndex
CREATE UNIQUE INDEX "achievement_approval_activity_oid_student_oid_achievement_s_key" ON "achievement_approval"("activity_oid", "student_oid", "achievement_submission_role");

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_category_oid_fkey" FOREIGN KEY ("category_oid") REFERENCES "activity_category"("oid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_activity_oid_fkey" FOREIGN KEY ("activity_oid") REFERENCES "activity"("oid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_student_oid_fkey" FOREIGN KEY ("student_oid") REFERENCES "student"("oid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement_approval" ADD CONSTRAINT "achievement_approval_activity_oid_fkey" FOREIGN KEY ("activity_oid") REFERENCES "activity"("oid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement_approval" ADD CONSTRAINT "achievement_approval_student_oid_fkey" FOREIGN KEY ("student_oid") REFERENCES "student"("oid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement_approval_review" ADD CONSTRAINT "achievement_approval_review_achievement_approval_oid_fkey" FOREIGN KEY ("achievement_approval_oid") REFERENCES "achievement_approval"("oid") ON DELETE CASCADE ON UPDATE CASCADE;
