import { AchievementStatusDto } from '@api/achievement/achievement-schema';
import { AchievementStatus } from '@repo/db';

const statusDto2EntityMap: Record<AchievementStatusDto, AchievementStatus> = {
  Approved: AchievementStatus.approved,
  Published: AchievementStatus.published,
};

const statusEntity2DtoMap: Record<AchievementStatus, AchievementStatusDto> =
  Object.fromEntries(
    Object.entries(statusDto2EntityMap).map(([key, value]) => [value, key])
  ) as Record<AchievementStatus, AchievementStatusDto>;

export const dto2Entity = (src: AchievementStatusDto): AchievementStatus => {
  return statusDto2EntityMap[src];
};

export const entity2Dto = (src: AchievementStatus): AchievementStatusDto => {
  return statusEntity2DtoMap[src];
};
