import { AchievementApprovalStatusDto } from '@api/achievement-approval/achievement-approval-schema';
import { AchievementApprovalStatus } from '@prisma/client';

const statusDto2EntityMap: Record<
  AchievementApprovalStatusDto,
  AchievementApprovalStatus
> = {
  Pending: AchievementApprovalStatus.Pending,
  Rejected: AchievementApprovalStatus.Rejected,
};

const statusEntity2DtoMap: Record<
  AchievementApprovalStatus,
  AchievementApprovalStatusDto
> = Object.fromEntries(
  Object.entries(statusDto2EntityMap).map(([key, value]) => [value, key])
) as Record<AchievementApprovalStatus, AchievementApprovalStatusDto>;

export const dto2Entity = (
  src: AchievementApprovalStatusDto
): AchievementApprovalStatus => {
  return statusDto2EntityMap[src];
};

export const entity2Dto = (
  src: AchievementApprovalStatus
): AchievementApprovalStatusDto => {
  return statusEntity2DtoMap[src];
};
