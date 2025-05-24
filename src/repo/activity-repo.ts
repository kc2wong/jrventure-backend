import {
  ActivityCategory,
  ActivityStatus,
  Activity,
  Prisma,
} from '@prisma/client';
import prisma from './db';

type FindActivityParams = {
  categoryCode?: string[];
  name?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  participantGrade?: number[];
  status?: ActivityStatus[]; // classId and studentNumber
};

type FindActivityResult = {
  activity: Activity;
  category: ActivityCategory;
};

export const findActivity = async ({
  categoryCode,
  name,
  startDateFrom,
  startDateTo,
  endDateFrom,
  endDateTo,
  participantGrade,
  status,
}: FindActivityParams): Promise<FindActivityResult[]> => {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        ...(status && { status: { in: status } }),
        ...(name && {
          OR: [
            { name_en_up_case: { contains: name } },
            { name_zh_hans: { contains: name } },
            { name_zh_hant: { contains: name } },
          ],
        }),
        ...(startDateFrom && { start_date: { gte: startDateFrom } }),
        ...(startDateTo && {
          start_date: { ...(startDateFrom ? {} : {}), lte: startDateTo },
        }),
        ...(endDateFrom && { end_date: { gte: endDateFrom } }),
        ...(endDateTo && {
          end_date: { ...(endDateFrom ? {} : {}), lte: endDateTo },
        }),
        ...(participantGrade &&
          participantGrade.length > 0 && {
            // Bitmask filtering is not natively supported, so we use a numeric filter as a workaround
            participant_grade: {
              in: getMatchingBitmaskValues(participantGrade), // This is a placeholder; adjust logic as needed for your use case
            },
          }),
        ...(categoryCode && {
          category: {
            code: {
              in: categoryCode,
            },
          },
        }),
      },
      include: {
        category: true,
      },
    });
    return activities.map(({ category, ...rest }) => ({
      activity: { ...rest },
      category: category,
    }));
  } catch (error) {
    console.error('Error fetching activity:', error);
    throw error;
  }
};

export const getActivityById = async (
  id: number
): Promise<FindActivityResult | undefined> => {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        oid: id,
      },
      include: {
        category: true,
      },
    });
    if (activities.length === 1) {
      const { category, ...rest } = activities[0];
      return { activity: { ...rest }, category: category };
    } else {
      console.log(
        `getActivityById() - id = ${id}, number of result = ${activities.length}`
      );
      return undefined;
    }
  } catch (error) {
    console.error('Error fetching activity:', error);
    throw error;
  }
};

export const createActivity = async (
  activity: Omit<Activity, 'oid'>
): Promise<Activity> => {
  try {
    return await prisma.activity.create({
      data: {
        ...activity,
      },
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

export const updateActivity = async (activity: Activity): Promise<Activity> => {
  try {
    const { oid, version, ...rest } = activity; // separate controlled fields

    return await prisma.activity.update({
      where: { oid, version },
      data: { ...rest, version: { increment: 1 } },
    });
  } catch (error) {
    console.error('Error updating activity:', error);
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
