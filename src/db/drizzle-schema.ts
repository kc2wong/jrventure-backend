// drizzle-schema.ts
import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
  unique,
} from 'drizzle-orm/pg-core';

export enum UserRoleEnum {
  student = 'student',
  parent = 'parent',
  teacher = 'teacher',
  admin = 'admin',
  alumni = 'alumni',
}
export const userRole = pgEnum('UserRole', UserRoleEnum);
export enum UserStatusEnum {
  active = 'active',
  inactivate = 'inactivate',
  suspend = 'suspend',
}
export const userStatus = pgEnum('UserStatus', UserStatusEnum);
export enum ActivityStatusEnum {
  closed = 'closed',
  open = 'open',
  scheduled = 'scheduled',
  cancelled = 'cancelled',
}
export const activityStatus = pgEnum('ActivityStatus', ActivityStatusEnum);
export enum AchievementSubmissionRoleEnum {
  student = 'student',
  teacher = 'teacher',
  both = 'both',
}
export const achievementSubmissionRoleEnum = pgEnum(
  'AchievementSubmissionRole',
  AchievementSubmissionRoleEnum
);
export enum AchievementStatusEnum {
  approved = 'approved',
  published = 'published',
}
export const achievementStatus = pgEnum(
  'AchievementStatus',
  AchievementStatusEnum
);
export enum AchievementApprovalStatusEnum {
  pending = 'pending',
  rejected = 'rejected',
}
export const achievementApprovalStatus = pgEnum(
  'AchievementApprovalStatus',
  AchievementApprovalStatusEnum
);
export enum ApprovalCommentTypeEnum {
  conversation = 'conversation',
  rejection = 'rejection',
  approval = 'approval',
}
export const approvalCommentType = pgEnum(
  'ApprovalCommentType',
  ApprovalCommentTypeEnum
);

// Class
export const classes = pgTable(
  'class',
  {
    oid: serial('oid').primaryKey(),
    grade: integer('grade').notNull(),
    classNumber: varchar('class_number', { length: 1 }).notNull(),
  },
  (table) => ({
    uniqueGradeClass: unique().on(table.grade, table.classNumber),
  })
);

// Student
export const students = pgTable(
  'student',
  {
    oid: serial('oid').primaryKey(),
    id: varchar('id', { length: 20 }).notNull(),
    firstnameEn: varchar('firstname_en', { length: 50 }),
    firstnameZhHant: varchar('firstname_zh_hant', { length: 50 }),
    firstnameZhHans: varchar('firstname_zh_hans', { length: 50 }),
    lastnameEn: varchar('lastname_en', { length: 50 }),
    lastnameZhHant: varchar('lastname_zh_hant', { length: 50 }),
    lastnameZhHans: varchar('lastname_zh_hans', { length: 50 }),
    nameEn: varchar('name_en', { length: 200 }),
    nameZhHant: varchar('name_zh_hant', { length: 200 }),
    nameZhHans: varchar('name_zh_hans', { length: 200 }),
    classOid: integer('class_oid')
      .notNull()
      .references(() => classes.oid),
    studentNumber: integer('student_number').notNull(),
  },
  (table) => ({
    uniqueClassStudent: unique().on(table.classOid, table.studentNumber),
  })
);

// User
export const users = pgTable('user', {
  oid: serial('oid').primaryKey(),
  email: varchar('email', { length: 50 }).notNull().unique(),
  nameEn: varchar('name_en', { length: 200 }),
  nameZhHant: varchar('name_zh_hant', { length: 200 }),
  nameZhHans: varchar('name_zh_hans', { length: 200 }),
  role: userRole('role').notNull(),
  status: userStatus('status').notNull(),
  password: text('password').notNull(),
  passwordExpiryDatetime: timestamp('password_expiry_datetime', {
    withTimezone: true,
    precision: 6,
  }),
  withApprovalRight: boolean('with_approval_right').notNull(),
  lastLoginDatetime: timestamp('last_login_datetime', {
    withTimezone: true,
    precision: 6,
  }),
  createdByUserOid: integer('created_by_user_oid').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  updatedByUserOid: integer('updated_by_user_oid').notNull(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    precision: 6,
  }).notNull(),
  version: integer('version').notNull(),
});

// UserStudent
export const userStudents = pgTable('user_student', {
  oid: serial('oid').primaryKey(),
  sequence: integer('sequence').notNull(),
  userOid: integer('user_oid')
    .notNull()
    .references(() => users.oid, { onDelete: 'cascade' }),
  studentOid: integer('student_oid')
    .notNull()
    .references(() => students.oid, { onDelete: 'cascade' }),
});

