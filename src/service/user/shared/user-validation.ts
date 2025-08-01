import { findUserRepo } from '@repo/user/find-user';
import { findStudentRepo } from '@repo/student/find-student';
import {
  NotFoundErrorDto,
  UserForStudentExistsErrorDto,
  UserWithEmailExistsErrorDto,
} from '@api/shared/error-schema';
import { Class, Student } from '@repo/db';

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
  const student = await findStudentRepo([studentId]);
  if (student.length !== 1) {
    throw new NotFoundErrorDto('Student', 'studentId', studentId);
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
    await findUserRepo({
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
      await findUserRepo({
        email: undefined,
        studentId: student.id,
      })
    )[0];

    if (existingUser && existingUser.user.oid !== userId) {
      throw new UserForStudentExistsErrorDto(studentId);
    }
  }
};
