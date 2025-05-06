import { Class, Prisma, Student, User, UserRole, UserStatus } from '@prisma/client';
import prisma from './db'; // or wherever your prisma instance is

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

export const findUser = async ({
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
                // class_oid: studentId[0],
                // student_number: studentId[1],
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
            : entitled_students.map((es) => ({
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

export const createUser = async (
  user: Omit<User, 'oid'>,
  students: Student[]
): Promise<User> => {
  try {
    return await prisma.user.create({
      data: {
        ...user,
        entitled_students:
          students.length > 0
            ? {
                create: students.map((s) => ({
                  student: { connect: { oid: s.oid } },
                })),
              }
            : undefined,
      },
      include: {
        entitled_students: true,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (
  user: User,
  students?: Student[]
): Promise<User> => {
  try {
    const { oid, updated_at, version, ...rest } = user; // separate controlled fields

    if (students) {
      return await prisma.user.update({
        where: { oid, version },
        data: {
          ...rest,
          entitled_students: {
            deleteMany: {}, // delete all existing entitled_students
            create: students.map((student) => ({
              student: {
                connect: { oid: student.oid },
              },
            })),
          },
          version: { increment: 1 },
        },
      });
    } else {
      return await prisma.user.update({
        where: { oid, version },
        data: { ...rest, version: { increment: 1 } },
      });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new Error(
          'Optimistic Locking Failed: The record was modified by another process.'
        );
      }
    }
    throw error;
  }
};
