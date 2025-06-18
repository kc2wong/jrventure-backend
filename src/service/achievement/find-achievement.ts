import {
  AchievementDto,
  FindAchievementQueryDto,
} from '@api/achievement/achievement-schema';
import { findAchievementRepo } from '@repo/achievement/find-achievement';
import { dto2Entity as orderByDirectionDto2Entity } from '@shared/mapper/order-by-direction-mapper';
import { entity2Dto } from '@service/achievement/mapper/achievement-mapper';
import { PaginationResultDto } from '@api/shared/search-schema';

export const findAchievementService = async (
  query: FindAchievementQueryDto
): Promise<PaginationResultDto<AchievementDto>> => {
  const orderByDirection = query.orderByDirection
    ? orderByDirectionDto2Entity(query.orderByDirection)
    : undefined;

  const { total, offset, data } = await findAchievementRepo({
    ...query,
    orderByDirection: orderByDirection,
  });
  return new PaginationResultDto<AchievementDto>({
    total,
    offset,
    limit: query.limit,
    data: data.map(({ achievement, student, activity }) =>
      entity2Dto(achievement, student, activity)
    ),
  });
};
