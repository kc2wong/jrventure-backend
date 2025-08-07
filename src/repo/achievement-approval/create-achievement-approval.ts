import {
  achievementApprovalAttachments,
  achievementApprovalReviews,
  achievementApprovals,
} from '@db/drizzle-schema';
import {
  db,
  AchievementApproval,
  AchievementApprovalAttachment,
  AchievementApprovalReview,
} from '@repo/db';
import { logger } from '@util/logging-util';

export const createAchievementApprovalRepo = async (
  achievement: Omit<AchievementApproval, 'oid'>,
  attachments: Omit<
    AchievementApprovalAttachment,
    'oid' | 'achievementApprovalOid'
  >[],
  reviews: Omit<AchievementApprovalReview, 'oid' | 'achievementApprovalOid'>[]
): Promise<AchievementApproval> => {
  try {
    // 1. Insert achievement
    const [created] = await db
      .insert(achievementApprovals)
      .values(achievement)
      .returning();

    if (!created?.oid) {
      throw new Error('Failed to insert achievement.');
    }

    // 2. Insert related attachments if provided
    if (attachments.length > 0) {
      await db.insert(achievementApprovalAttachments).values(
        attachments.map((attachment) => ({
          ...attachment,
          achievementApprovalOid: created.oid,
        }))
      );
    }

    // 3. Insert related reviews if provided
    if (reviews.length > 0) {
      await db.insert(achievementApprovalReviews).values(
        reviews.map((review) => ({
          ...review,
          achievementApprovalOid: created.oid,
        }))
      );
    }

    return created;
  } catch (error) {
    logger.error(
      `Error creating achievement approval: ${JSON.stringify(error)}`
    );
    throw error;
  }
};
