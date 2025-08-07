import { NextFunction, Request, Response } from 'express';

import { listActivityCategoryService } from '@service/activity-category/list-activity-category';

import { ListActivityCategory200ResponseDto } from './activity-category-schema';

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
