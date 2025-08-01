import { activities } from '@db/drizzle-schema';
import { Activity, db } from '@repo/db';

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
    console.error('Error creating activity:', error);
    throw error;
  }
};
