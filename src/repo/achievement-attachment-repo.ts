import prisma from './db';
import { AchievementAttachmentEntity } from './entity/db_entity';

export const findByAchievementOidRepo = async (
  achievementOid: number
): Promise<AchievementAttachmentEntity[]> => {
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
