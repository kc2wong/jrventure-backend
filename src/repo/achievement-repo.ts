import {
  Achievement,
  AchievementSubmissionRole,
  Prisma,
  Student,
  Activity,
  AchievementAttachment,
} from '@prisma/client';
import prisma from './db';
import { PaginationResult } from './entity/db_entity';
import { safeParseInt } from '../util/string-util';

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

export const getAchievementByIdRepo = async (
  id: string
): Promise<
  | (FindAchievementResult & {
      attachment: AchievementAttachment[];
    })
  | undefined
> => {
  const oid = safeParseInt(id);
  if (oid === undefined) {
    return undefined;
  }
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

export const createAchievementRepo = async (
  achievement: Omit<Achievement, 'oid'>,
  attachments: Omit<AchievementAttachment, 'oid' | 'achievement_oid'>[]
): Promise<Achievement> => {
  try {
    return await prisma.achievement.create({
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
      },
    });
  } catch (error) {
    console.error('Error creating achievement:', error);
    throw error;
  }
};

export const updateAchievementRepo = async (
  achievement: Achievement,
  attachments: Omit<AchievementAttachment, 'oid' | 'achievement_oid'>[]
): Promise<Achievement> => {
  try {
    const { oid, version, ...rest } = achievement; // separate controlled fields

    return await prisma.achievement.update({
      where: { oid, version },
      data: {
        ...rest,
        attachment:
          attachments.length > 0
            ? {
                deleteMany: {},
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
        version: { increment: 1 },
      },
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
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
