import {
  AchievementDto,
  CreateAchievementDto,
} from '@api/achievement/achievement-schema';
import {
  validateActivity,
  validateStudent,
} from '@service/achievement/shared/achievement-validation';
import { AuthenticatedUser } from '@type/authentication';
import { currentDatetime } from '@util/datetime-util';
import { dto2Entity as userRoleDto2Entity } from '@service/user/mapper/user-role-mapper';
import { dto2Entity as achievementSubmissionRoleDto2Entity } from '@service/activity/mapper/achievement-submission-role-mapper';
import {
  creationDto2Entity,
  entity2Dto,
} from '@service/achievement/mapper/achievement-mapper';

import {
  copyObject,
  publicBucketName,
} from '@util/s3-util';
import {
  createAchievementRepo,
  findAchievementRepo,
} from '@repo/achievement-repo';
import {
  AchievementStatus,
} from '@prisma/client';

export const createAchievementService = async (
  authenticatedUser: AuthenticatedUser,
  achievementCreationDto: CreateAchievementDto
): Promise<AchievementDto> => {
  const now = currentDatetime();

  // Validation
  const student = await validateStudent(
    achievementCreationDto.studentId,
    authenticatedUser
  );
  const { activity, submissionRole } = await validateActivity(
    achievementCreationDto.activityId,
    { userRole: userRoleDto2Entity(authenticatedUser.userRole) }
  );

  // Map DTOs to entities
  const achievementEntity = creationDto2Entity(
    achievementCreationDto,
    student,
    activity,
    achievementSubmissionRoleDto2Entity(submissionRole),
    achievementCreationDto.attachment.length
  );

  const findQuery = {
    studentId: achievementCreationDto.studentId,
    activityId: achievementCreationDto.activityId,
    role: submissionRole,
    offset: 0,
    limit: 1,
  };

  const prefix = `activity/${achievementCreationDto.activityId}/student/${achievementCreationDto.studentId}`;
  const inObjectKeys = achievementCreationDto.attachment.map(
    (a) => a.objectKey
  );

  // 🔄 Handle attachment copying
  const newAttachments = await Promise.all(
    achievementCreationDto.attachment
      .filter((a) => a.bucketName)
      .map(async (a) => {
        const fileName = a.objectKey.split('/').pop()!;
        const objectKey = `${prefix}/${fileName}`;
        const fileSize = await copyObject(
          publicBucketName,
          `${a.bucketName}/${a.objectKey}`,
          objectKey
        );
        return {
          file_name: a.fileName,
          object_key: objectKey,
          file_size: fileSize,
        };
      })
  );

  const existing = (await findAchievementRepo(findQuery)).data[0]?.achievement;
  if (existing !== undefined) {
    // throw error
  }

  const payload = {
    ...achievementEntity,
    status: 'Approved' as AchievementStatus,
    updated_by_user_oid: authenticatedUser.oid,
    updated_at: now,
  };

  const finalAttachments = [
    ...newAttachments.map((a) => ({ ...a, bucket_name: publicBucketName })),
  ];

  const newAchievement = await createAchievementRepo(
    {
      ...payload,
      created_by_user_oid: authenticatedUser.oid,
      created_at: now,
      version: 1,
    },
    finalAttachments
  );

  return entity2Dto(newAchievement, student, activity);
};
