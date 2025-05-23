import { Request, Response, NextFunction } from 'express';
import {
  ActivityGetById200ResponseDto,
  ActivityGetByIdPathDto,
} from '../../dto-schema';
import { getActivityById as getActivityByIdRepo } from '../../../repo/activity-repo';
import { entity2Dto } from '../../mapper/activity-mapper';
import { safeParseInt } from '../../../util/string-util';
import { ActivityNotFoundErrorDto } from '../error-not-found';

export const getActivityById = async (
  req: Request<ActivityGetByIdPathDto, {}, {}, {}>,
  res: Response<ActivityGetById200ResponseDto>,
  next: NextFunction
) => {
  const idRaw = req.params.id;
  const id = safeParseInt(idRaw);

  try {
    const result = id ? await getActivityByIdRepo(id) : undefined;
    if (!result) {
      throw new ActivityNotFoundErrorDto(idRaw);
    }
    res
      .status(200)
      .json(entity2Dto(result.activity, result.category));
  } catch (error) {
    next(error);
  }
};
