import { ActivityCategoryDto } from '@api/activity-category/activity-category-schema';
import { listActivityCategoryRepo } from '@repo/activity-category/list-activity-category';
import { entity2Dto } from '@service/activity-category/mapper/activity-category-mapper';

export const listActivityCategoryService = async (): Promise<
  ActivityCategoryDto[]
> => {
  const result = await listActivityCategoryRepo();
  return result.map((item) => entity2Dto(item));
};
