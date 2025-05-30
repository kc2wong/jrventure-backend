import { AchievementApprovalDto, AchievementCreationDto } from '../dto-schema';
import {
  StudentEntity,
  ActivityEntity,
  AchievementApprovalCreationEntity,
  AchievementApprovalStatusEntity,
  AchievementApprovalEntity,
  AchievementSubmissionRoleEntity,
} from '../../repo/entity/db_entity';
import {
  entity2Dto as achievementSubmissionRoleEntity2Dto,
} from './achievement-submission-role-dto-mapper';
import { dto2Entity as achievemenApprovalStatusDto2Entity } from './achievement-approval-status-mapper';

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
    comment: comment,
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
