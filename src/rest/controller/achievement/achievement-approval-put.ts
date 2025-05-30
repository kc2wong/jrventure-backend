import { Request, Response, NextFunction } from 'express';
import {
  AchievementApprovalPut200ResponseDto,
  AchievementApprovalPutRequestDto,
  AchievementApprovalPutRequestPathDto,
} from '../../dto-schema';
import {
  creationDto2Entity,
  entity2Dto,
} from '../../mapper/achievement-approval-mapper';
import { currentDatetime } from '../../../util/datetime-util';
import {
  validateActivity,
  validateField,
  validateStudent,
} from './achievement-validation';
import { NotFoundErrorDto } from '../error-validation';
import {
  getAchievementApprovalByIdRepo,
  updateAchievementApprovalRepo,
} from '../../../repo/achievement-approval-repo';

export const updateAchievementApproval = async (
  req: Request<
    AchievementApprovalPutRequestPathDto,
    {},
    AchievementApprovalPutRequestDto
  >,
  res: Response<AchievementApprovalPut200ResponseDto>,
  next: NextFunction
) => {
  try {
    const authenticatedUser = res.locals.authenticatedUser!;

    const id = req.params.id;
    const { version, ...achievementUpdateDto } = req.body;

    validateField(achievementUpdateDto);
    const student = await validateStudent(
      achievementUpdateDto.studentId,
      authenticatedUser
    );
    const { activity, submissionRole } = await validateActivity(
      achievementUpdateDto.activityId,
      authenticatedUser
    );

    const payload = creationDto2Entity(
      achievementUpdateDto,
      student,
      activity,
      submissionRole
    );

    const achievement = await getAchievementApprovalByIdRepo(id);
    if (achievement === undefined) {
      throw new NotFoundErrorDto('Achievement Approval', 'id', id);
    }

    const now = currentDatetime();
    const updatedAchievement = await updateAchievementApprovalRepo({
      ...payload,
      status: 'Pending',
      oid: achievement.oid,
      achievement_oid: achievement.achievement_oid,
      created_by_user_oid: achievement.created_by_user_oid,
      created_at: achievement.created_at,
      updated_by_user_oid: authenticatedUser.oid,
      updated_at: now,
      version: version,
    });

    res.status(200).json(entity2Dto(updatedAchievement, student, activity));
  } catch (error) {
    console.error('updateActivity error:', error);
    next(error);
  }
};
