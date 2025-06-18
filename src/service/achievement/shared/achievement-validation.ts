import { findStudentRepo } from '@repo/student/find-student';
import { findAchievementApprovalRepo } from '../../../repo/achievement-approval-repo';
import { getActivityByOidRepo } from '@repo/activity/get-activity';
import { Activity, Student, AchievementSubmissionRole, UserRole } from '@prisma/client';
import { AchievementExistsErrorDto, DataEntitlementErrorDto, NotFoundErrorDto } from '@api/shared/error-schema';
import { findAchievementRepo } from '@repo/achievement-repo';
import { safeParseInt } from '@util/string-util';

type ValidateStudentArgs = {
  entitledAllStudent: boolean;
  entitledStudentId: string[];
};
export const validateStudent = async (
  studentId: string,
  { entitledAllStudent, entitledStudentId }: ValidateStudentArgs
): Promise<Student> => {
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
  userRole: UserRole;
};
export const validateActivity = async (
  activityId: string,
  { userRole }: ValidateActivityArgs
): Promise<{
  activity: Activity;
  submissionRole: AchievementSubmissionRole;
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
    userRole === 'teacher'
      ? 'Teacher'
      : userRole === 'student' || userRole === 'parent'
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
  activity: Activity,
  student: Student,
  role: AchievementSubmissionRole,
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
