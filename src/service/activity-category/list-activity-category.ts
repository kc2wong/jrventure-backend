import { entity2Dto } from '@service/activity-category/mapper/activity-category-mapper';
import { ActivityCategoryDto } from '@api/activity-category/activity-category-schema';
import { listActivityCategoryRepo } from '@repo/activity-category/list-activity-category';

export const listActivityCategoryService = async (): Promise<
  ActivityCategoryDto[]
> => {
  const result = await listActivityCategoryRepo();
  return result.map((item) => entity2Dto(item));
};
