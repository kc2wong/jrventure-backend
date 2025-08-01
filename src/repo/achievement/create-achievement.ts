import { achievementAttachments, achievements } from '@db/drizzle-schema';
import { db, Achievement, AchievementAttachment } from '@repo/db';

export const createAchievementRepo = async (
  achievement: Omit<Achievement, 'oid'>,
  attachments: Omit<AchievementAttachment, 'oid' | 'achievementOid'>[]
): Promise<Achievement> => {
  try {
    // 1. Insert achievement
    const [created] = await db
      .insert(achievements)
      .values(achievement)
      .returning();

    if (!created?.oid) {
      throw new Error('Failed to insert achievement.');
    }

    // 2. Insert related attachments if provided
    if (attachments.length > 0) {
      await db.insert(achievementAttachments).values(
        attachments.map((attachment) => ({
          ...attachment,
          achievementOid: created.oid,
        }))
      );
    }

    return created;
  } catch (error) {
    console.error('Error creating achievement:', error);
    throw error;
  }
};
