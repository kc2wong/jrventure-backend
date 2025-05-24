import { z, ZodNumber } from 'zod';
import {
  zodBoolean,
  zodDate,
  zodNumber,
  zodOptionalString,
  zodString,
} from '../../../type/zod';
import { ActivityPayloadDto } from '../../dto-schema';
import {
  InvalidValueErrorDto,
  ValueTooLargeErrorDto,
  ZodValidationErrorDto,
} from '../error-validation';
import { listActivityCategory as listActivityCategoryRepo } from '../../../repo/activity-category-repo';
import { ActivityCategoryEntity } from '../../../repo/entity/db_entity';

const ActivitySchema = z.object({
  categoryCode: zodString(),
  name: z
    .record(zodOptionalString())
    .refine((data) => data['English'] && data['English'].trim().length > 0, {
      message: 'zod.error.Required',
      path: ['English'], // path of error
    }),
  description: zodString(),
  startDate: zodDate(),
  endDate: zodDate(),
  participantGrade: z
    .array(z.number())
    .refine(
      (data) => {
        return data.length > 0;
      },
      {
        message: 'zod.error.Required',
      }
    )
    .refine(
      (data) => {
        return data.filter((grade) => grade >= 1 && grade <= 6);
      },
      {
        message: 'zod.error.Invalid'
      }
    ),
  sharable: zodBoolean(),
  ratable: zodBoolean(),
  eCoin: zodNumber({ minValue: 0 }),
  achievementSubmissionRole: z.enum(['Student', 'Teacher', 'Both']),
  status: z.enum(['Open', 'Closed', 'Cancelled', 'Sceduled']),
});

export const validateField = (activityPayloadDto: ActivityPayloadDto) => {
  const result = ActivitySchema.safeParse(activityPayloadDto);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const invalidValue = firstIssue.path.reduce(
      (obj: any, key) => obj?.[key],
      activityPayloadDto
    );
    const path = firstIssue.path.join('.');
    throw new ZodValidationErrorDto(firstIssue.message, path, invalidValue);
  }

  const {startDate, endDate} = result.data;
  if (startDate > endDate) {
    throw new ValueTooLargeErrorDto(
      endDate.toString(),
      'startDate'
    );
  }
};

export const validateActivityCategory = async (
  activityCategoryCode: string
): Promise<ActivityCategoryEntity> => {
  const ac  = (await listActivityCategoryRepo()).find((ac) => ac.code === activityCategoryCode);
  if (ac) {
    return ac;
  }
  else {
    throw new InvalidValueErrorDto(
      activityCategoryCode,
      'activityCategoryCode'
    );
  }
};
