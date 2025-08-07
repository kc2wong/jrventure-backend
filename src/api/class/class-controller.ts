import { NextFunction, Request, Response } from 'express';

import { FindClassQueryDto, FindClass200ResponseDto } from '@api/class/class-schema';
import { findClassService } from '@service/class/find-class';

export const findClassApi = async (
  req: Request<{}, {}, {}, FindClassQueryDto>,
  res: Response<FindClass200ResponseDto>,
  next: NextFunction
) => {
  try {
    const students = await findClassService(req.params);
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};