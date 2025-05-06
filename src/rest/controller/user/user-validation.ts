import { z } from 'zod';
import { zodEmail, zodOptionalString, zodString } from '../../../type/zod';
import { UserCreationDto } from '../../dto-schema';
import {
  NotRequiredFieldValueErrorDto,
  InvalidFieldValueErrorDto,
  UserWithEmailExistsErrorDto,
  UserForStudentExistsErrorDto,
  StudentNotFoundByIdErrorDto,
} from '../error-validation';
import { Class, Student } from '@prisma/client';
import { findUser } from '../../../repo/user_repo';
import { studentIdDto2Entity } from '../../mapper/student-dto-mapper';
import { classIdDto2Entity } from '../../mapper/class-dto-mapper';
import { findClass } from '../../../repo/class_repo';
import { findStudent } from '../../../repo/student_repo';

const UserSchema = z
  .object({
    email: zodEmail(),
    name: z
      .record(zodOptionalString())
      .refine((data) => data['English'] && data['English'].trim().length > 0, {
        message: 'zod.error.Required',
        path: ['English'], // path of error
      }),
    role: z.enum(['Student', 'Teacher', 'Admin']),
    entitledStudentId: z.array(zodString()),
    status: z.enum(['Active', 'Inactive', 'Suspended']),
  })
  .refine(
    (data) =>
      data.role !== 'Student' ||
      (data.entitledStudentId && data.entitledStudentId.length > 0),
    { message: 'zod.error.Required', path: ['entitledStudentId'] }
  )
  .refine(
    (data) =>
      data.role === 'Student' ||
      !data.entitledStudentId ||
      data.entitledStudentId.length == 0,
    { message: 'zod.error.NotRequired', path: ['entitledStudentId'] }
  );

export const validateField = (userCreationDto: UserCreationDto) => {
  const result = UserSchema.safeParse(userCreationDto);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const invalidValue = firstIssue.path.reduce(
      (obj: any, key) => obj?.[key],
      userCreationDto
    );
    const path = firstIssue.path.join('.');
    if (firstIssue.message === 'zod.error.NotRequired') {
      throw new NotRequiredFieldValueErrorDto(path, invalidValue);
    } else {
      throw new InvalidFieldValueErrorDto(invalidValue, path);
    }
  }
};

type StudentClass = {
  student: Student;
  clazz: Class;
}

/**
 * Validate if student id is valid and student exists
 *
 * @param studentId
 * @returns
 */
const validateStudentId = async (
  studentId: string
): Promise<StudentClass> => {
  // const studentIdEntity = studentIdDto2Entity(studentId);
  // if (!studentIdEntity) {
  //   throw new StudentNotFoundByIdErrorDto(studentId);
  // }

  // const classId = classIdDto2Entity(studentIdEntity[0]);
  // if (!classId) {
  //   throw new StudentNotFoundByIdErrorDto(studentId);
  // }

  // const clazz = await findClass(classId[0], classId[1]);
  // if (clazz.length !== 1) {
  //   throw new StudentNotFoundByIdErrorDto(studentId);
  // }

  // const student = await findStudent(undefined, undefined, clazz[0].oid, studentIdEntity[1]);
  const student = await findStudent([studentId]);
  if (student.length !== 1) {
    throw new StudentNotFoundByIdErrorDto(studentId);
  }

  return {student: student[0][0], clazz: student[0][1]};
};

export async function validateStudentIds(
  studentIds: string[]
): Promise<Map<string, StudentClass>> {
  const entrires = await Promise.all(
    studentIds.map(async (id) => {
      const studentClass = await validateStudentId(id);
      return [id, studentClass] as const;
    })
  );
  return new Map(entrires);
}

/**
 * Validate if email is unique and if student id is already registered
 * @param email
 * @param studentEntries
 */
export const validateUserUniqueness = async (
  email: string,
  students: Map<string, Student>,
  userId?: number
) => {
  const existingUser = (
    await findUser({
      email,
    })
  )[0];
  if (
    existingUser &&
    (userId == undefined || userId !== existingUser.user.oid)
  ) {
    throw new UserWithEmailExistsErrorDto(email);
  }

  for (const [studentId, student] of students.entries()) {
    const existingUser = (
      await findUser({
        email: undefined,
        studentId: student.id,
        // studentId: [student.class_oid, student.student_number],
      })
    )[0];

    if (existingUser && existingUser.user.oid !== userId) {
      throw new UserForStudentExistsErrorDto(studentId);
    }
  }
}
