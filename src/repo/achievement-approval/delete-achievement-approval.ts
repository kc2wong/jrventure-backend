import { Prisma } from '@prisma/client';
import prisma from '@repo/db';

export const deleteAchievementApprovalRepo = async (
  oid: number,
  version: number
): Promise<void> => {
  try {
    await prisma.$transaction([
      prisma.achievementApprovalReview.deleteMany({
        where: { achievement_approval_oid: oid },
      }),
      prisma.achievementApprovalAttachment.deleteMany({
        where: { achievement_approval_oid: oid },
      }),
      prisma.achievementApproval.delete({
        where: { oid, version }, // Use composite if needed
      }),
    ]);
  } catch (error) {
    console.error('Error delete achievementApproval1:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new Error(
          'Optimistic Locking Failed: The record was modified by another process.'
        );
      }
    }
    throw error;
  }
};
