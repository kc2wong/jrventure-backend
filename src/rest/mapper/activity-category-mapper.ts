import { ActivityCategory } from '@prisma/client';
import { ActivityCategoryDto } from '../dto-schema';

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
