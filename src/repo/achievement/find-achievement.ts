import {
  eq,
  and,
  gte,
  count,
} from 'drizzle-orm';
import { db, Achievement, AchievementSubmissionRole, Activity, Student, PaginationResult } from '@repo/db';
import { achievements, activities, students } from '@db/drizzle-schema';

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

    const activityJoin = eq(achievements.activityOid, activities.oid);
    const studentJoin = eq(achievements.studentOid, students.oid);

    const conditions = [];

    if (role) conditions.push(eq(achievements.achievementSubmissionRole, role));
    if (createAtFrom) conditions.push(gte(achievements.createdAt, createAtFrom));
    if (studentId) conditions.push(eq(students.id, studentId));
    if (studentOid) conditions.push(eq(achievements.studentOid, studentOid));
    if (activityOid) conditions.push(eq(achievements.activityOid, activityOid));

    const where = and(...conditions);

    const totalQuery = await db
      .select({ count: count() })
      .from(achievements)
      .where(where);

    const total = Number(totalQuery[0].count);

    const orderBy = [
      ...(orderByField
        ? [{ [orderByField]: orderByDirection === 'desc' ? 'desc' : 'asc' } as any]
        : []),
      { oid: 'asc' },
    ];

    const data = await db
      .select({
        achievement: achievements,
        student: students,
        activity: activities,
      })
      .from(achievements)
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
    console.error('Error fetching achievement:', error);
    throw error;
  }
};
