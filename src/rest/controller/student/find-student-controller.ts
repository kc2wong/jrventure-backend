import { Request, Response, NextFunction } from 'express';
import {
  FindStudents200ResponseDto,
  FindStudentsQueryDto,
} from '../../dto-schema';
import { findClass } from '../../../repo/class_repo';
import { entity2Dto } from '../../mapper/student-dto-mapper';
import { Class, Student } from '@prisma/client';
import { findStudent as findStudentRepo } from '../../../repo/student_repo';
import {
  classIdDto2Entity,
} from '../../mapper/class-dto-mapper';
import { asArray } from '../../../util/array-util';

export const findStudent = async (
  req: Request<{}, {}, {}, FindStudentsQueryDto>,
  res: Response<FindStudents200ResponseDto>,
  next: NextFunction
) => {
  try {
    const ids = asArray(req.query?.id);
    const classId = req.query?.classId;
    const name = req.query?.name;

    const classsKey = classId ? classIdDto2Entity(classId) : undefined;
    const clazz = classsKey
      ? await findClass(classsKey[0], classsKey[1])
      : undefined;
      let result: [Student, Class][] = [];

    if (clazz == undefined) {
      // not search by class
      result = await findStudentRepo(ids, name);
    } else {
      if (clazz.length == 1) {
        result = await findStudentRepo(ids, name, clazz[0].oid);
      } else {
        // class criteria is invalid
        result = [];
      }
    }
    res.status(200).json(result.map((item) => entity2Dto(item[0], item[1])));
  } catch (error) {
    console.log(`error = ${error}`);
    next(error);
  }
};
