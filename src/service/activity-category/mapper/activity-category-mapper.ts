import { ActivityCategoryDto } from '@api/activity-category/activity-category-schema';
import { ActivityCategory } from '@repo/db';

export const entity2Dto = (src: ActivityCategory): ActivityCategoryDto => {
  const { code, nameEn, nameZhHans, nameZhHant } = src;
  return {
    code: code,
    name: {
      English: nameEn,
      TraditionalChinese: nameZhHant,
      SimplifiedChinese: nameZhHans,
    },
  };
};
