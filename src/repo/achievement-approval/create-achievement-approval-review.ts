import { achievementApprovalReviews } from '@db/drizzle-schema';
import { db, AchievementApprovalReview } from '@repo/db';

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
    console.error('Error creating achievement approval review :', error);
    throw error;
  }
};
