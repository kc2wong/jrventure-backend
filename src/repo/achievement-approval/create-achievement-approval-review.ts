import { achievementApprovalReviews } from '@db/drizzle-schema';
import { db, AchievementApprovalReview } from '@repo/db';
import { logger } from '@util/logging-util';

export const createAchievementApprovalReviewRepo = async (
  review: Omit<AchievementApprovalReview, 'oid'>
): Promise<AchievementApprovalReview> => {
  try {
    const [created] = await db
      .insert(achievementApprovalReviews)
      .values(review)
      .returning();
    return created;
  } catch (error) {
    logger.error(`Error creating achievement approval review ${JSON.stringify(error)}`);
    throw error;
  }
};
