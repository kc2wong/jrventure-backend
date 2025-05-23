import { AchievementSubmissionRole } from '@prisma/client';
import { AchievementSubmissionRoleDto } from '../dto-schema';

const statusDto2EntityMap: Record<AchievementSubmissionRoleDto, AchievementSubmissionRole> = {
  Student: AchievementSubmissionRole.Student,
  Teacher: AchievementSubmissionRole.Teacher,
  Both: AchievementSubmissionRole.Both,
};

const statusEntity2DtoMap: Record<AchievementSubmissionRole, AchievementSubmissionRoleDto> =
  Object.fromEntries(
    Object.entries(statusDto2EntityMap).map(([key, value]) => [value, key])
  ) as Record<AchievementSubmissionRole, AchievementSubmissionRoleDto>;

export const dto2Entity = (src: AchievementSubmissionRoleDto): AchievementSubmissionRole => {
  return statusDto2EntityMap[src];
};

export const entity2Dto = (src: AchievementSubmissionRole): AchievementSubmissionRoleDto => {
  return statusEntity2DtoMap[src];
};
