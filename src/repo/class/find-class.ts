import { and, eq } from 'drizzle-orm';

import { classes } from '@db/drizzle-schema';
import { db, Class } from '@repo/db';
import { logger } from '@util/logging-util';

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
    logger.error(`Error fetching classes: ${JSON.stringify(error)}`);
    throw error;
  }
};
