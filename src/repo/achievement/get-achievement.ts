import { eq } from 'drizzle-orm';
import {
  achievementAttachments,
  achievements,
  activities,
  students,
} from '@db/drizzle-schema';
import {
  db,
  Achievement,
  AchievementAttachment,
  Activity,
  Student,
} from '@repo/db';

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
    const activityJoin = eq(achievements.activityOid, activities.oid);
    const studentJoin = eq(achievements.studentOid, students.oid);
    const attachmentJoin = eq(
      achievementAttachments.achievementOid,
      achievements.oid
    );

    const result = await db
      .select({
        achievement: achievements,
        student: students,
        activity: activities,
        attachment: achievementAttachments,
      })
      .from(achievements)
      .innerJoin(activities, activityJoin)
      .innerJoin(students, studentJoin)
      .leftJoin(achievementAttachments, attachmentJoin)
      .where(eq(achievements.oid, oid));

    if (result.length > 0) {
      // Group attachments and extract student/activity from the first row
      const { achievement, student, activity } = result[0];
      const attachments: AchievementAttachment[] = result
        .map((r) => r.attachment)
        .filter((a) => a !== null && a !== undefined);

      return {
        achievement,
        student,
        activity,
        attachment: attachments,
      };
    } else {
      console.log(
        `getActivityByOid() - oid = ${oid}, number of result = ${result.length}`
      );
      return undefined;
    }
  } catch (error) {
    console.error('Error fetching achievement:', error);
    throw error;
  }
};
