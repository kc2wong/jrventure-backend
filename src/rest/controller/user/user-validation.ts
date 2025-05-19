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
    role: z.enum(['Student', 'Parent', 'Teacher', 'Admin']),
    entitledStudentId: z.array(zodString()),
    withApprovalRight: z.boolean(),
    status: z.enum(['Active', 'Inactive', 'Suspended']),
  })
  .refine(
    (data) =>
      (data.role !== 'Teacher' && data.withApprovalRight === false) ||
      data.role === 'Teacher',
    { message: 'zod.error.NotRequired', path: ['withApprovalRight'] }
  )
  .refine(
    (data) =>
      data.role !== 'Student' ||
      (data.entitledStudentId && data.entitledStudentId.length > 0),
    { message: 'zod.error.Required', path: ['entitledStudentId'] }
  )
  .refine(
    // If role is not student / parent, then entitledStudentId must be empty
    (data) =>
      data.role === 'Student' ||
      data.role === 'Parent' ||
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
};

/**
 * Validate if student id is valid and student exists
 *
 * @param studentId
 * @returns
 */
const validateStudentId = async (studentId: string): Promise<StudentClass> => {
  const student = await findStudent([studentId]);
  if (student.length !== 1) {
    throw new StudentNotFoundByIdErrorDto(studentId);
  }

  return { student: student[0][0], clazz: student[0][1] };
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
};

export const validateStudentUserUniqueness = async (
  students: Map<string, Student>,
  userId?: number
) => {
  for (const [studentId, student] of students.entries()) {
    const existingUser = (
      await findUser({
        email: undefined,
        studentId: student.id,
      })
    )[0];

    if (existingUser && existingUser.user.oid !== userId) {
      throw new UserForStudentExistsErrorDto(studentId);
    }
  }
};
