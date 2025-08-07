import { eq, and } from 'drizzle-orm';

import { activities } from '@db/drizzle-schema';
import { Activity, db } from '@repo/db';
import { logger } from '@util/logging-util';

export const updateActivityRepo = async (
  activity: Activity
): Promise<Activity> => {
  try {
    const { oid, version, ...rest } = activity; // separate controlled fields

    const updatedActivities = await db
      .update(activities)
      .set({
        ...rest,
        version: version + 1,
      })
      .where(and(eq(activities.oid, oid), eq(activities.version, version)))
      .returning();

    if (updatedActivities.length === 0) {
      throw new Error(
        'Optimistic Locking Failed: The record was modified by another process.'
      );
    }

    return updatedActivities[0];
  } catch (error) {
    logger.error(`Error updating activity: ${JSON.stringify(error)}`);
    throw error;
  }
};
