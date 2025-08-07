import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import {
  classes,
  students,
  users,
  activityCategories,
  activities,
  UserRoleEnum,
  UserStatusEnum,
  ActivityStatusEnum,
  AchievementSubmissionRoleEnum,
  achievements,
  achievementApprovals,
  achievementAttachments,
  achievementApprovalAttachments,
  achievementApprovalReviews,
  AchievementStatusEnum,
  ApprovalCommentTypeEnum,
  AchievementApprovalStatusEnum,
} from '@db/drizzle-schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
    // ssl: true
});

export const db = drizzle(pool);

export {
  UserRoleEnum as UserRole,
  UserStatusEnum as UserStatus,
  AchievementSubmissionRoleEnum as AchievementSubmissionRole,
  ActivityStatusEnum as ActivityStatus,
  AchievementStatusEnum as AchievementStatus,
  AchievementApprovalStatusEnum as AchievementApprovalStatus,
  ApprovalCommentTypeEnum as ApprovalCommentType,
};

export type Student = typeof students.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type User = typeof users.$inferSelect;

export type ActivityCategory = typeof activityCategories.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type AchievementAttachment = typeof achievementAttachments.$inferSelect;
export type AchievementApproval = typeof achievementApprovals.$inferSelect;
export type AchievementApprovalAttachment =
  typeof achievementApprovalAttachments.$inferSelect;
export type AchievementApprovalReview =
  typeof achievementApprovalReviews.$inferSelect;

export type ActivityCreationEntity = Omit<
  Activity,
  | 'oid'
  | 'createdByUserOid'
  | 'createdAt'
  | 'updatedByUserOid'
  | 'updatedAt'
  | 'version'
>;

export type AchievementCreationEntity = Omit<
  Achievement,
  | 'oid'
  | 'createdByUserOid'
  | 'createdAt'
  | 'updatedByUserOid'
  | 'updatedAt'
  | 'version'
>;

export type AchievementApprovalCreationEntity = Omit<
  AchievementApproval,
  | 'oid'
  | 'createdByUserOid'
  | 'createdAt'
  | 'updatedByUserOid'
  | 'updatedAt'
  | 'version'
>;

export type CreateUserEntity = Omit<
  User,
  | 'oid'
  | 'password'
  | 'passwordExpiryDatetime'
  | 'createdByUserOid'
  | 'createdAt'
  | 'updatedByUserOid'
  | 'updatedAt'
  | 'version'
>;

export type PaginationResult<T> = {
  offset: number;
  total: number;
  limit: number;
  data: T[];
};
