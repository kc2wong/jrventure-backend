import { dto2Entity as orderByDirectionDto2Entity } from '@shared/mapper/order-by-direction-mapper';
import { entity2Dto } from '@service/achievement-approval/mapper/achievement-approval-mapper';
import { PaginationResultDto } from '@api/shared/search-schema';
import {
  AchievementApprovalDto,
  FindAchievementApprovalQueryDto,
} from '@api/achievement-approval/achievement-approval-schema';
import { findAchievementApprovalRepo } from '@repo/achievement-approval/find-achievement-approval';

export const findAchievementApprovalService = async (
  query: FindAchievementApprovalQueryDto
): Promise<PaginationResultDto<AchievementApprovalDto>> => {
  const orderByDirection = query.orderByDirection
    ? orderByDirectionDto2Entity(query.orderByDirection)
    : undefined;

  const { total, offset, data } = await findAchievementApprovalRepo({
    ...query,
    orderByDirection: orderByDirection,
  });
  return new PaginationResultDto<AchievementApprovalDto>({
    total,
    offset,
    limit: query.limit,
    data: data.map(({ achievementApproval, student, activity }) =>
      entity2Dto(achievementApproval, student, activity)
    ),
  });
};
