import { Request, Response, NextFunction } from 'express';
import { UserGet200ResponseDto, UserGetQueryDto } from '../../dto-schema';
import { entity2Dto } from '../../mapper/user-dto-mapper';
import { dto2Entity as roleDto2Entity } from '../../mapper/user-role-dto-mapper';
import { dto2Entity as statusDto2Entity } from '../../mapper/user-status-dto-mapper';
import { findUser } from '../../../repo/user_repo';
import { findClass } from '../../../repo/class_repo';
import { classIdDto2Entity } from '../../mapper/class-dto-mapper';
import { asArray } from '../../../util/array-util';
import { studentIdDto2Entity } from '../../mapper/student-dto-mapper';

export const userGet = async (
  req: Request<{}, {}, {}, UserGetQueryDto>,
  res: Response<UserGet200ResponseDto>,
  next: NextFunction
) => {
  try {
    const id = asArray(req.query?.id)?.map((i) => parseInt(i));
    // const id = req.query?.id?.map((item) => parseInt(item));
    const email = req.query?.email;
    const name = req.query?.name;
    const studentId = req.query?.studentId;

    const role = asArray(req.query?.role);
    const status = asArray(req.query?.status);

    const users = await findUser({
      id,
      email,
      name,
      status: status ? status.map((s) => statusDto2Entity(s)) : undefined,
      role: role ? role.map((r) => roleDto2Entity(r)) : undefined,
      studentId,
    });
    res.status(200).json(
      users.map((u) =>
        entity2Dto(
          u.user,
          u.studentWithClass.map((sc) => [sc.student, sc.clazz])
        )
      )
    );


  } catch (error) {
    next(error);
  }
};

type StudentIdResolution = {
  classId: number;
  studentNumber: number;
};

const InvalidStudentId: StudentIdResolution = {
  classId: -1,
  studentNumber: -1,
};

const _resolveStudentId = async (
  studentId?: string
): Promise<StudentIdResolution | undefined> => {
  if (!studentId) {
    return undefined;
  }

  const studentIdEntity = studentIdDto2Entity(studentId);
  if (!studentIdEntity) {
    return InvalidStudentId;
  }

  const classId = classIdDto2Entity(studentIdEntity[0]);
  if (!classId) {
    return InvalidStudentId;
  }
  const clazz = await findClass(classId[0], classId[1]);
  if (clazz.length != 1) {
    return InvalidStudentId;
  }

  return { classId: clazz[0].oid, studentNumber: studentIdEntity[1] };
};
