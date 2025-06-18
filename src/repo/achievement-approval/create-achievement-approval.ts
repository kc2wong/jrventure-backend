import {
  AchievementApproval,
  AchievementApprovalAttachment,
  AchievementApprovalReview,
} from '@prisma/client';
import prisma from '@repo/db';
import { create } from 'domain';

export const createAchievementApprovalRepo = async (
  achievement: Omit<AchievementApproval, 'oid'>,
  attachments: Omit<
    AchievementApprovalAttachment,
    'oid' | 'achievement_approval_oid'
  >[],
  reviews: Omit<AchievementApprovalReview, 'oid' | 'achievement_approval_oid'>[]
): Promise<AchievementApproval> => {
  try {
    return await prisma.achievementApproval.create({
      data: {
        ...achievement,
        attachment:
          attachments.length > 0
            ? {
                create: attachments.map(
                  ({ object_key, file_name, file_size, bucket_name }) => ({
                    object_key,
                    file_name,
                    file_size,
                    bucket_name,
                  })
                ),
              }
            : undefined,
        review:
          reviews.length > 0
            ? {
                create: reviews,
              }
            : undefined,
      },
    });
  } catch (error) {
    console.error('Error creating achievement approval:', error);
    throw error;
  }
};
