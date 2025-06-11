import {
  AchievementApprovalDetailDto,
  AchievementApprovalDto,
  AchievementCreationDto,
  AchievementDetailDto,
} from '../dto-schema';
import {
  StudentEntity,
  ActivityEntity,
  AchievementApprovalCreationEntity,
  AchievementApprovalStatusEntity,
  AchievementApprovalEntity,
  AchievementSubmissionRoleEntity,
  AchievementApprovalReviewEntity,
  AchievementApprovalAttachmentEntity,
  AchievementAttachmentEntity,
  AchievementEntity,
} from '../../repo/entity/db_entity';
import { entity2Dto as achievementSubmissionRoleEntity2Dto } from './achievement-submission-role-dto-mapper';
import { entity2Dto as achievemenApprovalStatusEntity2Dto } from './achievement-approval-status-mapper';
import { entity2Dto as achievemenApprovalReviewEntity2Dto } from './achievement-approval-review-mapper';
import { entity2Dto as achievemenApprovalAttachmentEntity2Dto } from './achievement-approval-attachment-mapper';
import { entity2Dto as achievemenStatusEntity2Dto } from './achievement-status-mapper';
import { entity2Dto as achievemenAttachmentEntity2Dto } from './achievement-attachment-mapper'
import { entity2Dto as datetimeEntity2Dto } from './datetime-dto-mapper';

export const entity2Dto = (
  {
    oid,
    status,
    rating,
    achievement_submission_role,
    comment,
    num_of_attachment,
    created_by_user_oid,
    created_at,
    updated_by_user_oid,
    updated_at,
    version
  }: AchievementApprovalEntity,
  student: StudentEntity,
  activity: ActivityEntity
): AchievementApprovalDto => {
  return {
    id: oid.toString(),
    status: achievemenApprovalStatusEntity2Dto(status),
    studentId: student.id,
    activityId: activity.oid.toString(),
    submissionRole: achievementSubmissionRoleEntity2Dto(
      achievement_submission_role
    ),
    rating: rating ? rating : undefined,
    comment: comment,
    numberOfAttachment: num_of_attachment,
    createdAt: datetimeEntity2Dto(created_at),
    createdBy: created_by_user_oid.toString(),
    updatedAt: datetimeEntity2Dto(updated_at),
    updatedBy: updated_by_user_oid.toString(),
    version,
  };
};

// export const detailEntity2Dto = (
//   {
//     oid,
//     status,
//     rating,
//     achievement_submission_role,
//     comment,
//     num_of_attachment,
//   }: AchievementEntity,
//   student: StudentEntity,
//   activity: ActivityEntity,
//   attachment: (AchievementAttachmentEntity & { getUrl: string })[],
// ): AchievementDetailDto => {
//   return {
//     id: oid.toString(),
//     status: achievemenStatusEntity2Dto(status),
//     studentId: student.id,
//     activityId: activity.oid.toString(),
//     submissionRole: achievementSubmissionRoleEntity2Dto(
//       achievement_submission_role
//     ),
//     rating: rating ? rating : undefined,
//     comment: comment,
//     numberOfAttachment: num_of_attachment,
//     attachment: attachment.map((atch) =>
//       achievemenAttachmentEntity2Dto(atch)
//     ),
//   };
// };

export const approvalDetailEntity2Dto = (
  {
    oid,
    status,
    rating,
    achievement_submission_role,
    comment,
    num_of_attachment,
    created_by_user_oid,
    created_at,
    updated_by_user_oid,
    updated_at,
    version
  }: AchievementApprovalEntity,
  student: StudentEntity,
  activity: ActivityEntity,
  attachment: (AchievementApprovalAttachmentEntity & { getUrl: string })[],
  review?: AchievementApprovalReviewEntity[]
): AchievementApprovalDetailDto => {
  return {
    id: oid.toString(),
    status: achievemenApprovalStatusEntity2Dto(status),
    studentId: student.id,
    activityId: activity.oid.toString(),
    submissionRole: achievementSubmissionRoleEntity2Dto(
      achievement_submission_role
    ),
    rating: rating ? rating : undefined,
    comment: comment,
    createdAt: datetimeEntity2Dto(created_at),
    createdBy: created_by_user_oid.toString(),
    updatedAt: datetimeEntity2Dto(updated_at),
    updatedBy: updated_by_user_oid.toString(),
    version,
    review: (review ?? []).map((r) => achievemenApprovalReviewEntity2Dto(r)),
    numberOfAttachment: num_of_attachment,
    attachment: attachment.map((atch) =>
      achievemenApprovalAttachmentEntity2Dto(atch)
    ),
  };
};

export const creationDto2Entity = (
  { rating, comment }: AchievementCreationDto,
  student: StudentEntity,
  activity: ActivityEntity,
  submissionRole: AchievementSubmissionRoleEntity,
  numOfAttachment: number,
): AchievementApprovalCreationEntity => {
  return {
    achievement_oid: null,
    student_oid: student.oid,
    activity_oid: activity.oid,
    rating: rating !== undefined ? rating : null,
    comment,
    achievement_submission_role: submissionRole,
    num_of_attachment: numOfAttachment,
    status: AchievementApprovalStatusEntity.Pending,
  };
};
