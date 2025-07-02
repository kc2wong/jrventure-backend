import { achievementSubmissionRoleSchema } from '@api/activity/activity-schema';
import { components, paths } from '@openapi/schema';
import {
  zodEnum,
  zodNumber,
  zodOptionalDate,
  zodOptionalEnum,
  zodOptionalString,
  zodString,
} from '@type/zod';
import { z } from 'zod';

export const achievementApprovalStatusSchema = zodEnum(['Pending', 'Rejected']);

export const findAchievementApprovalQuerySchema = z.object({
  studentId: zodOptionalString(),
  activityId: zodOptionalString(),
  status: z
    .union([
      achievementApprovalStatusSchema,
      z.array(achievementApprovalStatusSchema),
    ])
    .optional(),
  role: achievementSubmissionRoleSchema.optional(),
  // role: z
  //   .union([
  //     achievementSubmissionRoleSchema,
  //     z.array(achievementSubmissionRoleSchema),
  //   ])
  //   .optional(),
  createDateFrom: zodOptionalDate(),
  orderByDirection: zodOptionalEnum(['Ascending', 'Descending']).default(
    'Ascending'
  ),
  offset: zodNumber({ min: 0 }).default(0),
  limit: zodNumber({ max: 100 }),
});

const achievementApprovalReviewCommentTypeSchema = z.enum([
  'Conversation',
  'Rejection',
]);

export const achievementApprovalReviewSchema = z.object({
  commentType: achievementApprovalReviewCommentTypeSchema,
  comment: zodString({ maxLength: 1000 }),
});

export type AchievementApprovalStatusDto =
  components['schemas']['AchievementApprovalStatus'];

export type AchievementApprovalCommentType =
  components['schemas']['ApprovalCommentType'];

export type AchievementApprovalReviewDto =
  components['schemas']['AchievementApprovalReview'];

export type AchievementApprovalDto =
  components['schemas']['AchievementApproval'];

export type AchievementApprovalDetailDto =
  components['schemas']['AchievementApprovalDetail'];

export type FindAchievementApprovalQueryDto = NonNullable<
  paths['/achievement-approvals']['get']['parameters']['query']
>;

export type FindAchievementApproval200ResponseDto =
  paths['/achievement-approvals']['get']['responses']['200']['content']['application/json'];

export type GetAchievementApprovalByIdPathDto = NonNullable<
  paths['/achievement-approvals/{id}']['get']['parameters']['path']
>;

export type GetAchievementApprovalById200ResponseDto =
  paths['/achievement-approvals/{id}']['get']['responses']['200']['content']['application/json'];

export type CreateAchievementApprovalReviewPathDto = NonNullable<
  paths['/achievement-approvals/{id}/review']['post']['parameters']['path']
>;

export type CreateAchievementApprovalReviewDto =
  paths['/achievement-approvals/{id}/review']['post']['requestBody']['content']['application/json'];

export type CreateAchievementApprovalReview201ResponseDto =
  paths['/achievement-approvals/{id}/review']['post']['responses']['201']['content']['application/json'];

export type ApproveAchievementApprovalPathDto = NonNullable<
  paths['/achievement-approvals/{id}/approval']['post']['parameters']['path']
>;

export type ApproveAchievementApproval201ResponseDto =
  paths['/achievement-approvals/{id}/approval']['post']['responses']['201']['content']['application/json'];

export type ProfanityCheckAchievementApprovalPathDto = NonNullable<
  paths['/achievement-approvals/{id}/profanity-check']['post']['parameters']['path']
>;
