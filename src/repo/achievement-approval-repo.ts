import {
  AchievementApproval,
  AchievementApprovalAttachment,
  AchievementApprovalReview,
  AchievementSubmissionRole,
  Activity,
  Prisma,
  Student,
} from '@prisma/client';
import prisma from './db';
import { PaginationResult } from './entity/db_entity';
import { safeParseInt } from '../util/string-util';

type FindAchievementParams = {
  studentId?: string;
  studentOid?: number;
  activityOid?: number;
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
  studentId,
  studentOid,
  activityOid,
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
      ...(role && { achievement_submission_role: { equals: role } }),
      ...(studentId && {
        student: {
          id: { equals: studentId },
        },
      }),
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

export const getAchievementApprovalByIdRepo = async (
  id: string
): Promise<
  | (FindAchievementApprovalResult & { review: AchievementApprovalReview[] } & { attachment: AchievementApprovalAttachment[] })
  | undefined
> => {
  const oid = safeParseInt(id);
  if (oid === undefined) {
    return undefined;
  }
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
        attachment
      };
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('Error fetching achievement approval:', error);
    throw error;
  }
};

export const createAchievementApproval = async (
  achievement: Omit<AchievementApproval, 'oid'>,
  attachments: Omit<AchievementApprovalAttachment, 'oid' | 'achievement_approval_oid'>[]
): Promise<AchievementApproval> => {
  try {
    return await prisma.achievementApproval.create({
      data: {
        ...achievement,
        attachment:
          attachments.length > 0
            ? {
                create: attachments.map(
                  ({ object_key, file_name, file_size }) => ({
                    object_key,
                    file_name,
                    file_size,
                  })
                ),
              }
            : undefined,
      },
    });
  } catch (error) {
    console.error('Error creating achievement approval:', error);
    throw error;
  }
};

export const updateAchievementApprovalRepo = async (
  achievement: AchievementApproval
): Promise<AchievementApproval> => {
  try {
    const { oid, version, ...rest } = achievement; // separate controlled fields

    return await prisma.achievementApproval.update({
      where: { oid, version },
      data: { ...rest, version: { increment: 1 } },
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
