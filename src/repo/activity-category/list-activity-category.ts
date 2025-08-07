import { activityCategories } from '@db/drizzle-schema';
import { ActivityCategory, db } from '@repo/db';
import { logger } from '@util/logging-util';

export const listActivityCategoryRepo = async (): Promise<
  ActivityCategory[]
> => {
  try {
    return await db.select().from(activityCategories);
  } catch (error) {
    logger.error(`Error fetching activity category: ${JSON.stringify(error)}`);
    throw error;
  }
};
