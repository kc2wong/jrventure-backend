import { classes } from '@db/drizzle-schema';
import { and, eq } from 'drizzle-orm';
import { db, Class } from '@repo/db';

export const findClassRepo = async (
  grade?: number,
  classNumber?: string
): Promise<Class[]> => {
  try {
    const whereClauses = [];

    if (grade !== undefined) {
      whereClauses.push(eq(classes.grade, grade));
    }

    if (classNumber !== undefined) {
      whereClauses.push(eq(classes.classNumber, classNumber));
    }

    const result = await db
      .select()
      .from(classes)
      .where(whereClauses.length > 0 ? and(...whereClauses) : undefined);

    return result;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};
