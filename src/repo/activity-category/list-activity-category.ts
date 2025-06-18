import { ActivityCategory } from '@prisma/client';
import prisma from '@repo/db';

export const listActivityCategoryRepo = async (): Promise<ActivityCategory[]> => {
  try {
    return await prisma.activityCategory.findMany({});
  } catch (error) {
    console.error('Error fetching activity category:', error);
    throw error;
  }
};
