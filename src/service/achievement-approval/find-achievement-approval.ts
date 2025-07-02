import { dto2Entity as orderByDirectionDto2Entity } from '@shared/mapper/order-by-direction-mapper';
import { dto2Entity as submissionRoleDto2Entity } from '@service/activity/mapper/achievement-submission-role-mapper';
import { entity2Dto } from '@service/achievement-approval/mapper/achievement-approval-mapper';
import { PaginationResultDto } from '@api/shared/search-schema';
import {
  AchievementApprovalDto,
  FindAchievementApprovalQueryDto,
} from '@api/achievement-approval/achievement-approval-schema';
import { findAchievementApprovalRepo } from '@repo/achievement-approval/find-achievement-approval';
import { safeParseInt } from '@util/string-util';

export const findAchievementApprovalService = async (
  query: FindAchievementApprovalQueryDto
): Promise<PaginationResultDto<AchievementApprovalDto>> => {
  const { activityId, role, orderByDirection, ...rest } = query;
  const { total, offset, data } = await findAchievementApprovalRepo({
    ...rest,
    activityOid : activityId ? safeParseInt(activityId) : undefined,
    role: role ? submissionRoleDto2Entity(role) : undefined,
    orderByDirection: orderByDirection
      ? orderByDirectionDto2Entity(orderByDirection)
      : undefined,
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
