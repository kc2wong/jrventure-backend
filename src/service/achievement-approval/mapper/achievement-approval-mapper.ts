import { CreateAchievementDto } from '@api/achievement/achievement-schema';
import {
  AchievementApprovalDetailDto,
  AchievementApprovalDto,
} from '@api/achievement-approval/achievement-approval-schema';
import {
  AchievementApproval,
  AchievementApprovalAttachment,
  AchievementApprovalCreationEntity,
  AchievementApprovalReview,
  AchievementApprovalStatus,
  AchievementSubmissionRole,
  Activity,
  Student,
} from '@repo/db';
import { entity2Dto as achievemenApprovalAttachmentEntity2Dto } from '@service/achievement-approval/mapper/achievement-approval-attachment-mapper';
import { entity2Dto as achievemenApprovalReviewEntity2Dto } from '@service/achievement-approval/mapper/achievement-approval-review-mapper';
import { entity2Dto as achievemenApprovalStatusEntity2Dto } from '@service/achievement-approval/mapper/achievement-approval-status-mapper';
import { entity2Dto as achievementSubmissionRoleEntity2Dto } from '@service/activity/mapper/achievement-submission-role-mapper';
import { entity2Dto as datetimeEntity2Dto } from '@shared/mapper/datetime-mapper';

export const entity2Dto = (
  {
    oid,
    status,
    rating,
    achievementSubmissionRole,
    comment,
    numOfAttachment,
    createdByUserOid,
    createdAt,
    updatedByUserOid,
    updatedAt,
    version,
  }: AchievementApproval,
  student: Student,
  activity: Activity
): AchievementApprovalDto => {
  return {
    id: oid.toString(),
    status: achievemenApprovalStatusEntity2Dto(status),
    studentId: student.id,
    activityId: activity.oid.toString(),
    submissionRole: achievementSubmissionRoleEntity2Dto(
      // achievement_submission_role
      achievementSubmissionRole
    ),
    rating: rating ? rating : undefined,
    comment: comment,
    numberOfAttachment: numOfAttachment,
    createdAt: datetimeEntity2Dto(createdAt),
    createdBy: createdByUserOid.toString(),
    updatedAt: datetimeEntity2Dto(updatedAt),
    updatedBy: updatedByUserOid.toString(),
    version,
  };
};

export const approvalDetailEntity2Dto = (
  {
    oid,
    status,
    rating,
    achievementSubmissionRole,
    comment,
    numOfAttachment,
    createdByUserOid,
    createdAt,
    updatedByUserOid,
    updatedAt,
    version,
  }: AchievementApproval,
  student: Student,
  activity: Activity,
  attachment: (AchievementApprovalAttachment & { getUrl: string })[],
  review?: AchievementApprovalReview[]
): AchievementApprovalDetailDto => {
  return {
    id: oid.toString(),
    status: achievemenApprovalStatusEntity2Dto(status),
    studentId: student.id,
    activityId: activity.oid.toString(),
    submissionRole: achievementSubmissionRoleEntity2Dto(
      achievementSubmissionRole
    ),
    rating: rating ? rating : undefined,
    comment: comment,
    createdAt: datetimeEntity2Dto(createdAt),
    createdBy: createdByUserOid.toString(),
    updatedAt: datetimeEntity2Dto(updatedAt),
    updatedBy: updatedByUserOid.toString(),
    version,
    review: (review ?? []).map((r) => achievemenApprovalReviewEntity2Dto(r)),
    numberOfAttachment: numOfAttachment,
    attachment: attachment.map((atch) =>
      achievemenApprovalAttachmentEntity2Dto(atch)
    ),
  };
};

export const creationDto2Entity = (
  { rating, comment }: CreateAchievementDto,
  student: Student,
  activity: Activity,
  submissionRole: AchievementSubmissionRole,
  numOfAttachment: number
): AchievementApprovalCreationEntity => {
  return {
    achievementOid: null,
    studentOid: student.oid,
    activityOid: activity.oid,
    rating: rating !== undefined ? rating : null,
    comment,
    achievementSubmissionRole: submissionRole,
    numOfAttachment: numOfAttachment,
    status: AchievementApprovalStatus.pending,
  };
};
