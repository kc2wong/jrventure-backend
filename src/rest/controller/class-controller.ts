import { Request, Response, NextFunction } from 'express';
import { GetClasses200ResponseDto, GetClassesQueryDto } from '../dto-schema';
import { findClass } from '../../repo/class_repo';
import { entity2Dto } from '../mapper/class-dto-mapper';

export const findClasses = async (
  req: Request<{}, {}, {}, GetClassesQueryDto>,
  res: Response<GetClasses200ResponseDto>,
  next: NextFunction
) => {
  try {
    const grade = req.query?.grade;

    const classNumber = req.query?.classNumber;

    const result = await findClass(grade, classNumber);
    res.status(200).json(result.map((item) => entity2Dto(item)));
  } catch (error) {
    next(error);
  }
};
