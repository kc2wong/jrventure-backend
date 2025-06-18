import {
  AchievementSubmissionRole,
  Activity,
  ActivityCategory,
  ActivityStatus,
  Prisma,
} from '@prisma/client';
import prisma from '@repo/db';

type FindActivityParams = {
  oid?: number[];
  categoryCode?: string[];
  name?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  participantGrade?: number[];
  role?: AchievementSubmissionRole[];
  status?: ActivityStatus[];
  offset?: number;
  limit?: number;
  orderByField?: 'name_en' | 'start_date' | 'end_date';
  orderByDirection?: 'asc' | 'desc';
};

type FindActivityResult = {
  activity: Activity;
  category: ActivityCategory;
};

type FindActivityPageResult = {
  data: FindActivityResult[];
  offset: number;
  total: number;
};

export const findActivityRepo = async ({
  oid,
  categoryCode,
  name,
  startDateFrom,
  startDateTo,
  endDateFrom,
  endDateTo,
  participantGrade,
  role,
  status,
  offset = 0,
  limit,
  orderByField,
  orderByDirection,
}: FindActivityParams): Promise<FindActivityPageResult> => {
  try {
    const whereClause: Prisma.ActivityWhereInput = {
      ...(oid && { oid: { in: oid } }),
      ...(role && { achievement_submission_role: { in: role } }),
      ...(status && { status: { in: status } }),
      ...(name && {
        OR: [
          { name_en_up_case: { contains: name } },
          { name_zh_hans: { contains: name } },
          { name_zh_hant: { contains: name } },
        ],
      }),
      ...(startDateFrom && { start_date: { gte: startDateFrom } }),
      ...(startDateTo && { start_date: { lte: startDateTo } }),
      ...(endDateFrom && { end_date: { gte: endDateFrom } }),
      ...(endDateTo && { end_date: { lte: endDateTo } }),
      ...(participantGrade &&
        participantGrade.length > 0 && {
          participant_grade: {
            in: getMatchingBitmaskValues(participantGrade),
          },
        }),
      ...(categoryCode && {
        category: {
          code: { in: categoryCode },
        },
      }),
    };

    const orderByClause: Prisma.ActivityFindManyArgs['orderBy'] = [
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
      prisma.activity.count({ where: whereClause }),
      prisma.activity.findMany({
        where: whereClause,
        include: { category: true },
        skip: offset,
        take: limit,
        orderBy: orderByClause,
      }),
    ]);

    return {
      offset,
      total,
      data: items.map(({ category, ...rest }) => ({
        activity: rest,
        category,
      })),
    };
  } catch (error) {
    console.error('Error fetching activity:', error);
    throw error;
  }
};

const getMatchingBitmaskValues = (selectedBits: number[]): number[] => {
  const mask = selectedBits
    .map((m) => m - 1)
    .reduce((m, bit) => m | (1 << bit), 0);
  const matchingValues: number[] = [];

  for (let i = 0; i <= 63; i++) {
    if ((i & mask) !== 0) {
      matchingValues.push(i);
    }
  }

  return matchingValues;
};
