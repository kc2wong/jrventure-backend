import { AchievementApprovalStatusDto } from '../dto-schema';
import { AchievementApprovalStatusEntity } from '../../repo/entity/db_entity';

const statusDto2EntityMap: Record<
  AchievementApprovalStatusDto,
  AchievementApprovalStatusEntity
> = {
  Pending: AchievementApprovalStatusEntity.Pending,
  Rejected: AchievementApprovalStatusEntity.Rejected,
};

const statusEntity2DtoMap: Record<
  AchievementApprovalStatusEntity,
  AchievementApprovalStatusDto
> = Object.fromEntries(
  Object.entries(statusDto2EntityMap).map(([key, value]) => [value, key])
) as Record<AchievementApprovalStatusEntity, AchievementApprovalStatusDto>;

export const dto2Entity = (
  src: AchievementApprovalStatusDto
): AchievementApprovalStatusEntity => {
  return statusDto2EntityMap[src];
};

export const entity2Dto = (
  src: AchievementApprovalStatusEntity
): AchievementApprovalStatusDto => {
  return statusEntity2DtoMap[src];
};
