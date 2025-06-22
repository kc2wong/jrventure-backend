import { Class, Student, User, UserRole, UserStatus } from '@prisma/client';
import prisma from '@repo/db';

type FindUserParams = {
  id?: number[];
  name?: string;
  email?: string;
  status?: UserStatus[];
  role?: UserRole[];
  studentId?: string; // classId and studentNumber
};

type FindUserResult = {
  user: User;
  studentWithClass: { student: Student; clazz: Class }[];
};

  export const findUserRepo = async ({
    id,
    name,
    email,
    status,
    role,
    studentId,
  }: FindUserParams): Promise<FindUserResult[]> => {
  try {
    const users = await prisma.user.findMany({
      where: {
        ...(id && { oid: { in: id } }),
        ...(email && { email }),
        ...(name && {
          OR: [
            { name_en: { contains: name, mode: 'insensitive' } },
            { name_zh_hans: { contains: name, mode: 'insensitive' } },
            { name_zh_hant: { contains: name, mode: 'insensitive' } },
          ],
        }),
        ...(status && { status: { in: status } }),
        ...(role && { role: { in: role } }),
        ...(studentId && {
          entitled_students: {
            some: {
              student: {
                id: studentId,
              },
            },
          },
        }),
      },
      include: {
        entitled_students: {
          include: {
            student: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    });

    const results: FindUserResult[] = users.map(
      ({ entitled_students, ...user }) => ({
        user,
        studentWithClass:
          entitled_students.length === 0
            ? []
            : entitled_students
                .sort((e1, e2) => e1.sequence - e2.sequence)
                .map((es) => ({
                  student: es.student,
                  clazz: es.student.class,
                })),
      })
    );

    return results;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
