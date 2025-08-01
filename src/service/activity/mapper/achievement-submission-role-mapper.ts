import { AchievementSubmissionRoleDto } from '@api/achievement/achievement-schema';
import { AchievementSubmissionRole } from '@repo/db';

const statusDto2EntityMap: Record<
  AchievementSubmissionRoleDto,
  AchievementSubmissionRole
> = {
  Student: AchievementSubmissionRole.student,
  Teacher: AchievementSubmissionRole.teacher,
  Both: AchievementSubmissionRole.both,
};

const statusEntity2DtoMap: Record<
  AchievementSubmissionRole,
  AchievementSubmissionRoleDto
> = Object.fromEntries(
  Object.entries(statusDto2EntityMap).map(([key, value]) => [value, key])
) as Record<AchievementSubmissionRole, AchievementSubmissionRoleDto>;

export const dto2Entity = (
  src: AchievementSubmissionRoleDto
): AchievementSubmissionRole => {
  return statusDto2EntityMap[src];
};

export const entity2Dto = (
  src: AchievementSubmissionRole
): AchievementSubmissionRoleDto => {
  return statusEntity2DtoMap[src];
};
