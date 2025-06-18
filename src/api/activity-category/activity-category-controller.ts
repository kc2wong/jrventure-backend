import { NextFunction, Request, Response } from 'express';
import { ListActivityCategory200ResponseDto } from './activity-category-schema';
import { listActivityCategoryService } from '@service/activity-category/list-activity-category';

export const listActivityCategoryApi = async (
  req: Request<{}, {}, {}>,
  res: Response<ListActivityCategory200ResponseDto>,
  next: NextFunction
) => {
  try {
    const result = await listActivityCategoryService();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
