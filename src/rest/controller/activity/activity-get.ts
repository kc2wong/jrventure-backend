import { Request, Response, NextFunction } from 'express';
import {
  ActivityGet200ResponseDto,
  ActivityGetQueryDto,
} from '../../dto-schema';
import { findActivity as findActivityRepo } from '../../../repo/activity-repo';
import { asArray } from '../../../util/array-util';
import { dto2Entity as datetimeDto2Entity } from '../../mapper/datetime-dto-mapper';
import { entity2Dto } from '../../mapper/activity-mapper';
import { safeParseInt } from '../../../util/string-util';

export const findActivity = async (
  req: Request<{}, {}, {}, ActivityGetQueryDto>,
  res: Response<ActivityGet200ResponseDto>,
  next: NextFunction
) => {
  const categoryCode = asArray(req.query?.categoryCode);
  const name = req.query?.name;
  const startDateFrom = req.query?.startDateFrom
    ? datetimeDto2Entity(req.query?.startDateFrom)
    : undefined;
  const startDateTo = req.query?.startDateTo
    ? datetimeDto2Entity(req.query?.startDateTo)
    : undefined;
  const endDateFrom = req.query?.endDateFrom
    ? datetimeDto2Entity(req.query?.endDateFrom)
    : undefined;
  const endDateTo = req.query?.endDateTo
    ? datetimeDto2Entity(req.query?.endDateTo)
    : undefined;
  const participantGrade = req.query?.participantGrade
    ? asArray(req.query?.participantGrade)
    : undefined;
  const status = asArray(req.query?.status);

  try {
    const result = await findActivityRepo({
      categoryCode,
      name,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      participantGrade,
      status,
    });
    res
      .status(200)
      .json(result.map((item) => entity2Dto(item.activity, item.category)));
  } catch (error) {
    next(error);
  }
};
