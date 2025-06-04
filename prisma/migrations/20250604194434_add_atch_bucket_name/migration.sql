/*
  Warnings:

  - Added the required column `bucket_name` to the `achievement_approval_attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bucket_name` to the `achievement_attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "achievement_approval_attachment" ADD COLUMN     "bucket_name" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "achievement_attachment" ADD COLUMN     "bucket_name" VARCHAR(50) NOT NULL;
