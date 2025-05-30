/*
  Warnings:

  - You are about to drop the column `published` on the `achievement` table. All the data in the column will be lost.
  - Added the required column `status` to the `achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `achievement_approval` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AchievementStatus" AS ENUM ('Approved', 'Published');

-- AlterTable
ALTER TABLE "achievement" DROP COLUMN "published",
ADD COLUMN     "status" "AchievementStatus" NOT NULL;

-- AlterTable
ALTER TABLE "achievement_approval" ADD COLUMN     "status" "AchievementApprovalStatus" NOT NULL;
