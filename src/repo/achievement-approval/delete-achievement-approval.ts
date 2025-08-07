import { and, eq } from 'drizzle-orm';

import {
  achievementApprovalAttachments,
  achievementApprovalReviews,
  achievementApprovals,
} from '@db/drizzle-schema';
import { db } from '@repo/db';
import { logger } from '@util/logging-util';

export const deleteAchievementApprovalRepo = async (
  oid: number,
  version: number
): Promise<void> => {
  try {
    await db.transaction(async (tx) => {
      // 1. Delete related reviews
      await tx
        .delete(achievementApprovalReviews)
        .where(eq(achievementApprovalReviews.achievementApprovalOid, oid));

      // 2. Delete related attachments
      await tx
        .delete(achievementApprovalAttachments)
        .where(eq(achievementApprovalAttachments.achievementApprovalOid, oid));

      // 3. Delete approval itself (with version check)
      const deleted = await tx
        .delete(achievementApprovals)
        .where(
          and(
            eq(achievementApprovals.oid, oid),
            eq(achievementApprovals.version, version)
          )
        );

      if (deleted.rowCount != 1) {
        throw new Error(
          'Optimistic Locking Failed: The record was modified by another process.'
        );
      }
    });
  } catch (error) {
    logger.error(`Error delete achievementApproval1: ${JSON.stringify(error)}`);
    throw error;
  }
};
