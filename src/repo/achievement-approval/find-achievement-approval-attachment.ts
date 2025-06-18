import { AchievementApprovalAttachment } from '@prisma/client';
import prisma from '@repo/db';

export const findAchievementApprovalAttachmentByAchievementApprovalOidRepo =
  async (
    achievementApprovalOid: number
  ): Promise<AchievementApprovalAttachment[]> => {
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
