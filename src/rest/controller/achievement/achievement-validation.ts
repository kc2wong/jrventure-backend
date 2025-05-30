import { z } from 'zod';
import { zodNumber, zodString } from '../../../type/zod';
import { AchievementCreationDto, UserRoleDto } from '../../dto-schema';
import {
  AchievementExistsErrorDto,
  DataEntitlementErrorDto,
  NotFoundErrorDto,
  ZodValidationErrorDto,
} from '../error-validation';
import { getActivityByOid as getActivityByOidRepo } from '../../../repo/activity-repo';
import { findStudent as findStudentRepo } from '../../../repo/student_repo';
import { findAchievementRepo } from '../../../repo/achievement-repo';
import { findAchievementApprovalRepo } from '../../../repo/achievement-approval-repo';
import {
  AchievementSubmissionRoleEntity,
  ActivityEntity,
  StudentEntity,
} from '../../../repo/entity/db_entity';
import { safeParseInt } from '../../../util/string-util';

const AchievementSchema = z.object({
  studentId: zodString(),
  activityId: zodString(),
  comment: zodString(),
  rating: zodNumber({ minValue: 1, maxValue: 5 }),
});

export const validateField = (payload: AchievementCreationDto) => {
  const result = AchievementSchema.safeParse(payload);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const invalidValue = firstIssue.path.reduce(
      (obj: any, key) => obj?.[key],
      payload
    );
    const path = firstIssue.path.join('.');
    throw new ZodValidationErrorDto(firstIssue.message, path, invalidValue);
  }
};

type ValidateStudentArgs = {
  entitledAllStudent: boolean;
  entitledStudentId: string[];
};
export const validateStudent = async (
  studentId: string,
  { entitledAllStudent, entitledStudentId }: ValidateStudentArgs
): Promise<StudentEntity> => {
  const student = await findStudentRepo([studentId]);
  if (student.length !== 1) {
    throw new NotFoundErrorDto('Student', studentId, 'studentId');
  }
  if (
    entitledAllStudent === false &&
    !entitledStudentId.includes(student[0][0].id)
  ) {
    // exception
    throw new DataEntitlementErrorDto('Student', studentId, 'studentId');
  }
  return student[0][0];
};

type ValidateActivityArgs = {
  userRole: UserRoleDto;
};
export const validateActivity = async (
  activityId: string,
  { userRole }: ValidateActivityArgs
): Promise<{
  activity: ActivityEntity;
  submissionRole: AchievementSubmissionRoleEntity;
}> => {
  const activityOid = safeParseInt(activityId);
  const activity = activityOid
    ? (await getActivityByOidRepo(activityOid))?.activity
    : undefined;
  if (activity === undefined) {
    throw new NotFoundErrorDto('Activity', activityId, 'activityId');
  }
  // Check if the required submssion role of the activity matches with input user
  const submissionRole =
    userRole === 'Teacher'
      ? 'Teacher'
      : userRole === 'Student' || userRole === 'Parent'
      ? 'Student'
      : undefined;
  if (
    activity.achievement_submission_role === 'Both' &&
    submissionRole === undefined
  ) {
    throw new DataEntitlementErrorDto('Activity', activityId, 'activityId');
  }
  if (
    activity.achievement_submission_role === 'Teacher' &&
    submissionRole !== 'Teacher'
  ) {
    throw new DataEntitlementErrorDto('Activity', activityId, 'activityId');
  }
  if (
    activity.achievement_submission_role === 'Student' &&
    submissionRole !== 'Student'
  ) {
    throw new DataEntitlementErrorDto('Activity', activityId, 'activityId');
  }

  return { activity, submissionRole: submissionRole! };
};

/**
 * Check if achievement already exists for same activity + student + submission role
 * @param activity
 * @param student
 * @param role
 * @param withApprovalRight
 */
export const validateExistingAchievement = async (
  activity: ActivityEntity,
  student: StudentEntity,
  role: AchievementSubmissionRoleEntity,
  withApprovalRight: boolean
) => {
  // check if achievement already exists
  const existingAchievements = withApprovalRight
    ? await findAchievementRepo({
        activityOid: activity.oid,
        studentOid: student.oid,
        role,
      })
    : await findAchievementApprovalRepo({
        activityOid: activity.oid,
        studentOid: student.oid,
        role,
      });

  if (existingAchievements.data.length > 0) {
    throw new AchievementExistsErrorDto(student.id, activity.oid.toString());
  }
};
