import { Achievement, AchievementAttachment } from '@prisma/client';
import prisma from '@repo/db';

export const createAchievementRepo = async (
  achievement: Omit<Achievement, 'oid'>,
  attachments: Omit<AchievementAttachment, 'oid' | 'achievement_oid'>[]
): Promise<Achievement> => {
  try {
    return await prisma.achievement.create({
      data: {
        ...achievement,
        attachment:
          attachments.length > 0
            ? {
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
      },
    });
  } catch (error) {
    console.error('Error creating achievement:', error);
    throw error;
  }
};
