import { ActivityCategoryDto } from '@api/activity-category/activity-category-schema';
import { listActivityCategoryRepo } from '@repo/activity-category/list-activity-category';
import { entity2Dto } from '@service/activity-category/mapper/activity-category-mapper';
import { logger } from '@util/logging-util';

export const listActivityCategoryService = async (): Promise<
  ActivityCategoryDto[]
> => {
  logger.info('listActivityCategoryService() - start');
  const activityCategories = await listActivityCategoryRepo();
  const result = activityCategories.map((item) => entity2Dto(item));
  logger.info('listActivityCategoryService() - end');
  return result;
};
