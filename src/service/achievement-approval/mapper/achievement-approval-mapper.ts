
import { entity2Dto as achievementSubmissionRoleEntity2Dto } from '@service/activity/mapper/achievement-submission-role-mapper';
import { entity2Dto as achievemenApprovalStatusEntity2Dto } from '@service/achievement-approval/mapper/achievement-approval-status-mapper';
import { entity2Dto as achievemenApprovalReviewEntity2Dto } from './achievement-approval-review-mapper';
import { entity2Dto as achievemenApprovalAttachmentEntity2Dto } from './achievement-approval-attachment-mapper';
import { entity2Dto as achievemenStatusEntity2Dto } from '@service/achievement/mapper/achievement-status-mapper';
import { entity2Dto as achievemenAttachmentEntity2Dto } from '@service/achievement/mapper/achievement-attachment-mapper'
import { entity2Dto as datetimeEntity2Dto } from '@shared/mapper/datetime-mapper';
import { AchievementApprovalDetailDto, AchievementApprovalDto } from '@api/achievement-approval/achievement-approval-schema';
import { CreateAchievementDto } from '@api/achievement/achievement-schema';
import { AchievementApproval, AchievementApprovalAttachment, AchievementApprovalReview, AchievementApprovalStatus, AchievementSubmissionRole, Activity, Student } from '@prisma/client';
import { AchievementApprovalCreationEntity } from '@repo/entity/db_entity';

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
  { rating, comment }: CreateAchievementDto,
  student: Student,
  activity: Activity,
  submissionRole: AchievementSubmissionRole,
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
    status: AchievementApprovalStatus.Pending,
  };
};
