CREATE TYPE "public"."AchievementApprovalStatus" AS ENUM('pending', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."AchievementStatus" AS ENUM('approved', 'published');--> statement-breakpoint
CREATE TYPE "public"."AchievementSubmissionRole" AS ENUM('student', 'teacher', 'both');--> statement-breakpoint
CREATE TYPE "public"."ActivityStatus" AS ENUM('closed', 'open', 'scheduled', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."ApprovalCommentType" AS ENUM('conversation', 'rejection', 'approval');--> statement-breakpoint
CREATE TYPE "public"."UserRole" AS ENUM('student', 'parent', 'teacher', 'admin', 'alumni');--> statement-breakpoint
CREATE TYPE "public"."UserStatus" AS ENUM('active', 'inactivate', 'suspend');--> statement-breakpoint
CREATE TABLE "achievement_approval_attachment" (
	"oid" serial PRIMARY KEY NOT NULL,
	"achievement_approval_oid" integer NOT NULL,
	"bucket_name" varchar(50) NOT NULL,
	"object_key" varchar(200) NOT NULL,
	"file_name" varchar(200) NOT NULL,
	"file_size" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "achievement_approval_review" (
	"oid" serial PRIMARY KEY NOT NULL,
	"achievement_approval_oid" integer NOT NULL,
	"comment_type" "ApprovalCommentType" NOT NULL,
	"comment" text NOT NULL,
	"created_by_user_oid" integer NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_by_user_oid" integer NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	"version" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "achievement_approval" (
	"oid" serial PRIMARY KEY NOT NULL,
	"activity_oid" integer NOT NULL,
	"student_oid" integer NOT NULL,
	"achievement_oid" integer,
	"achievement_submission_role" "AchievementSubmissionRole" NOT NULL,
	"comment" text NOT NULL,
	"rating" integer,
	"status" "AchievementApprovalStatus" NOT NULL,
	"num_of_attachment" integer DEFAULT 0 NOT NULL,
	"created_by_user_oid" integer NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_by_user_oid" integer NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	"version" integer NOT NULL,
	CONSTRAINT "achievement_approval_activity_oid_student_oid_achievement_submission_role_unique" UNIQUE("activity_oid","student_oid","achievement_submission_role")
);
--> statement-breakpoint
CREATE TABLE "achievement_attachment" (
	"oid" serial PRIMARY KEY NOT NULL,
	"achievement_oid" integer NOT NULL,
	"bucket_name" varchar(50) NOT NULL,
	"object_key" varchar(200) NOT NULL,
	"file_name" varchar(200) NOT NULL,
	"file_size" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "achievement" (
	"oid" serial PRIMARY KEY NOT NULL,
	"activity_oid" integer NOT NULL,
	"student_oid" integer NOT NULL,
	"achievement_submission_role" "AchievementSubmissionRole" NOT NULL,
	"comment" text NOT NULL,
	"rating" integer,
	"status" "AchievementStatus" NOT NULL,
	"num_of_attachment" integer NOT NULL,
	"created_by_user_oid" integer NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_by_user_oid" integer NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	"version" integer NOT NULL,
	CONSTRAINT "achievement_activity_oid_student_oid_achievement_submission_role_unique" UNIQUE("activity_oid","student_oid","achievement_submission_role")
);
--> statement-breakpoint
CREATE TABLE "activity" (
	"oid" serial PRIMARY KEY NOT NULL,
	"category_oid" integer NOT NULL,
	"name_en" varchar(200),
	"name_en_up_case" varchar(200),
	"name_zh_hant" varchar(200),
	"name_zh_hans" varchar(200),
	"description" text NOT NULL,
	"participant_grade" integer NOT NULL,
	"start_date" timestamp (6) with time zone NOT NULL,
	"end_date" timestamp (6) with time zone NOT NULL,
	"sharable" boolean NOT NULL,
	"ratable" boolean NOT NULL,
	"e_coin" integer NOT NULL,
	"achievement_submission_role" "AchievementSubmissionRole" NOT NULL,
	"status" "ActivityStatus" NOT NULL,
	"created_by_user_oid" integer NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_by_user_oid" integer NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	"version" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_category" (
	"oid" serial PRIMARY KEY NOT NULL,
	"code" varchar(10) NOT NULL,
	"name_en" varchar(200),
	"name_zh_hant" varchar(200),
	"name_zh_hans" varchar(200),
	CONSTRAINT "activity_category_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "class" (
	"oid" serial PRIMARY KEY NOT NULL,
	"grade" integer NOT NULL,
	"class_number" varchar(1) NOT NULL,
	CONSTRAINT "class_grade_class_number_unique" UNIQUE("grade","class_number")
);
--> statement-breakpoint
CREATE TABLE "student" (
	"oid" serial PRIMARY KEY NOT NULL,
	"id" varchar(20) NOT NULL,
	"firstname_en" varchar(50),
	"firstname_zh_hant" varchar(50),
	"firstname_zh_hans" varchar(50),
	"lastname_en" varchar(50),
	"lastname_zh_hant" varchar(50),
	"lastname_zh_hans" varchar(50),
	"name_en" varchar(200),
	"name_zh_hant" varchar(200),
	"name_zh_hans" varchar(200),
	"class_oid" integer NOT NULL,
	"student_number" integer NOT NULL,
	CONSTRAINT "student_class_oid_student_number_unique" UNIQUE("class_oid","student_number")
);
--> statement-breakpoint
CREATE TABLE "user_student" (
	"oid" serial PRIMARY KEY NOT NULL,
	"sequence" integer NOT NULL,
	"user_oid" integer NOT NULL,
	"student_oid" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"oid" serial PRIMARY KEY NOT NULL,
	"email" varchar(50) NOT NULL,
	"name_en" varchar(200),
	"name_zh_hant" varchar(200),
	"name_zh_hans" varchar(200),
	"role" "UserRole" NOT NULL,
	"status" "UserStatus" NOT NULL,
	"password" text NOT NULL,
	"password_expiry_datetime" timestamp (6) with time zone,
	"with_approval_right" boolean NOT NULL,
	"last_login_datetime" timestamp (6) with time zone,
	"created_by_user_oid" integer NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_by_user_oid" integer NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	"version" integer NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "achievement_approval_attachment" ADD CONSTRAINT "achievement_approval_attachment_achievement_approval_oid_achievement_approval_oid_fk" FOREIGN KEY ("achievement_approval_oid") REFERENCES "public"."achievement_approval"("oid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement_approval_review" ADD CONSTRAINT "achievement_approval_review_achievement_approval_oid_achievement_approval_oid_fk" FOREIGN KEY ("achievement_approval_oid") REFERENCES "public"."achievement_approval"("oid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement_approval" ADD CONSTRAINT "achievement_approval_activity_oid_activity_oid_fk" FOREIGN KEY ("activity_oid") REFERENCES "public"."activity"("oid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement_approval" ADD CONSTRAINT "achievement_approval_student_oid_student_oid_fk" FOREIGN KEY ("student_oid") REFERENCES "public"."student"("oid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement_attachment" ADD CONSTRAINT "achievement_attachment_achievement_oid_achievement_oid_fk" FOREIGN KEY ("achievement_oid") REFERENCES "public"."achievement"("oid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_activity_oid_activity_oid_fk" FOREIGN KEY ("activity_oid") REFERENCES "public"."activity"("oid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_student_oid_student_oid_fk" FOREIGN KEY ("student_oid") REFERENCES "public"."student"("oid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_category_oid_activity_category_oid_fk" FOREIGN KEY ("category_oid") REFERENCES "public"."activity_category"("oid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_class_oid_class_oid_fk" FOREIGN KEY ("class_oid") REFERENCES "public"."class"("oid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_student" ADD CONSTRAINT "user_student_user_oid_user_oid_fk" FOREIGN KEY ("user_oid") REFERENCES "public"."user"("oid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_student" ADD CONSTRAINT "user_student_student_oid_student_oid_fk" FOREIGN KEY ("student_oid") REFERENCES "public"."student"("oid") ON DELETE cascade ON UPDATE no action;