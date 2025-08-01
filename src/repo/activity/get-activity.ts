import { eq } from 'drizzle-orm';
import { Activity, ActivityCategory, db } from '@repo/db';
import { activities, activityCategories } from '@db/drizzle-schema';

type FindActivityResult = {
  activity: Activity;
  category: ActivityCategory;
};

export const getActivityByOidRepo = async (
  oid: number
): Promise<FindActivityResult | undefined> => {
  try {
    if (oid === undefined) {
      return undefined;
    }
    
    const categoryJoin = eq(activities.categoryOid, activityCategories.oid);
    const result = await db
      .select({
        activity: activities,
        category: activityCategories,
      })
      .from(activities)
      .innerJoin(activityCategories, categoryJoin)
      .where(eq(activities.oid, oid));

    if (result.length === 1) {
      return result[0];
    } else {
      console.log(
        `getActivityByOid() - oid = ${oid}, number of result = ${result.length}`
      );
      return undefined;
    }
  } catch (error) {
    console.error('Error fetching activity:', error);
    throw error;
  }
};
