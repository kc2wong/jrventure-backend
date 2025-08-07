import { and, eq } from 'drizzle-orm';

import { achievementAttachments, achievements } from '@db/drizzle-schema';
import { db, Achievement, AchievementAttachment } from '@repo/db';
import { logger } from '@util/logging-util';


export const updateAchievementRepo = async (
  achievement: Achievement,
  attachments: Omit<AchievementAttachment, 'oid' | 'achievementOid'>[]
): Promise<Achievement> => {
  const { oid, version, ...rest } = achievement;

  try {
    // 1. Optimistic update with version check
    const [updated] = await db
      .update(achievements)
      .set({
        ...rest,
        version: version + 1,
      })
      .where(and(eq(achievements.oid, oid), eq(achievements.version, version)))
      .returning();

    if (!updated) {
      throw new Error(
        'Optimistic Locking Failed: The record was modified by another process.'
      );
    }

    // 2. If attachments exist, replace them
    if (attachments.length > 0) {
      // Delete existing attachments for the achievement
      await db
        .delete(achievementAttachments)
        .where(eq(achievementAttachments.achievementOid, oid));

      // Insert new attachments
      await db.insert(achievementAttachments).values(
        attachments.map((a) => ({
          ...a,
          achievementOid: oid,
        }))
      );
    }

    return updated;
  } catch (error) {
    logger.error(`Error updating achievement: ${JSON.stringify(error)}`);
    throw error;
  }
};
