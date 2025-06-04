import prisma from './db';
import { AchievementApprovalAttachmentEntity } from './entity/db_entity';

export const findByAchievementApprovalOidRepo = async (
  achievementApprovalOid: number
): Promise<AchievementApprovalAttachmentEntity[]> => {
  try {
    return await prisma.achievementApprovalAttachment.findMany({
      where: {
        achievement_approval_oid: achievementApprovalOid,
      },
    });
  } catch (error) {
    console.error('Error creating achievement approval attachment :', error);
    throw error;
  }
};
