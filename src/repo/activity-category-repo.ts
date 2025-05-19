import { ActivityCategory } from '@prisma/client';
import prisma from './db'; // or wherever your prisma instance is

export const listActivityCategory = async (): Promise<ActivityCategory[]> => {
  try {
    return await prisma.activityCategory.findMany({});
  } catch (error) {
    console.error('Error fetching activity category:', error);
    throw error;
  }
};
