import { Activity, Prisma } from '@prisma/client';
import prisma from '@repo/db';

export const updateActivityRepo = async (
  activity: Activity
): Promise<Activity> => {
  try {
    const { oid, version, ...rest } = activity; // separate controlled fields

    return await prisma.activity.update({
      where: { oid, version },
      data: { ...rest, version: { increment: 1 } },
    });
  } catch (error) {
    console.error('Error updating activity:', error);
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
