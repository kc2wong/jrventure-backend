import { InvalidValueErrorDto } from '@api/shared/error-schema';
import { listActivityCategoryRepo } from '@repo/activity-category/list-activity-category';
import { ActivityCategory } from '@repo/db';

export const validateActivityCategory = async (
  activityCategoryCode: string
): Promise<ActivityCategory> => {
  const ac = (await listActivityCategoryRepo()).find(
    (ac) => ac.code === activityCategoryCode
  );
  if (ac) {
    return ac;
  } else {
    throw new InvalidValueErrorDto(
      activityCategoryCode,
      'activityCategoryCode'
    );
  }
};
