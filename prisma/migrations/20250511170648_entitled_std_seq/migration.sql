-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'alumni';

-- AlterTable
ALTER TABLE "user_student" ADD COLUMN     "sequence" INTEGER NOT NULL DEFAULT 1;
