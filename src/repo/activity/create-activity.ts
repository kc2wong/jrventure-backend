import { Activity } from '@prisma/client';
import prisma from '@repo/db';

export const createActivityRepo = async (
  activity: Omit<Activity, 'oid'>
): Promise<Activity> => {
  try {
    return await prisma.activity.create({
      data: {
        ...activity,
      },
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};
