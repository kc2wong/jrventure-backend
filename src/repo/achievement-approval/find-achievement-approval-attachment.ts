import { eq } from 'drizzle-orm';

import {
  achievementApprovalAttachments,
} from '@db/drizzle-schema';
import { db, AchievementApprovalAttachment } from '@repo/db';
import { logger } from '@util/logging-util';

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
      logger.error(`Error creating achievement approval attachment : ${JSON.stringify(error)}`);
      throw error;
    }
  };
