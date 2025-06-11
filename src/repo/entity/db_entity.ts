import {
  Achievement,
  AchievementAttachment,
  AchievementStatus,
  AchievementApproval,
  AchievementApprovalStatus,
  AchievementSubmissionRole,
  Activity,
  ActivityCategory,
  Class,
  Student,
  User,
  UserRole,
  UserStatus,
  ApprovalCommentType,
  AchievementApprovalReview,
  AchievementApprovalAttachment,
} from '@prisma/client';

type UserCreationEntity = Omit<
  User,
  | 'oid'
  | 'password'
  | 'password_expiry_datetime'
  | 'created_by_user_oid'
  | 'created_at'
  | 'updated_by_user_oid'
  | 'updated_at'
  | 'version'
>;

type ActivityCreationEntity = Omit<
  Activity,
  | 'oid'
  | 'created_by_user_oid'
  | 'created_at'
  | 'updated_by_user_oid'
  | 'updated_at'
  | 'version'
>;

type AchievementCreationEntity = Omit<
  Achievement,
  | 'oid'
  | 'created_by_user_oid'
  | 'created_at'
  | 'updated_by_user_oid'
  | 'updated_at'
  | 'version'
>;

type AchievementApprovalCreationEntity = Omit<
  AchievementApproval,
  | 'oid'
  | 'created_by_user_oid'
  | 'created_at'
  | 'updated_by_user_oid'
  | 'updated_at'
  | 'version'
>;

export type PaginationResult<T> = {
  offset: number;
  total: number;
  limit: number;
  data: T[];
};

export type {
  Class as ClassEntity,
  Student as StudentEntity,
  User as UserEntity,
  UserRole as UserRoleEntity,
  UserStatus as UserStatusEntity,
  UserCreationEntity,
  ActivityCategory as ActivityCategoryEntity,
  Activity as ActivityEntity,
  Achievement as AchievementEntity,
  AchievementAttachment as AchievementAttachmentEntity,
  AchievementApproval as AchievementApprovalEntity,
  AchievementApprovalReview as AchievementApprovalReviewEntity,
  AchievementApprovalAttachment as AchievementApprovalAttachmentEntity,
  ActivityCreationEntity,
  AchievementCreationEntity,
  AchievementApprovalCreationEntity,
};

// enum
export {
  AchievementStatus as AchievementStatusEntity,
  AchievementSubmissionRole as AchievementSubmissionRoleEntity,
  AchievementApprovalStatus as AchievementApprovalStatusEntity,
  ApprovalCommentType as ApprovalCommentTypeEntity,
};
