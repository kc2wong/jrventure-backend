import { InvalidValueErrorDto } from '@api/shared/error-schema';
import { Activity, ActivityCategory } from '@prisma/client';
import { listActivityCategoryRepo } from '@repo/activity-category/list-activity-category';
import { getActivityByOidRepo } from '@repo/activity/get-activity';
import { safeParseInt } from '@util/string-util';

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
