import {
  AchievementApproval,
  AchievementApprovalAttachment,
  Prisma,
} from '@prisma/client';
import prisma from '@repo/db';

export const updateAchievementApprovalRepo = async (
  achievement: AchievementApproval,
  attachments?: Omit<
    AchievementApprovalAttachment,
    'oid' | 'achievement_approval_oid'
  >[]
): Promise<AchievementApproval> => {
  try {
    const { oid, version, ...rest } = achievement;

    return await prisma.achievementApproval.update({
      where: { oid, version },
      data: {
        ...rest,
        ...(attachments !== undefined && {
          attachment: {
            deleteMany: {},
            create: attachments.map(
              ({ object_key, file_name, file_size, bucket_name }) => ({
                object_key,
                file_name,
                file_size,
                bucket_name,
              })
            ),
          },
        }),
        version: { increment: 1 },
      },
    });
  } catch (error) {
    console.error('Error updating achievementApproval1:', error);
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
