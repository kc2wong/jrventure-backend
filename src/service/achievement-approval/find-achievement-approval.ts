import {
  AchievementApprovalDto,
  FindAchievementApprovalQueryDto,
} from '@api/achievement-approval/achievement-approval-schema';
import { PaginationResultDto } from '@api/shared/search-schema';
import { findAchievementApprovalRepo } from '@repo/achievement-approval/find-achievement-approval';
import { entity2Dto } from '@service/achievement-approval/mapper/achievement-approval-mapper';
import { dto2Entity as status2Entity } from '@service/achievement-approval/mapper/achievement-approval-status-mapper';
import { dto2Entity as submissionRoleDto2Entity } from '@service/activity/mapper/achievement-submission-role-mapper';
import { dto2Entity as orderByDirectionDto2Entity } from '@shared/mapper/order-by-direction-mapper';
import { safeParseInt } from '@util/string-util';

export const findAchievementApprovalService = async (
  query: FindAchievementApprovalQueryDto
): Promise<PaginationResultDto<AchievementApprovalDto>> => {
  const { activityId, role, status, orderByDirection, ...rest } = query;
  const { total, offset, data } = await findAchievementApprovalRepo({
    ...rest,
    activityOid : activityId ? safeParseInt(activityId) : undefined,
    role: role ? submissionRoleDto2Entity(role) : undefined,
    status: status ? status2Entity(status) : undefined,
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
