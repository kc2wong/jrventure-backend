import { eq } from 'drizzle-orm';
import { db, AchievementApprovalReview } from '@repo/db';
import { achievementApprovalReviews } from '@db/drizzle-schema';

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
    console.error('Error creating achievement approval review :', error);
    throw error;
  }
};
