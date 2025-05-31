import { AchievementApprovalDetailDto, AchievementApprovalDto, AchievementCreationDto } from '../dto-schema';
import {
  StudentEntity,
  ActivityEntity,
  AchievementApprovalCreationEntity,
  AchievementApprovalStatusEntity,
  AchievementApprovalEntity,
  AchievementSubmissionRoleEntity,
  AchievementApprovalReviewEntity,
} from '../../repo/entity/db_entity';
import { entity2Dto as achievementSubmissionRoleEntity2Dto } from './achievement-submission-role-dto-mapper';
import { dto2Entity as achievemenApprovalStatusDto2Entity } from './achievement-approval-status-mapper';
import { entity2Dto as achievemenApprovalReviewEntity2Dto } from './achievement-approval-review-mapper';

export const entity2Dto = (
  {
    oid,
    status,
    rating,
    achievement_submission_role,
    comment,
  }: AchievementApprovalEntity,
  student: StudentEntity,
  activity: ActivityEntity
): AchievementApprovalDto => {
  return {
    id: oid.toString(),
    status: achievemenApprovalStatusDto2Entity(status),
    studentId: student.id,
    activityId: activity.oid.toString(),
    submissionRole: achievementSubmissionRoleEntity2Dto(
      achievement_submission_role
    ),
    rating: rating ? rating : undefined,
    comment: comment
  };
};

export const detailEntity2Dto = (
  {
    oid,
    status,
    rating,
    achievement_submission_role,
    comment,
  }: AchievementApprovalEntity,
  student: StudentEntity,
  activity: ActivityEntity,
  review?: AchievementApprovalReviewEntity[]
): AchievementApprovalDetailDto => {
  return {
    id: oid.toString(),
    status: achievemenApprovalStatusDto2Entity(status),
    studentId: student.id,
    activityId: activity.oid.toString(),
    submissionRole: achievementSubmissionRoleEntity2Dto(
      achievement_submission_role
    ),
    rating: rating ? rating : undefined,
    comment: comment,
    review: (review ?? []).map((r) => achievemenApprovalReviewEntity2Dto(r)),
  };
};

export const creationDto2Entity = (
  { rating, comment }: AchievementCreationDto,
  student: StudentEntity,
  activity: ActivityEntity,
  submissionRole: AchievementSubmissionRoleEntity
): AchievementApprovalCreationEntity => {
  return {
    achievement_oid: null,
    student_oid: student.oid,
    activity_oid: activity.oid,
    rating: rating !== undefined ? rating : null,
    comment,
    achievement_submission_role: submissionRole,
    status: AchievementApprovalStatusEntity.Pending,
  };
};
