import {
  achievementApprovalAttachments,
  achievementApprovals,
} from '@db/drizzle-schema';
import {
  db,
  AchievementApproval,
  AchievementApprovalAttachment,
} from '@repo/db';
import { and, eq } from 'drizzle-orm';

export const updateAchievementApprovalRepo = async (
  achievement: AchievementApproval,
  attachments?: Omit<
    AchievementApprovalAttachment,
    'oid' | 'achievementApprovalOid'
  >[]
): Promise<AchievementApproval> => {
  try {
    const { oid, version, ...rest } = achievement;

    // 1. Optimistic update with version check
    const [updated] = await db
      .update(achievementApprovals)
      .set({
        ...rest,
        version: version + 1,
      })
      .where(
        and(
          eq(achievementApprovals.oid, oid),
          eq(achievementApprovals.version, version)
        )
      )
      .returning();

    if (!updated) {
      throw new Error(
        'Optimistic Locking Failed: The record was modified by another process.'
      );
    }

    // 2. If attachments exist, replace them
    if (attachments && attachments.length > 0) {
      // Delete existing attachments for the achievement
      await db
        .delete(achievementApprovalAttachments)
        .where(eq(achievementApprovalAttachments.achievementApprovalOid, oid));

      // Insert new attachments
      await db.insert(achievementApprovalAttachments).values(
        attachments.map((a) => ({
          ...a,
          achievementApprovalOid: oid,
        }))
      );
    }

    return updated;
  } catch (error) {
    console.error('Error updating achievementApproval1:', error);
    throw error;
  }
};
