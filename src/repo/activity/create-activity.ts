import { activities } from '@db/drizzle-schema';
import { Activity, db } from '@repo/db';
import { logger } from '@util/logging-util';

export const createActivityRepo = async (
  activity: Omit<Activity, 'oid'>
): Promise<Activity> => {
  try {
    const [createdActivity] = await db
      .insert(activities)
      .values(activity)
      .returning();
    return createdActivity;
  } catch (error) {
    logger.error(`Error creating activity: ${JSON.stringify(error)}`);
    throw error;
  }
};
