import {
  Achievement,
  Prisma,
  AchievementAttachment,
} from '@prisma/client';
import prisma from '@repo/db';

export const updateAchievementRepo = async (
  achievement: Achievement,
  attachments: Omit<AchievementAttachment, 'oid' | 'achievement_oid'>[]
): Promise<Achievement> => {
  try {
    const { oid, version, ...rest } = achievement; // separate controlled fields

    return await prisma.achievement.update({
      where: { oid, version },
      data: {
        ...rest,
        attachment:
          attachments.length > 0
            ? {
                deleteMany: {},
                create: attachments.map(
                  ({ object_key, file_name, file_size, bucket_name }) => ({
                    object_key,
                    file_name,
                    file_size,
                    bucket_name,
                  })
                ),
              }
            : undefined,
        version: { increment: 1 },
      },
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
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
