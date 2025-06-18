import { ActivityCategoryDto } from '@api/activity-category/activity-category-schema';
import { ActivityCategory } from '@prisma/client';

export const entity2Dto = (src: ActivityCategory): ActivityCategoryDto => {
  return {
    code: src.code,
    name: {
      English: src.name_en,
      TraditionalChinese: src.name_zh_hant,
      SimplifiedChinese: src.name_zh_hans,
    },
  };
};
