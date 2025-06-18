import { Student, User } from '@prisma/client';
import prisma from '@repo/db';

export const createUserRepo = async (
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
                create: students.map((s, idx) => ({
                  sequence: idx + 1, // Assign a sequence value
                  student: { connect: { oid: s.oid } },
                })),
              }
            : undefined,
      },
      include: {
        entitled_students: false,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
