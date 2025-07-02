import {
  AchievementApproval,
  AchievementApprovalStatus,
  AchievementSubmissionRole,
  Activity,
  Prisma,
  Student,
} from '@prisma/client';
import prisma from '@repo/db';
import { PaginationResult } from '@repo/entity/db_entity';

type FindAchievementParams = {
  achievementOid?: number;
  studentId?: string;
  studentOid?: number;
  activityOid?: number;
  status?: AchievementApprovalStatus;
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
    const whereClause: Prisma.AchievementApprovalWhereInput = {
      ...(status && { status: { equals: status } }),
      ...(role && { achievement_submission_role: { equals: role } }),
      ...(studentId && {
        student: {
          id: { equals: studentId },
        },
      }),
      ...(achievementOid && { achievement_oid: { equals: achievementOid } }),
      ...(studentOid && { student_oid: { equals: studentOid } }),
      ...(activityOid && { activity_oid: { equals: activityOid } }),
    };

    const orderByClause: Prisma.AchievementApprovalFindManyArgs['orderBy'] = [
      ...(orderByField
        ? [
            {
              [orderByField]: orderByDirection,
            },
          ]
        : []),
      { oid: 'asc' }, // secondary sort to ensure consistent order
    ];

    const [total, items] = await prisma.$transaction([
      prisma.achievementApproval.count({ where: whereClause }),
      prisma.achievementApproval.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
        orderBy: orderByClause,
        include: { activity: true, student: true },
      }),
    ]);

    return {
      offset,
      limit: limit ?? total,
      total,
      data: items.map(({ student, activity, ...rest }) => {
        return { achievementApproval: rest, student, activity };
      }),
    };
  } catch (error) {
    console.error('Error fetching achievement approval:', error);
    throw error;
  }
};
