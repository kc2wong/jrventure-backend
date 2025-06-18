import { AchievementApprovalAttachment, AchievementApprovalReview } from '@prisma/client';
import prisma from '@repo/db';

export const findAchievementApprovalReviewByAchievementApprovalOidRepo =
  async (
    achievementApprovalOid: number
  ): Promise<AchievementApprovalReview[]> => {
    try {
      return await prisma.achievementApprovalReview.findMany({
        where: {
          achievement_approval_oid: achievementApprovalOid,
        },
      });
    } catch (error) {
      console.error('Error creating achievement approval review :', error);
      throw error;
    }
  };
