import { entity2Dto as achievementStatusEntity2Dto } from '@service/achievement/mapper/achievement-status-mapper';
import {
  entity2Dto as achievementSubmissionRoleEntity2Dto,
  dto2Entity as achievementSubmissionRoleDto2Entity,
} from '@service/activity/mapper/achievement-submission-role-mapper';
import { entity2Dto as achievemenAttachmentEntity2Dto } from '@service/achievement/mapper/achievement-attachment-mapper';
import {
  AchievementDetailDto,
  AchievementDto,
  AchievementSubmissionRoleDto,
  CreateAchievementDto,
} from '@api/achievement/achievement-schema';
import {
  Achievement,
  AchievementAttachment,
  AchievementCreationEntity,
  AchievementStatus,
  Activity,
  Student,
} from '@repo/db';

export const entity2Dto = (
  {
    oid,
    status,
    rating,
    achievementSubmissionRole,
    comment,
    numOfAttachment,
  }: Achievement,
  student: Student,
  activity: Activity
): AchievementDto => {
  return {
    id: oid.toString(),
    status: achievementStatusEntity2Dto(status),
    studentId: student.id,
    activityId: activity.oid.toString(),
    submissionRole: achievementSubmissionRoleEntity2Dto(
      achievementSubmissionRole
    ),
    rating: rating ? rating : undefined,
    comment: comment,
    numberOfAttachment: numOfAttachment,
  };
};

export const detailEntity2Dto = (
  {
    oid,
    status,
    rating,
    achievementSubmissionRole,
    comment,
    numOfAttachment,
  }: Achievement,
  student: Student,
  activity: Activity,
  attachment: (AchievementAttachment & { getUrl: string })[]
): AchievementDetailDto => {
  return {
    id: oid.toString(),
    status: achievementStatusEntity2Dto(status),
    studentId: student.id,
    activityId: activity.oid.toString(),
    submissionRole: achievementSubmissionRoleEntity2Dto(
      achievementSubmissionRole
    ),
    rating: rating ? rating : undefined,
    comment: comment,
    numberOfAttachment: numOfAttachment,
    attachment: attachment.map((atch) => achievemenAttachmentEntity2Dto(atch)),
  };
};

export const creationDto2Entity = (
  { rating, comment }: CreateAchievementDto,
  student: Student,
  activity: Activity,
  submissionRole: AchievementSubmissionRoleDto,
  numOfAttachment: number
): AchievementCreationEntity => {
  return {
    studentOid: student.oid,
    activityOid: activity.oid,
    rating: rating !== undefined ? rating : null,
    comment,
    achievementSubmissionRole:
      achievementSubmissionRoleDto2Entity(submissionRole),
    numOfAttachment,
    status: AchievementStatus.approved,
  };
};
