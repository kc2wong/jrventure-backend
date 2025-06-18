import { entity2Dto as achievementStatusEntity2Dto } from './achievement-status-mapper';
import { entity2Dto as achievementSubmissionRoleEntity2Dto } from '@service/activity/mapper/achievement-submission-role-mapper';
import { entity2Dto as achievemenAttachmentEntity2Dto } from '@service/achievement/mapper/achievement-attachment-mapper';
import { entity2Dto as achievemenStatusEntity2Dto } from './achievement-status-mapper';
import {
  Activity,
  Achievement,
  Student,
  AchievementSubmissionRole,
  AchievementStatus,
  AchievementAttachment,
} from '@prisma/client';
import { AchievementCreationEntity } from '@repo/entity/db_entity';
import {
  AchievementDetailDto,
  AchievementDto,
  CreateAchievementDto,
} from '@api/achievement/achievement-schema';

export const entity2Dto = (
  {
    oid,
    status,
    rating,
    achievement_submission_role,
    comment,
    num_of_attachment,
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
      achievement_submission_role
    ),
    rating: rating ? rating : undefined,
    comment: comment,
    numberOfAttachment: num_of_attachment,
  };
};

export const detailEntity2Dto = (
  {
    oid,
    status,
    rating,
    achievement_submission_role,
    comment,
    num_of_attachment,
  }: Achievement,
  student: Student,
  activity: Activity,
  attachment: (AchievementAttachment & { getUrl: string })[]
): AchievementDetailDto => {
  return {
    id: oid.toString(),
    status: achievemenStatusEntity2Dto(status),
    studentId: student.id,
    activityId: activity.oid.toString(),
    submissionRole: achievementSubmissionRoleEntity2Dto(
      achievement_submission_role
    ),
    rating: rating ? rating : undefined,
    comment: comment,
    numberOfAttachment: num_of_attachment,
    attachment: attachment.map((atch) => achievemenAttachmentEntity2Dto(atch)),
  };
};

export const creationDto2Entity = (
  { rating, comment }: CreateAchievementDto,
  student: Student,
  activity: Activity,
  submissionRole: AchievementSubmissionRole,
  numOfAttachment: number
): AchievementCreationEntity => {
  return {
    student_oid: student.oid,
    activity_oid: activity.oid,
    rating: rating !== undefined ? rating : null,
    comment,
    achievement_submission_role: submissionRole,
    num_of_attachment: numOfAttachment,
    status: AchievementStatus.Approved,
  };
};
