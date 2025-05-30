import { Request, Response, NextFunction } from 'express';
import {
  AchievementPost201ResponseDto,
  AchievementPostRequestDto,
} from '../../dto-schema';
import {
  creationDto2Entity as creationDto2Entity,
  entity2Dto,
} from '../../mapper/achievement-mapper';
import {
  creationDto2Entity as creationDto2ApprovalEntity,
  entity2Dto as approvalEntity2Dto,
} from '../../mapper/achievement-approval-mapper';
import { dto2Entity as achievementSubmissionRoleDto2Entity } from '../../mapper/achievement-submission-role-dto-mapper';

import {
  createAchievementRepo,
  findAchievementRepo,
  updateAchievementRepo,
} from '../../../repo/achievement-repo';
import {
  createAchievementApproval as createAchievementApprovalRepo,
  findAchievementApprovalRepo,
  updateAchievementApprovalRepo,
} from '../../../repo/achievement-approval-repo';
import { currentDatetime } from '../../../util/datetime-util';
import {
  validateField,
  validateStudent,
  validateActivity,
  validateExistingAchievement,
} from './achievement-validation';

export const createAchievement = async (
  req: Request<{}, {}, AchievementPostRequestDto>,
  res: Response<AchievementPost201ResponseDto>,
  next: NextFunction
) => {
  try {
    const now = currentDatetime();
    const authenticatedUser = res.locals.authenticatedUser!;
    const withApprovalRight = authenticatedUser.withApprovalRight === true;
    const achievementCreationDto = req.body;

    // validation
    validateField(achievementCreationDto);
    const student = await validateStudent(
      achievementCreationDto.studentId,
      authenticatedUser
    );
    const { activity, submissionRole } = await validateActivity(
      achievementCreationDto.activityId,
      authenticatedUser
    );

    const achievementCreationEntity = creationDto2Entity(
      achievementCreationDto,
      student,
      activity,
      submissionRole
    );
    const achievementApprovalCreationEntity = creationDto2ApprovalEntity(
      achievementCreationDto,
      student,
      activity,
      achievementSubmissionRoleDto2Entity(submissionRole)
    );

    const findAchievementQuery = {
      studentId: achievementCreationDto.studentId,
      activityId: achievementCreationDto.activityId,
      role: submissionRole,
      offset: 0,
      limit: 1,
    };

    if (withApprovalRight) {
      const existingAchievement = (
        await findAchievementRepo(findAchievementQuery)
      ).data[0]?.achievement;

      const newAchievement = existingAchievement
        ? await updateAchievementRepo({
            ...existingAchievement,
            ...achievementCreationEntity,
            status: 'Approved',
            updated_by_user_oid: authenticatedUser.oid,
            updated_at: now,
          })
        : await createAchievementRepo({
            ...achievementCreationEntity,
            status: 'Approved',
            created_by_user_oid: authenticatedUser.oid,
            created_at: now,
            updated_by_user_oid: authenticatedUser.oid,
            updated_at: now,
            version: 1,
          });
      res.status(201).json(entity2Dto(newAchievement, student, activity));
    } else {
      const existingAchievementApproval = (
        await findAchievementApprovalRepo(findAchievementQuery)
      ).data[0]?.achievementApproval;

      const newAchievementApproval = existingAchievementApproval
        ? await updateAchievementApprovalRepo({
            ...existingAchievementApproval,
            ...achievementCreationEntity,
            status: 'Pending',
            updated_by_user_oid: authenticatedUser.oid,
            updated_at: now,
          })
        : await createAchievementApprovalRepo({
            ...achievementApprovalCreationEntity,
            status: 'Pending',
            created_by_user_oid: authenticatedUser.oid,
            created_at: now,
            updated_by_user_oid: authenticatedUser.oid,
            updated_at: now,
            version: 1,
          });
      res
        .status(201)
        .json(approvalEntity2Dto(newAchievementApproval, student, activity));
    }
  } catch (error) {
    console.error('createAchievement error:', error);
    next(error);
  }
};