// ActivityCategory
export const activityCategories = pgTable('activity_category', {
  oid: serial('oid').primaryKey(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  nameEn: varchar('name_en', { length: 200 }),
  nameZhHant: varchar('name_zh_hant', { length: 200 }),
  nameZhHans: varchar('name_zh_hans', { length: 200 }),
});

// Activity
export const activities = pgTable('activity', {
  oid: serial('oid').primaryKey(),
  categoryOid: integer('category_oid')
    .notNull()
    .references(() => activityCategories.oid),
  nameEn: varchar('name_en', { length: 200 }),
  nameEnUpCase: varchar('name_en_up_case', { length: 200 }),
  nameZhHant: varchar('name_zh_hant', { length: 200 }),
  nameZhHans: varchar('name_zh_hans', { length: 200 }),
  description: text('description').notNull(),
  participantGrade: integer('participant_grade').notNull(),
  startDate: timestamp('start_date', {
    withTimezone: true,
    precision: 6,
  }).notNull(),
  endDate: timestamp('end_date', {
    withTimezone: true,
    precision: 6,
  }).notNull(),
  sharable: boolean('sharable').notNull(),
  ratable: boolean('ratable').notNull(),
  eCoin: integer('e_coin').notNull(),
  achievementSubmissionRole: achievementSubmissionRoleEnum(
    'achievement_submission_role'
  ).notNull(),
  status: activityStatus('status').notNull(),
  createdByUserOid: integer('created_by_user_oid').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  updatedByUserOid: integer('updated_by_user_oid').notNull(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    precision: 6,
  }).notNull(),
  version: integer('version').notNull(),
});

// Achievement
export const achievements = pgTable(
  'achievement',
  {
    oid: serial('oid').primaryKey(),
    activityOid: integer('activity_oid')
      .notNull()
      .references(() => activities.oid, { onDelete: 'cascade' }),
    studentOid: integer('student_oid')
      .notNull()
      .references(() => students.oid, { onDelete: 'cascade' }),
    achievementSubmissionRole: achievementSubmissionRoleEnum(
      'achievement_submission_role'
    ).notNull(),
    comment: text('comment').notNull(),
    rating: integer('rating'),
    status: achievementStatus('status').notNull(),
    numOfAttachment: integer('num_of_attachment').notNull(),
    createdByUserOid: integer('created_by_user_oid').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 6 })
      .defaultNow()
      .notNull(),
    updatedByUserOid: integer('updated_by_user_oid').notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      precision: 6,
    }).notNull(),
    version: integer('version').notNull(),
  },
  (table) => ({
    uniqueAchievement: unique().on(
      table.activityOid,
      table.studentOid,
      table.achievementSubmissionRole
    ),
  })
);

// AchievementAttachment
export const achievementAttachments = pgTable('achievement_attachment', {
  oid: serial('oid').primaryKey(),
  achievementOid: integer('achievement_oid')
    .notNull()
    .references(() => achievements.oid, { onDelete: 'cascade' }),
  bucketName: varchar('bucket_name', { length: 50 }).notNull(),
  objectKey: varchar('object_key', { length: 200 }).notNull(),
  fileName: varchar('file_name', { length: 200 }).notNull(),
  fileSize: integer('file_size').notNull(),
});

// AchievementApproval
export const achievementApprovals = pgTable(
  'achievement_approval',
  {
    oid: serial('oid').primaryKey(),
    activityOid: integer('activity_oid')
      .notNull()
      .references(() => activities.oid, { onDelete: 'cascade' }),
    studentOid: integer('student_oid')
      .notNull()
      .references(() => students.oid, { onDelete: 'cascade' }),
    achievementOid: integer('achievement_oid'),
    achievementSubmissionRole: achievementSubmissionRoleEnum(
      'achievement_submission_role'
    ).notNull(),
    comment: text('comment').notNull(),
    rating: integer('rating'),
    status: achievementApprovalStatus('status').notNull(),
    numOfAttachment: integer('num_of_attachment').notNull().default(0),
    createdByUserOid: integer('created_by_user_oid').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 6 })
      .defaultNow()
      .notNull(),
    updatedByUserOid: integer('updated_by_user_oid').notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      precision: 6,
    }).notNull(),
    version: integer('version').notNull(),
  },
  (table) => ({
    uniqueApproval: unique().on(
      table.activityOid,
      table.studentOid,
      table.achievementSubmissionRole
    ),
  })
);

// AchievementApprovalReview
export const achievementApprovalReviews = pgTable(
  'achievement_approval_review',
  {
    oid: serial('oid').primaryKey(),
    achievementApprovalOid: integer('achievement_approval_oid')
      .notNull()
      .references(() => achievementApprovals.oid, { onDelete: 'cascade' }),
    commentType: approvalCommentType('comment_type').notNull(),
    comment: text('comment').notNull(),
    createdByUserOid: integer('created_by_user_oid').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 6 })
      .defaultNow()
      .notNull(),
    updatedByUserOid: integer('updated_by_user_oid').notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      precision: 6,
    }).notNull(),
    version: integer('version').notNull(),
  }
);

// AchievementApprovalAttachment
export const achievementApprovalAttachments = pgTable(
  'achievement_approval_attachment',
  {
    oid: serial('oid').primaryKey(),
    achievementApprovalOid: integer('achievement_approval_oid')
      .notNull()
      .references(() => achievementApprovals.oid, { onDelete: 'cascade' }),
    bucketName: varchar('bucket_name', { length: 50 }).notNull(),
    objectKey: varchar('object_key', { length: 200 }).notNull(),
    fileName: varchar('file_name', { length: 200 }).notNull(),
    fileSize: integer('file_size').notNull(),
  }
);
