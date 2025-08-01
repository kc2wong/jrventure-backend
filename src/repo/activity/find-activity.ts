import {
  eq,
  and,
  or,
  gte,
  lte,
  ilike,
  inArray,
  sql,
  desc,
  asc,
  SQL,
} from 'drizzle-orm';
import {
  AchievementSubmissionRole,
  Activity,
  ActivityCategory,
  ActivityStatus,
  db,
} from '@repo/db';
import { activities, activityCategories } from '@db/drizzle-schema';

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

const orderableFields = {
  name_en: activities.nameEnUpCase,
  start_date: activities.startDate,
  end_date: activities.endDate,
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
    const conditions = [];

    if (oid?.length) conditions.push(inArray(activities.oid, oid));
    if (role?.length)
      conditions.push(inArray(activities.achievementSubmissionRole, role));
    if (status?.length) conditions.push(inArray(activities.status, status));

    if (name) {
      conditions.push(
        or(
          ilike(activities.nameEnUpCase, `%${name}%`),
          ilike(activities.nameZhHans, `%${name}%`),
          ilike(activities.nameZhHant, `%${name}%`)
        )
      );
    }

    if (startDateFrom)
      conditions.push(gte(activities.startDate, startDateFrom));
    if (startDateTo) conditions.push(lte(activities.startDate, startDateTo));
    if (endDateFrom) conditions.push(gte(activities.endDate, endDateFrom));
    if (endDateTo) conditions.push(lte(activities.endDate, endDateTo));

    if (participantGrade?.length) {
      conditions.push(
        inArray(
          activities.participantGrade,
          getMatchingBitmaskValues(participantGrade)
        )
      );
    }

    const categoryJoin = eq(activities.categoryOid, activityCategories.oid);
    if (categoryCode?.length) {
      // push condition on category.code after join
      conditions.push(inArray(activityCategories.code, categoryCode));
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const orderBy: SQL[] = [];
    if (orderByField && orderableFields[orderByField]) {
      const field =
        orderableFields[orderByField as keyof typeof orderableFields];
      if (orderByDirection === 'desc') {
        orderBy.push(desc(field));
      } else {
        orderBy.push(asc(field));
      }
    }
    // Always add a secondary sort for deterministic order
    orderBy.push(asc(activities.oid));

    const [total, data] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(activities)
        .innerJoin(activityCategories, categoryJoin)
        .where(where)
        .then((res) => Number(res[0]?.count || 0)),

      db
        .select({
          activity: activities,
          category: activityCategories,
        })
        .from(activities)
        .innerJoin(activityCategories, categoryJoin)
        .where(where)
        .orderBy(...orderBy)
        .limit(limit ?? 50)
        .offset(offset),
    ]);

    return {
      offset,
      total,
      data,
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
