import { eq } from 'drizzle-orm';

import {
  achievementApprovalAttachments,
  achievementApprovalReviews,
  achievementApprovals,
  activities,
  students,
} from '@db/drizzle-schema';
import {
  db,
  AchievementApproval,
  AchievementApprovalAttachment,
  AchievementApprovalReview,
  Activity,
  Student,
} from '@repo/db';
import { logger } from '@util/logging-util';

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
    const activityJoin = eq(achievementApprovals.activityOid, activities.oid);
    const studentJoin = eq(achievementApprovals.studentOid, students.oid);
    const attachmentJoin = eq(
      achievementApprovalAttachments.achievementApprovalOid,
      achievementApprovals.oid
    );
    const reviewJoin = eq(
      achievementApprovalReviews.achievementApprovalOid,
      achievementApprovals.oid
    );

    const result = await db
      .select({
        achievementApproval: achievementApprovals,
        student: students,
        activity: activities,
        attachment: achievementApprovalAttachments,
        review: achievementApprovalReviews,
      })
      .from(achievementApprovals)
      .innerJoin(activities, activityJoin)
      .innerJoin(students, studentJoin)
      .leftJoin(achievementApprovalAttachments, attachmentJoin)
      .leftJoin(achievementApprovalReviews, reviewJoin)
      .where(eq(achievementApprovals.oid, oid));

    if (result.length > 0) {
      // Group attachments and extract student/activity from the first row
      const { achievementApproval, student, activity } = result[0];
      const attachments = result
        .map((r) => r.attachment)
        .filter((a) => a !== null && a !== undefined);
      const reviews = result
        .map((r) => r.review)
        .filter((r) => r !== null && r !== undefined);

      return {
        achievementApproval,
        student,
        activity,
        attachment: attachments,
        review: reviews,
      };
    } else {
      logger.info(
        `getActivityByOid() - oid = ${oid}, number of result = ${result.length}`
      );
      return undefined;
    }
  } catch (error) {
    logger.error(`Error fetching achievement approval: ${JSON.stringify(error)}`);
    throw error;
  }
};
