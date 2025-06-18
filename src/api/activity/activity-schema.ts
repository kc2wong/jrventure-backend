import { paginationQuerySchema } from '@api/shared/search-schema';
import { components, paths } from '@openapi/schema';
import {
  errorMessageOutOfRange,
  errorMessageRequired,
  errorMessageTooLate,
  zodBoolean,
  zodDate,
  zodEnum,
  ZodErrorObject,
  zodNumber,
  zodOptionalDate,
  zodOptionalEmail,
  zodOptionalEnum,
  zodOptionalString,
  zodString,
} from '@type/zod';
import { z } from 'zod';

export const achievementSubmissionRoleSchema = zodEnum([
  'Student',
  'Teacher',
  'Both',
]);
const activityStatusSchema = zodEnum([
  'Closed',
  'Open',
  'Scheduled',
  'Cancelled',
]);

export const findActivityQuerySchema = paginationQuerySchema.extend({
  id: z
    .union([
      zodNumber(),
      z.array(z.any()).transform((arr) => arr.map((val) => Number(val))),
    ])
    .optional()
    .transform((val) =>
      val === undefined ? undefined : Array.isArray(val) ? val : [val]
    ),
  categoryCode: z
    .union([zodString(), z.array(zodString())])
    .optional()
    .transform((val) =>
      val === undefined ? undefined : Array.isArray(val) ? val : [val]
    ),
  name: zodOptionalString(),
  startDateFrom: zodOptionalDate(),
  startDateTo: zodOptionalDate(),
  endDateFrom: zodOptionalDate(),
  endDateTo: zodOptionalDate(),
  participantGrade: z
    .union([
      zodNumber(),
      z.array(z.any()).transform((arr) => arr.map((val) => Number(val))),
    ])
    .optional()
    .transform((val) =>
      val === undefined ? undefined : Array.isArray(val) ? val : [val]
    ),
  role: z
    .union([
      achievementSubmissionRoleSchema,
      z.array(achievementSubmissionRoleSchema),
    ])
    .optional(),
  status: z
    .union([activityStatusSchema, z.array(activityStatusSchema)])
    .optional(),
  offset: zodNumber({ min: 0 }).default(0),
  limit: zodNumber({ max: 100 }),
  orderByField: zodOptionalEnum(['Name', 'StartDate', 'EndDate']),
  orderByDirection: zodOptionalEnum(['Ascending', 'Descending']).default(
    'Ascending'
  ),
});

const activityBaseSchema = z.object({
  categoryCode: zodString(),
  name: z
    .record(zodOptionalString({ maxLength: 50 }))
    .refine((data) => data['English'] && data['English'].trim().length > 0, {
      message: errorMessageRequired.message,
      path: ['English'], // path of error
    }),
  description: zodString(),
  startDate: zodDate(),
  endDate: zodDate(),
  achievementSubmissionRole: achievementSubmissionRoleSchema,
  participantGrade: z.array(zodNumber()).superRefine((arr, ctx) => {
    if (
      arr !== undefined &&
      Array.isArray(arr) &&
      arr.some((val) => val < 1 || val > 6)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMessageOutOfRange(1, 6).message, // for fallback
        path: ['participantGrade'],
        fatal: false,
      });
    }
  }),
  sharable: zodBoolean(),
  ratable: zodBoolean(),
  eCoin: zodNumber(),
  status: activityStatusSchema,
  version: zodNumber(),
});

type ActivitySchema = z.infer<typeof activityBaseSchema>;
const withRefinements = (
  schema: z.ZodType<Partial<ActivitySchema>>
): z.ZodType<Partial<ActivitySchema>> =>
  schema.superRefine((data, ctx) => {
    if (
      data.startDate !== undefined &&
      data.endDate !== undefined &&
      new Date(data.startDate).getTime() > new Date(data.endDate).getTime()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMessageTooLate(new Date(data.endDate)).message, // for fallback
        path: ['startDate'],
        fatal: false,
      });
    }
  });
export const createActivitySchema = withRefinements(
  activityBaseSchema.omit({ version: true })
);
export const updateActivitySchema = withRefinements(activityBaseSchema);

export type ActivityDto = components['schemas']['Activity'];
export type ActivityStatusDto = components['schemas']['ActivityStatus'];
export type FindActivityOrderByFieldDto =
  components['schemas']['FindActivityOrderByField'];

export type FindActivityQueryDto = NonNullable<
  paths['/activities']['get']['parameters']['query']
>;

export type FindActivity200ResponseDto =
  paths['/activities']['get']['responses']['200']['content']['application/json'];

export type GetActivityByIdPathDto =
  paths['/activities/{id}']['get']['parameters']['path'];

export type GetActivityById200ResponseDto =
  paths['/activities/{id}']['get']['responses']['200']['content']['application/json'];

export type CreateActivityDto =
  paths['/activities']['post']['requestBody']['content']['application/json'];

export type CreateActivity201ResponseDto =
  paths['/activities']['post']['responses']['201']['content']['application/json'];

export type UpdateActivityPathDto =
  paths['/activities/{id}']['put']['parameters']['path'];

export type UpdateActivityDto =
  paths['/activities/{id}']['put']['requestBody']['content']['application/json'];

export type UpdateActivity200ResponseDto =
  paths['/activities/{id}']['put']['responses']['200']['content']['application/json'];
