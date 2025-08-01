import { ActivityCategory, db } from '@repo/db';
import { activityCategories } from '@db/drizzle-schema';

export const listActivityCategoryRepo = async (): Promise<
  ActivityCategory[]
> => {
  try {
    return await db.select().from(activityCategories);
  } catch (error) {
    console.error('Error fetching activity category:', error);
    throw error;
  }
};
