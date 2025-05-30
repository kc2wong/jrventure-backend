-- CreateEnum
CREATE TYPE "AchievementApprovalStatus" AS ENUM ('Pending', 'Rejected');

-- CreateTable
CREATE TABLE "achievement" (
    "oid" SERIAL NOT NULL,
    "activity_oid" INTEGER NOT NULL,
    "student_oid" INTEGER NOT NULL,
    "achievement_submission_role" "AchievementSubmissionRole" NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER,
    "published" BOOLEAN NOT NULL,
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
    "created_by_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_user_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "achievement_approval_pkey" PRIMARY KEY ("oid")
);

-- AddForeignKey
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_activity_oid_fkey" FOREIGN KEY ("activity_oid") REFERENCES "activity"("oid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_student_oid_fkey" FOREIGN KEY ("student_oid") REFERENCES "student"("oid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement_approval" ADD CONSTRAINT "achievement_approval_activity_oid_fkey" FOREIGN KEY ("activity_oid") REFERENCES "activity"("oid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement_approval" ADD CONSTRAINT "achievement_approval_student_oid_fkey" FOREIGN KEY ("student_oid") REFERENCES "student"("oid") ON DELETE CASCADE ON UPDATE CASCADE;
