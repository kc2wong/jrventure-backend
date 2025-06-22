import { NextFunction, Request, Response } from 'express';
import { FindStudent200ResponseDto, FindStudentQueryDto } from '@api/student/student-schema';
import { findStudentService } from '@service/student/find-student';

export const findStudentApi = async (
  req: Request<{}, {}, {}, FindStudentQueryDto>,
  res: Response<FindStudent200ResponseDto>,
  next: NextFunction
) => {
  try {
    const students = await findStudentService(req.query);
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};