import { Prisma, Student, User } from '@prisma/client';
import prisma from '@repo/db';

export const updateUserRepo = async (
  user: User,
  students?: Student[]
): Promise<User> => {
  try {
    const { oid, version, ...rest } = user; // separate controlled fields

    if (students) {
      return await prisma.user.update({
        where: { oid, version },
        data: {
          ...rest,
          entitled_students: {
            deleteMany: {}, // delete all existing entitled_students
            create: students.map((s, idx) => ({
              sequence: idx + 1, // Assign a sequence value
              student: {
                connect: { oid: s.oid },
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
