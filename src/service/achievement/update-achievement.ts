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
import { entity2Dto as submissionRoleEntity2Dto } from '@service/activity/mapper/achievement-submission-role-mapper';
import {
  creationDto2Entity,
  entity2Dto,
} from '@service/achievement/mapper/achievement-mapper';

import { NotFoundErrorDto } from '@api/shared/error-schema';
import { findAchievementApprovalAttachmentByAchievementApprovalOidRepo } from '@repo/achievement-approval/find-achievement-approval-attachment';
import { updateAchievementRepo } from '@repo/achievement/update-achievement';
import { getAchievementByOidRepo } from '@repo/achievement/get-achievement';
import { safeParseInt } from '@util/string-util';

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

  const oid = safeParseInt(id);
  const result = oid ? await getAchievementByOidRepo(oid) : undefined;
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
    submissionRoleEntity2Dto(submissionRole),
    existingAttachments.length
  );

  const now = currentDatetime();
  const updatedAchievement = await updateAchievementRepo(
    {
      ...payload,
      oid: achievement.oid,
      createdByUserOid: achievement.createdByUserOid,
      createdAt: achievement.createdAt,
      updatedByUserOid: authenticatedUser.oid,
      updatedAt: now,
      version: version,
    },
    existingAttachments
  );

  return entity2Dto(updatedAchievement, student, activity);
};
