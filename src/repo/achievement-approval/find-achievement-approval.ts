import { eq, and, count } from 'drizzle-orm';

import {
  AchievementApprovalStatusEnum,
  achievementApprovals,
  activities,
  students,
} from '@db/drizzle-schema';
import {
  db,
  AchievementApproval,
  AchievementSubmissionRole,
  Activity,
  Student,
  PaginationResult,
} from '@repo/db';
import { logger } from '@util/logging-util';

type FindAchievementParams = {
  achievementOid?: number;
  studentId?: string;
  studentOid?: number;
  activityOid?: number;
  status?: AchievementApprovalStatusEnum;
  role?: AchievementSubmissionRole;
  offset?: number;
  limit?: number;
  orderByField?: 'created_at';
  orderByDirection?: 'asc' | 'desc';
};

type FindAchievementApprovalResult = {
  achievementApproval: AchievementApproval;
  student: Student;
  activity: Activity;
};

export const findAchievementApprovalRepo = async ({
  achievementOid,
  studentId,
  studentOid,
  activityOid,
  status,
  role,
  offset = 0,
  limit,
  orderByField,
  orderByDirection,
}: FindAchievementParams): Promise<
  PaginationResult<FindAchievementApprovalResult>
> => {
  try {
    const activityJoin = eq(achievementApprovals.activityOid, activities.oid);
    const studentJoin = eq(achievementApprovals.studentOid, students.oid);

    const conditions = [];

    if (role) {
      conditions.push(eq(achievementApprovals.achievementSubmissionRole, role));
    }
    if (status) {
      conditions.push(eq(achievementApprovals.status, status));
    }
    if (studentId) {
      conditions.push(eq(students.id, studentId));
    }
    if (studentOid) {
      conditions.push(eq(achievementApprovals.studentOid, studentOid));
    }
    if (activityOid) {
      conditions.push(eq(achievementApprovals.activityOid, activityOid));
    }
    if (achievementOid) {
      conditions.push(eq(achievementApprovals.achievementOid, achievementOid));
    }

    const where = and(...conditions);

    const totalQuery = await db
      .select({ count: count() })
      .from(achievementApprovals)
      .innerJoin(activities, activityJoin)
      .innerJoin(students, studentJoin)
      .where(where);

    const total = Number(totalQuery[0].count);

    const orderBy = [
      ...(orderByField
        ? [
            {
              [orderByField]: orderByDirection === 'desc' ? 'desc' : 'asc',
            } as any,
          ]
        : []),
      { oid: 'asc' },
    ];

    const data = await db
      .select({
        achievementApproval: achievementApprovals,
        student: students,
        activity: activities,
      })
      .from(achievementApprovals)
      .innerJoin(activities, activityJoin)
      .innerJoin(students, studentJoin)
      .where(where)
      .offset(offset)
      .limit(limit ?? 50)
      .orderBy(...orderBy);

    return {
      offset,
      limit: limit ?? total,
      total,
      data,
    };
  } catch (error) {
    logger.error(
      `Error fetching achievement approval: ${JSON.stringify(error)}`
    );
    throw error;
  }
};
