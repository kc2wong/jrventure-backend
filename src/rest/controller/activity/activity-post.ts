import { Request, Response, NextFunction } from 'express';
import {
  ActivityPost201ResponseDto,
  ActivityPostRequestDto,
} from '../../dto-schema';
import { creationDto2Entity, entity2Dto } from '../../mapper/activity-mapper';
import { createActivity as createActivityRepo } from '../../../repo/activity-repo';
import { currentDatetime } from '../../../util/datetime-util';
import { validateField, validateActivityCategory } from './activity-validation';
import { NotLoginErrorDto } from '../error-unauthorized';

export const createActivity = async (
  req: Request<{}, {}, ActivityPostRequestDto>,
  res: Response<ActivityPost201ResponseDto>,
  next: NextFunction
) => {
  try {
    const authenticatedUser = res.locals.authenticatedUser;
    if (!authenticatedUser) {
      throw new NotLoginErrorDto();
    }

    const activityCreationDto = req.body;
    validateField(activityCreationDto);
    const activityCategory = await validateActivityCategory(
      activityCreationDto.categoryCode
    );
    const activityCreation = creationDto2Entity(
      activityCreationDto,
      activityCategory
    );

    const now = currentDatetime();

    const newActivity = await createActivityRepo({
      ...activityCreation,
      created_by_user_oid: authenticatedUser.oid,
      created_at: now,
      updated_by_user_oid: authenticatedUser.oid,
      updated_at: now,
      version: 1,
    });

    res.status(201).json(entity2Dto(newActivity, activityCategory));
  } catch (error) {
    console.error('createActivity error:', error);
    next(error);
  }
};
