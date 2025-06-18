import {
  AchievementDto,
  UpdateAchievementDto,
} from '@api/achievement/achievement-schema';
import {
  validateActivity,
  validateStudent,
} from '@service/achievement/shared/achievement-validation';
import { AuthenticatedUser } from '@type/authentication';
import { currentDatetime } from '@util/datetime-util';
import { dto2Entity as userRoleDto2Entity } from '@service/user/mapper/user-role-mapper';
import {
  creationDto2Entity,
  entity2Dto,
} from '@service/achievement/mapper/achievement-mapper';

import {
  getAchievementByIdRepo,
  updateAchievementRepo,
} from '@repo/achievement-repo';
import { NotFoundErrorDto } from '@api/shared/error-schema';
import { findAchievementApprovalAttachmentByAchievementApprovalOidRepo } from '@repo/achievement-approval/find-achievement-approval-attachment';

export const updateAchievementService = async (
  authenticatedUser: AuthenticatedUser,
  id: string,
  updateAchievementDto: UpdateAchievementDto
): Promise<AchievementDto> => {
  const { version, ...achievementUpdateDto } = updateAchievementDto;

  const student = await validateStudent(
    achievementUpdateDto.studentId,
    authenticatedUser
  );
  const { activity, submissionRole } = await validateActivity(
    achievementUpdateDto.activityId,
    { userRole: userRoleDto2Entity(authenticatedUser.userRole) }
  );

  const result = await getAchievementByIdRepo(id);
  if (result === undefined) {
    throw new NotFoundErrorDto('Achievement', 'id', id);
  }
  const achievement = result.achievement;
  const existingAttachments =
    await findAchievementApprovalAttachmentByAchievementApprovalOidRepo(
      achievement.oid
    );

  const payload = creationDto2Entity(
    achievementUpdateDto,
    student,
    activity,
    submissionRole,
    existingAttachments.length
  );

  const now = currentDatetime();
  const updatedAchievement = await updateAchievementRepo(
    {
      ...payload,
      oid: achievement.oid,
      created_by_user_oid: achievement.created_by_user_oid,
      created_at: achievement.created_at,
      updated_by_user_oid: authenticatedUser.oid,
      updated_at: now,
      version: version,
    },
    existingAttachments
  );

  return entity2Dto(updatedAchievement, student, activity);
};
