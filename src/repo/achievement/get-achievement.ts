import {
  Achievement,
  Student,
  Activity,
  AchievementAttachment,
} from '@prisma/client';
import prisma from '@repo/db';
import { safeParseInt } from '@util/string-util';

type GetAchievementResult = {
  achievement: Achievement;
  student: Student;
  activity: Activity;
  attachment: AchievementAttachment[];
};

export const getAchievementByOidRepo = async (
  oid: number
): Promise<GetAchievementResult | undefined> => {
  try {
    const result = await prisma.achievement.findUnique({
      where: {
        oid: oid,
      },
      include: {
        activity: true,
        student: true,
        attachment: true,
      },
    });
    if (result) {
      const { student, activity, attachment, ...rest } = result;
      return {
        achievement: rest,
        student,
        activity,
        attachment,
      };
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('Error fetching achievement:', error);
    throw error;
  }
};
