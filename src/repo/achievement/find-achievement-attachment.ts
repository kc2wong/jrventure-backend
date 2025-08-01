import { eq } from 'drizzle-orm';
import { db, AchievementAttachment } from '@repo/db';
import { achievementAttachments } from '@db/drizzle-schema';

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
    console.error('Error finding achievement attachment :', error);
    throw error;
  }
};
