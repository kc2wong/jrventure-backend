import { achievementSubmissionRoleSchema } from '@api/activity/activity-schema';
import { paginationQuerySchema } from '@api/shared/search-schema';
import { components, paths } from '@openapi/schema';
import {
  zodNumber,
  zodOptionalDate,
  zodOptionalEnum,
  zodOptionalNumber,
  zodOptionalString,
  zodString,
} from '@type/zod';
import { asArray } from '@util/array-util';
import { z } from 'zod';

export const findAchievementQuerySchema = paginationQuerySchema.extend({
  studentId: zodOptionalString(),
  activityId: zodOptionalString(),
  role: z
    .union([
      achievementSubmissionRoleSchema,
      z.array(achievementSubmissionRoleSchema),
    ])
    .optional()
    .transform((val) => asArray(val)),
  createDateFrom: zodOptionalDate(),
  offset: zodNumber({ min: 0 }).default(0),
  limit: zodNumber({ max: 100 }),
  orderByDirection: zodOptionalEnum(['Ascending', 'Descending']).default(
    'Ascending'
  ),
});

const achievementAttachmentSchema = z.object({
  fileName: z.string().max(50),
  bucketName: z.string().max(50),
  objectKey: z.string().max(200),
});

const achievementBaseSchema = z.object({
  activityId: zodString(),
  studentId: zodString(),
  rating: zodOptionalNumber({ min: 1, max: 5 }),
  comment: zodString({ maxLength: 1000 }),
  version: zodNumber(),
  attachment: z.array(achievementAttachmentSchema),
});

export const createAchievementSchema = achievementBaseSchema.omit({
  version: true,
});
export const updateAchievementSchema = achievementBaseSchema;

export type AchievementStatusDto = components['schemas']['AchievementStatus'];

export type AchievementSubmissionRoleDto =
  components['schemas']['AchievementSubmissionRole'];

export type AchievementAttachmentDto =
  components['schemas']['AchievementAttachment'];

export type AchievementDto = components['schemas']['Achievement'];

export type AchievementDetailDto = components['schemas']['AchievementDetail'];

export type FindAchievementQueryDto = NonNullable<
  paths['/achievements']['get']['parameters']['query']
>;
export type FindAchievement200ResponseDto =
  paths['/achievements']['get']['responses']['200']['content']['application/json'];

export type CreateAchievementDto =
  paths['/achievements']['post']['requestBody']['content']['application/json'];

export type CreateAchievement201ResponseDto =
  paths['/achievements']['post']['responses']['201']['content']['application/json'];

export type GetAchievementByIdPathDto = NonNullable<
  paths['/achievements/{id}']['get']['parameters']['path']
>;

export type GetAchievementById200ResponseDto =
  paths['/achievements/{id}']['get']['responses']['200']['content']['application/json'];

export type UpdateAchievementPathDto = NonNullable<
  paths['/achievements/{id}']['put']['parameters']['path']
>;
export type UpdateAchievementDto =
  paths['/achievements/{id}']['put']['requestBody']['content']['application/json'];

export type UpdateAchievement200ResponseDto =
  paths['/achievements/{id}']['put']['responses']['200']['content']['application/json'];
