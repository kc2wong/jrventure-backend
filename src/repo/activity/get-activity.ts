import {
  Activity,
  ActivityCategory,
} from '@prisma/client';
import prisma from '@repo/db';

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
    const activities = await prisma.activity.findMany({
      where: {
        oid: oid,
      },
      include: {
        category: true,
      },
    });
    if (activities.length === 1) {
      const { category, ...rest } = activities[0];
      return { activity: { ...rest }, category: category };
    } else {
      console.log(
        `getActivityByOid() - oid = ${oid}, number of result = ${activities.length}`
      );
      return undefined;
    }
  } catch (error) {
    console.error('Error fetching activity:', error);
    throw error;
  }
};
