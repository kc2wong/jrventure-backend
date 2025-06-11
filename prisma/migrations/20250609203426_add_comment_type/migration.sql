/*
  Warnings:

  - Added the required column `comment_type` to the `achievement_approval_review` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApprovalCommentType" AS ENUM ('Conversation', 'Rejection', 'Approval');

-- AlterTable
ALTER TABLE "achievement_approval" ADD COLUMN     "num_of_attachment" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "achievement_approval_review" ADD COLUMN     "comment_type" "ApprovalCommentType" NOT NULL;
