import { Request, Response, NextFunction } from 'express';
import {
  ActivityGetById200ResponseDto,
  ActivityGetByIdPathDto,
} from '../../dto-schema';
import { getActivityByOid as getActivityByOidRepo } from '../../../repo/activity-repo';
import { entity2Dto } from '../../mapper/activity-mapper';
import { ActivityNotFoundErrorDto } from '../error-not-found';
import { safeParseInt } from '../../../util/string-util';

export const getActivityById = async (
  req: Request<ActivityGetByIdPathDto, {}, {}, {}>,
  res: Response<ActivityGetById200ResponseDto>,
  next: NextFunction
) => {
  const id = req.params.id;
  const oid = safeParseInt(id);

  try {
    const result = oid ? await getActivityByOidRepo(oid) : undefined;
    if (!result) {
      throw new ActivityNotFoundErrorDto(id);
    }
    res
      .status(200)
      .json(entity2Dto(result.activity, result.category));
  } catch (error) {
    next(error);
  }
};
