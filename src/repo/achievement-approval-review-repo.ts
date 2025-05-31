import {
  AchievementApprovalReview,
} from '@prisma/client';
import prisma from './db';

export const createAchievementApprovalReview = async (
  review: Omit<AchievementApprovalReview, 'oid'>
): Promise<AchievementApprovalReview> => {
  try {
    return await prisma.achievementApprovalReview.create({
      data: {
        ...review,
      },
    });
  } catch (error) {
    console.error('Error creating achievement approval review :', error);
    throw error;
  }
};
