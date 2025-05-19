import { Request, Response, NextFunction } from 'express';
import {
  GetClassesQueryDto,
  ActivityCategoryGet200ResponseDto,
} from '../../dto-schema';
import { entity2Dto } from '../../mapper/activity-category-mapper';
import { listActivityCategory as listActivityCategoryRepo } from '../../../repo/activity-category-repo';

export const listActivityCategory = async (
  _req: Request<{}, {}, {}, {}>,
  res: Response<ActivityCategoryGet200ResponseDto>,
  next: NextFunction
) => {
  try {
    const result = await listActivityCategoryRepo();
    res.status(200).json(result.map((item) => entity2Dto(item)));
  } catch (error) {
    next(error);
  }
};
