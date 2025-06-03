/*
  Warnings:

  - You are about to drop the column `created_by_user_id` on the `achievement` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_user_id` on the `achievement` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_user_id` on the `achievement_approval` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_user_id` on the `achievement_approval` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_user_id` on the `achievement_approval_review` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_user_id` on the `achievement_approval_review` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_user_id` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_user_id` on the `activity` table. All the data in the column will be lost.
  - Added the required column `created_by_user_oid` to the `achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_user_oid` to the `achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_user_oid` to the `achievement_approval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_user_oid` to the `achievement_approval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_user_oid` to the `achievement_approval_review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_user_oid` to the `achievement_approval_review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_user_oid` to the `activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_user_oid` to the `activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "achievement" DROP COLUMN "created_by_user_id",
DROP COLUMN "updated_by_user_id",
ADD COLUMN     "created_by_user_oid" INTEGER NOT NULL,
ADD COLUMN     "updated_by_user_oid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "achievement_approval" DROP COLUMN "created_by_user_id",
DROP COLUMN "updated_by_user_id",
ADD COLUMN     "created_by_user_oid" INTEGER NOT NULL,
ADD COLUMN     "updated_by_user_oid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "achievement_approval_review" DROP COLUMN "created_by_user_id",
DROP COLUMN "updated_by_user_id",
ADD COLUMN     "created_by_user_oid" INTEGER NOT NULL,
ADD COLUMN     "updated_by_user_oid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "activity" DROP COLUMN "created_by_user_id",
DROP COLUMN "updated_by_user_id",
ADD COLUMN     "created_by_user_oid" INTEGER NOT NULL,
ADD COLUMN     "updated_by_user_oid" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "achievement_approval_attachment" (
    "oid" SERIAL NOT NULL,
    "achievement_approval_oid" INTEGER NOT NULL,
    "object_key" VARCHAR(200) NOT NULL,
    "file_name" VARCHAR(200) NOT NULL,
    "file_size" INTEGER NOT NULL,

    CONSTRAINT "achievement_approval_attachment_pkey" PRIMARY KEY ("oid")
);

-- AddForeignKey
ALTER TABLE "achievement_approval_attachment" ADD CONSTRAINT "achievement_approval_attachment_achievement_approval_oid_fkey" FOREIGN KEY ("achievement_approval_oid") REFERENCES "achievement_approval"("oid") ON DELETE CASCADE ON UPDATE CASCADE;
