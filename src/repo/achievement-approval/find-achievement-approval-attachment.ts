import { eq } from 'drizzle-orm';
import { db, AchievementApprovalAttachment } from '@repo/db';
import {
  achievementApprovalAttachments,
} from '@db/drizzle-schema';

export const findAchievementApprovalAttachmentByAchievementApprovalOidRepo =
  async (
    achievementApprovalOid: number
  ): Promise<AchievementApprovalAttachment[]> => {
    try {
      const result = await db
        .select({
          attachment: achievementApprovalAttachments,
        })
        .from(achievementApprovalAttachments)
        .where(
          eq(
            achievementApprovalAttachments.achievementApprovalOid,
            achievementApprovalOid
          )
        );

      if (result.length > 0) {
        return result.map((a) => a.attachment);
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error creating achievement approval attachment :', error);
      throw error;
    }
  };
