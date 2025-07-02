import {
  AchievementDto,
  FindAchievementQueryDto,
} from '@api/achievement/achievement-schema';
import { findAchievementRepo } from '@repo/achievement/find-achievement';
import { dto2Entity as orderByDirectionDto2Entity } from '@shared/mapper/order-by-direction-mapper';
import { dto2Entity as submissionRoleDto2Entity } from '@service/activity/mapper/achievement-submission-role-mapper';
import { entity2Dto } from '@service/achievement/mapper/achievement-mapper';
import { PaginationResultDto } from '@api/shared/search-schema';
import { safeParseInt } from '@util/string-util';

export const findAchievementService = async (
  query: FindAchievementQueryDto
): Promise<PaginationResultDto<AchievementDto>> => {
  const { activityId, role, orderByDirection, ...rest } = query;
  const { total, offset, data } = await findAchievementRepo({
    ...rest,
    activityOid : activityId ? safeParseInt(activityId) : undefined,
    role: role ? submissionRoleDto2Entity(role) : undefined,
    orderByDirection: orderByDirection ? orderByDirectionDto2Entity(orderByDirection) : undefined,
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
