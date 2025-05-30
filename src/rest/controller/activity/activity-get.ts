import { Request, Response, NextFunction } from 'express';
import {
  AchievementSubmissionRoleDto,
  ActivityGet200ResponseDto,
  ActivityGetQueryDto,
  ActivityStatusDto,
} from '../../dto-schema';
import { findActivity as findActivityRepo } from '../../../repo/activity-repo';
import { dto2Entity as datetimeDto2Entity } from '../../mapper/datetime-dto-mapper';
import {
  entity2Dto,
  orderByFieldDto2Entity,
} from '../../mapper/activity-mapper';
import { dto2Entity as activityStatusDto2Entity } from '../../mapper/activity-status-dto-mapper';
import { dto2Entity as submissionRoleDto2Entity } from '../../mapper/achievement-submission-role-dto-mapper';
import { dto2Entity as orderByDirectionDto2Entity } from '../../mapper/order-by-direction-mapper';
import { z } from 'zod';

const querySchema = z.object({
  offset: z.coerce.number().min(0).default(0),
  limit: z.coerce.number().max(100).default(5),
});

export const activityQuerySchema = z.object({
  categoryCode: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) =>
      val === undefined ? undefined : Array.isArray(val) ? val : [val]
    ),

  name: z.string().optional(),

  startDateFrom: z
    .string()
    .optional()
    .transform((val) => (val ? datetimeDto2Entity(val) : undefined)),

  startDateTo: z
    .string()
    .optional()
    .transform((val) => (val ? datetimeDto2Entity(val) : undefined)),

  endDateFrom: z
    .string()
    .optional()
    .transform((val) => (val ? datetimeDto2Entity(val) : undefined)),

  endDateTo: z
    .string()
    .optional()
    .transform((val) => (val ? datetimeDto2Entity(val) : undefined)),

  participantGrade: z
    .union([
      z.coerce.number(),
      z
        .array(z.any())
        .transform((arr) =>
          arr.map((val) => Number(val)).filter((val) => val >= 1 && val <= 6)
        ),
    ])
    .optional()
    .transform((val) =>
      val === undefined ? undefined : Array.isArray(val) ? val : [val]
    ),

  role: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) =>
      val === undefined
        ? undefined
        : Array.isArray(val)
        ? val.map((s) => submissionRoleDto2Entity(s as AchievementSubmissionRoleDto))
        : [submissionRoleDto2Entity(val as AchievementSubmissionRoleDto)]
    ),

  status: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) =>
      val === undefined
        ? undefined
        : Array.isArray(val)
        ? val.map((s) => activityStatusDto2Entity(s as ActivityStatusDto))
        : [activityStatusDto2Entity(val as ActivityStatusDto)]
    ),

  offset: z.coerce.number().min(0).default(0),
  limit: z.coerce.number().max(100).default(5),

  orderByField: z.enum(['Name', 'StartDate', 'EndDate']).optional(),
  orderByDirection: z
    .enum(['Ascending', 'Descending'])
    .optional()
    .default('Ascending'),
});

export const findActivity = async (
  req: Request<{}, {}, {}, ActivityGetQueryDto>,
  res: Response<ActivityGet200ResponseDto>,
  next: NextFunction
) => {
  const query = activityQuerySchema.parse(req.query);
  const orderByDirection = query.orderByDirection
    ? orderByDirectionDto2Entity(query.orderByDirection)
    : undefined;
  const orderByField = query.orderByField
    ? orderByFieldDto2Entity(query.orderByField)
    : undefined;

  try {
    const { total, offset, data } = await findActivityRepo({
      ...query,
      orderByField: orderByField,
      orderByDirection: orderByDirection,
    });
    res.status(200).json({
      total,
      offset: offset ?? query.offset,
      limit: query.limit,
      data: data.map((item) => entity2Dto(item.activity, item.category)),
    });
  } catch (error) {
    next(error);
  }
};
