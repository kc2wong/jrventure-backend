/*
  Warnings:

  - Added the required column `e_coin` to the `activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating_enabled` to the `activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activity" ADD COLUMN     "e_coin" INTEGER NOT NULL,
ADD COLUMN     "rating_enabled" BOOLEAN NOT NULL;
