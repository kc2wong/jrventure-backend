import { eq } from 'drizzle-orm';

import { achievementAttachments } from '@db/drizzle-schema';
import { db, AchievementAttachment } from '@repo/db';
import { logger } from '@util/logging-util';

export const findAchievementAttachmentByAchievementOidRepo = async (
  achievementOid: number
): Promise<AchievementAttachment[]> => {
  try {
    const result = await db
      .select({
        attachment: achievementAttachments,
      })
      .from(achievementAttachments)
      .where(eq(achievementAttachments.achievementOid, achievementOid));

    if (result.length > 0) {
      return result.map((a) => a.attachment);
    } else {
      return [];
    }
  } catch (error) {
    logger.error(
      `Error finding achievement attachment : ${JSON.stringify(error)}`
    );
    throw error;
  }
};
