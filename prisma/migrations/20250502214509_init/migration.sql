-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('student', 'parent', 'teacher', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactivate', 'suspend');

-- CreateTable
CREATE TABLE "class" (
    "oid" SERIAL NOT NULL,
    "grade" INTEGER NOT NULL,
    "class_number" VARCHAR(1) NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "student" (
    "oid" SERIAL NOT NULL,
    "id" VARCHAR(20) NOT NULL,
    "firstname_en" VARCHAR(50),
    "firstname_zh_hant" VARCHAR(50),
    "firstname_zh_hans" VARCHAR(50),
    "lastname_en" VARCHAR(50),
    "lastname_zh_hant" VARCHAR(50),
    "lastname_zh_hans" VARCHAR(50),
    "name_en" VARCHAR(200),
    "name_zh_hant" VARCHAR(200),
    "name_zh_hans" VARCHAR(200),
    "class_oid" INTEGER NOT NULL,
    "student_number" INTEGER NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "user" (
    "oid" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "name_en" VARCHAR(200),
    "name_zh_hant" VARCHAR(200),
    "name_zh_hans" VARCHAR(200),
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL,
    "password" TEXT NOT NULL,
    "password_expiry_datetime" TIMESTAMPTZ(6),
    "last_login_datetime" TIMESTAMPTZ(6),
    "created_by_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_user_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "user_student" (
    "oid" SERIAL NOT NULL,
    "user_oid" INTEGER NOT NULL,
    "student_oid" INTEGER NOT NULL,

    CONSTRAINT "user_student_pkey" PRIMARY KEY ("oid")
);

-- CreateIndex
CREATE UNIQUE INDEX "class_grade_class_number_key" ON "class"("grade", "class_number");

-- CreateIndex
CREATE UNIQUE INDEX "student_class_oid_student_number_key" ON "student"("class_oid", "student_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_class_oid_fkey" FOREIGN KEY ("class_oid") REFERENCES "class"("oid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_student" ADD CONSTRAINT "user_student_user_oid_fkey" FOREIGN KEY ("user_oid") REFERENCES "user"("oid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_student" ADD CONSTRAINT "user_student_student_oid_fkey" FOREIGN KEY ("student_oid") REFERENCES "student"("oid") ON DELETE CASCADE ON UPDATE CASCADE;
