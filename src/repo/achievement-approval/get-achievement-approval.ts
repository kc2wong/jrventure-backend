import {
  AchievementApproval,
  AchievementApprovalAttachment,
  AchievementApprovalReview,
  Activity,
  Student,
} from '@prisma/client';
import prisma from '@repo/db';
import { safeParseInt } from '@util/string-util';

type GetAchievementApprovalResult = {
  achievementApproval: AchievementApproval;
  student: Student;
  activity: Activity;
  attachment: AchievementApprovalAttachment[];
};
export const getAchievementApprovalByOidRepo = async (
  oid: number
): Promise<
  | (GetAchievementApprovalResult & { review: AchievementApprovalReview[] } & {
      attachment: AchievementApprovalAttachment[];
    })
  | undefined
> => {
  try {
    const result = await prisma.achievementApproval.findUnique({
      where: {
        oid: oid,
      },
      include: {
        activity: true,
        student: true,
        review: true,
        attachment: true,
      },
    });
    if (result) {
      const { student, activity, review, attachment, ...rest } = result;
      return {
        achievementApproval: rest,
        student,
        activity,
        review,
        attachment,
      };
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('Error fetching achievement approval:', error);
    throw error;
  }
};
