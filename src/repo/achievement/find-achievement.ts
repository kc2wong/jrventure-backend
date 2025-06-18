import {
  Achievement,
  AchievementSubmissionRole,
  Prisma,
  Student,
  Activity,
} from '@prisma/client';
import prisma from '@repo/db';
import { PaginationResult } from '@repo/entity/db_entity';

type FindAchievementParams = {
  studentId?: string;
  studentOid?: number;
  activityOid?: number;
  role?: AchievementSubmissionRole;
  createAtFrom?: Date;
  offset?: number;
  limit?: number;
  orderByField?: 'created_at';
  orderByDirection?: 'asc' | 'desc';
};

type FindAchievementResult = {
  achievement: Achievement;
  student: Student;
  activity: Activity;
};

export const findAchievementRepo = async ({
  studentId,
  studentOid,
  activityOid,
  role,
  createAtFrom,
  offset = 0,
  limit,
  orderByField,
  orderByDirection,
}: FindAchievementParams): Promise<PaginationResult<FindAchievementResult>> => {
  try {
    const whereClause: Prisma.AchievementWhereInput = {
      ...(role && { achievement_submission_role: { equals: role } }),
      ...(createAtFrom && { created_at: { gte: createAtFrom } }),
      ...(studentId && {
        student: {
          id: { equals: studentId },
        },
      }),
      ...(studentOid && { student_oid: { equals: studentOid } }),
      ...(activityOid && { activity_oid: { equals: activityOid } }),
    };

    const orderByClause: Prisma.AchievementFindManyArgs['orderBy'] = [
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
      prisma.achievement.count({ where: whereClause }),
      prisma.achievement.findMany({
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
        return { achievement: rest, student, activity };
      }),
    };
  } catch (error) {
    console.error('Error fetching achievement:', error);
    throw error;
  }
};
