import { AchievementDto, AchievementCreationDto } from '../dto-schema';
import {
  entity2Dto as achievementStatusEntity2Dto,
  dto2Entity as achievementStatusDto2Entity,
} from './achievement-status-mapper';
import {
  entity2Dto as achievementSubmissionRoleEntity2Dto,
} from './achievement-submission-role-dto-mapper';
import {
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
  };
};

export const creationDto2Entity = (
  { rating, comment }: AchievementCreationDto,
  student: StudentEntity,
  activity: ActivityEntity,
  submissionRole: AchievementSubmissionRoleEntity,
): AchievementCreationEntity => {
  return {
    student_oid: student.oid,
    activity_oid: activity.oid,
    rating: rating !== undefined ? rating : null,
    comment,
    achievement_submission_role: submissionRole,
    status: AchievementStatusEntity.Approved,
  };
};
