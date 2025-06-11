import { Request, Response, NextFunction } from 'express';
import {
  AchievementApprovalGet200ResponseDto,
  AchievementApprovalGetQueryDto,
  AchievementApprovalStatusDto,
  AchievementSubmissionRoleDto,
} from '../../dto-schema';
import { dto2Entity as datetimeDto2Entity } from '../../mapper/datetime-dto-mapper';
import { entity2Dto } from '../../mapper/achievement-approval-mapper';
import { dto2Entity as submissionRoleDto2Entity } from '../../mapper/achievement-submission-role-dto-mapper';
import { dto2Entity as statusDto2Entity } from '../../mapper/achievement-approval-status-mapper';
import { dto2Entity as orderByDirectionDto2Entity } from '../../mapper/order-by-direction-mapper';
import { z } from 'zod';
import { findAchievementApprovalRepo } from '../../../repo/achievement-approval-repo';
import { safeParseInt } from '../../../util/string-util';

const querySchema = z.object({
  studentId: z.string().optional(),
  activityId: z.string().optional(),
  status: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) =>
      statusDto2Entity(val as AchievementApprovalStatusDto)
    ),
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

export const findAchievementApproval = async (
  req: Request<{}, {}, {}, AchievementApprovalGetQueryDto>,
  res: Response<AchievementApprovalGet200ResponseDto>,
  next: NextFunction
) => {
  const { activityId, ...rest } = querySchema.parse(req.query);
  const orderByDirection = rest.orderByDirection
    ? orderByDirectionDto2Entity(rest.orderByDirection)
    : undefined;
  const activityOid = activityId ? safeParseInt(activityId) ?? -1 : undefined;

  try {
    const { total, offset, data } = await findAchievementApprovalRepo({
      activityOid,
      ...rest,
      orderByDirection: orderByDirection,
    });
    res.status(200).json({
      total,
      offset: offset ?? rest.offset,
      limit: rest.limit,
      data: data.map(({ achievementApproval, student, activity }) =>
        entity2Dto(achievementApproval, student, activity)
      ),
    });
  } catch (error) {
    next(error);
  }
};
