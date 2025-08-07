import { eq } from 'drizzle-orm';

import { achievementApprovalReviews } from '@db/drizzle-schema';
import { db, AchievementApprovalReview } from '@repo/db';
import { logger } from '@util/logging-util';

export const findAchievementApprovalReviewByAchievementApprovalOidRepo = async (
  achievementApprovalOid: number
): Promise<AchievementApprovalReview[]> => {
  try {
    const result = await db
      .select({
        review: achievementApprovalReviews,
      })
      .from(achievementApprovalReviews)
      .where(
        eq(
          achievementApprovalReviews.achievementApprovalOid,
          achievementApprovalOid
        )
      );

    if (result.length > 0) {
      return result.map((a) => a.review);
    } else {
      return [];
    }
  } catch (error) {
    logger.error(
      `Error creating achievement approval review : ${JSON.stringify(error)}`
    );
    throw error;
  }
};
