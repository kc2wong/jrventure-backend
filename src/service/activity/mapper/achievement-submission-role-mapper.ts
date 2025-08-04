import { AchievementSubmissionRoleDto } from '@api/achievement/achievement-schema';
import { AchievementSubmissionRole } from '@repo/db';

const roleDto2EntityMap: Record<
  AchievementSubmissionRoleDto,
  AchievementSubmissionRole
> = {
  Student: AchievementSubmissionRole.student,
  Teacher: AchievementSubmissionRole.teacher,
  Both: AchievementSubmissionRole.both,
};

const roleEntity2DtoMap: Record<
  AchievementSubmissionRole,
  AchievementSubmissionRoleDto
> = Object.fromEntries(
  Object.entries(roleDto2EntityMap).map(([key, value]) => [value, key])
) as Record<AchievementSubmissionRole, AchievementSubmissionRoleDto>;

export const dto2Entity = (
  src: AchievementSubmissionRoleDto
): AchievementSubmissionRole => {
  return roleDto2EntityMap[src];
};

export const entity2Dto = (
  src: AchievementSubmissionRole
): AchievementSubmissionRoleDto => {
  return roleEntity2DtoMap[src];
};
