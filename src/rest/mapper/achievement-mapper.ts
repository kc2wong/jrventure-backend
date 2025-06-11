import { AchievementDto, AchievementCreationDto, AchievementDetailDto } from '../dto-schema';
import {
  entity2Dto as achievementStatusEntity2Dto,
} from './achievement-status-mapper';
import { entity2Dto as achievementSubmissionRoleEntity2Dto } from './achievement-submission-role-dto-mapper';
import { entity2Dto as achievemenAttachmentEntity2Dto } from './achievement-attachment-mapper'
import { entity2Dto as datetimeEntity2Dto } from './datetime-dto-mapper';
import { entity2Dto as achievemenStatusEntity2Dto } from './achievement-status-mapper';
import {
  AchievementAttachmentEntity,
  AchievementCreationEntity,
  AchievementEntity,
  AchievementStatusEntity,
  AchievementSubmissionRoleEntity,
  ActivityEntity,
  StudentEntity,
} from '../../repo/entity/db_entity';

export const entity2Dto = (
  {
    oid,
    status,
    rating,
    achievement_submission_role,
    comment,
    num_of_attachment,
  }: AchievementEntity,
  student: StudentEntity,
  activity: ActivityEntity
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
  }: AchievementEntity,
  student: StudentEntity,
  activity: ActivityEntity,
  attachment: (AchievementAttachmentEntity & { getUrl: string })[],
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
    attachment: attachment.map((atch) =>
      achievemenAttachmentEntity2Dto(atch)
    ),
  };
};

export const creationDto2Entity = (
  { rating, comment }: AchievementCreationDto,
  student: StudentEntity,
  activity: ActivityEntity,
  submissionRole: AchievementSubmissionRoleEntity,
  numOfAttachment: number
): AchievementCreationEntity => {
  return {
    student_oid: student.oid,
    activity_oid: activity.oid,
    rating: rating !== undefined ? rating : null,
    comment,
    achievement_submission_role: submissionRole,
    num_of_attachment: numOfAttachment,
    status: AchievementStatusEntity.Approved,
  };
};
