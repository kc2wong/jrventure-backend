import { Request, Response, NextFunction } from 'express';
import {
  AchievementGet200ResponseDto,
  AchievementGetQueryDto,
  AchievementSubmissionRoleDto,
} from '../../dto-schema';
import { findAchievementRepo } from '../../../repo/achievement-repo';
import { dto2Entity as datetimeDto2Entity } from '../../mapper/datetime-dto-mapper';
import {
  entity2Dto,
} from '../../mapper/achievement-mapper';
import { dto2Entity as submissionRoleDto2Entity } from '../../mapper/achievement-submission-role-dto-mapper';
import { dto2Entity as orderByDirectionDto2Entity } from '../../mapper/order-by-direction-mapper';
import { z } from 'zod';

const querySchema = z.object({
  studentId: z.string().optional(),
  activityId: z.string().optional(),
  role: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) =>
      submissionRoleDto2Entity(val as AchievementSubmissionRoleDto)
    ),
  createDateFrom: z
    .string()
    .optional()
    .transform((val) => (val ? datetimeDto2Entity(val) : undefined)),
  orderByDirection: z
    .enum(['Ascending', 'Descending'])
    .optional()
    .default('Ascending'),
  offset: z.coerce.number().min(0).default(0),
  limit: z.coerce.number().max(100).default(5),
});

export const findAchievement = async (
  req: Request<{}, {}, {}, AchievementGetQueryDto>,
  res: Response<AchievementGet200ResponseDto>,
  next: NextFunction
) => {
  const query = querySchema.parse(req.query);
  const orderByDirection = query.orderByDirection
    ? orderByDirectionDto2Entity(query.orderByDirection)
    : undefined;

  try {
    const { total, offset, data } = await findAchievementRepo({
      ...query,
      orderByDirection: orderByDirection,
    });
    res.status(200).json({
      total,
      offset: offset ?? query.offset,
      limit: query.limit,
      data: data.map(({achievement, student, activity}) => entity2Dto(achievement, student, activity)),
    });
  } catch (error) {
    next(error);
  }
};
