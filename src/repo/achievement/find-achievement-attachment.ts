import { AchievementAttachment } from '@prisma/client';
import prisma from '@repo/db';

export const findAchievementAttachmentByAchievementOidRepo = async (
  achievementOid: number
): Promise<AchievementAttachment[]> => {
  try {
    return await prisma.achievementAttachment.findMany({
      where: {
        achievement_oid: achievementOid,
      },
    });
  } catch (error) {
    console.error('Error creating achievement attachment :', error);
    throw error;
  }
};
