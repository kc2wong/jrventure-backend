import { Request, Response, NextFunction } from 'express';
import {
  ActivityPut200ResponseDto,
  ActivityPutRequestDto,
  ActivityPutRequestPathDto,
} from '../../dto-schema';
import { creationDto2Entity, entity2Dto } from '../../mapper/activity-mapper';
import {
  updateActivity as updateActivityRepo,
  getActivityByOid as getActivityByOidRepo,
} from '../../../repo/activity-repo';
import { currentDatetime } from '../../../util/datetime-util';
import { validateField, validateActivityCategory } from './activity-validation';
import { NotLoginErrorDto } from '../error-unauthorized';
import { safeParseInt } from '../../../util/string-util';
import { NotFoundErrorDto } from '../error-validation';

export const updateActivity = async (
  req: Request<ActivityPutRequestPathDto, {}, ActivityPutRequestDto>,
  res: Response<ActivityPut200ResponseDto>,
  next: NextFunction
) => {
  try {
    const authenticatedUser = res.locals.authenticatedUser;
    if (!authenticatedUser) {
      throw new NotLoginErrorDto();
    }

    const {version, ...activityUpdateDto} = req.body;
    
    validateField(activityUpdateDto);
    const activityCategory = await validateActivityCategory(
      activityUpdateDto.categoryCode
    );

    const id = req.params.id;
    const oid = safeParseInt(id);
    const activity = oid ? (await getActivityByOidRepo(oid))?.activity : undefined;
    if (activity === undefined) {
      throw new NotFoundErrorDto('Activity', 'id', req.params.id);
    }

    const activityUpdate = creationDto2Entity(
      activityUpdateDto,
      activityCategory
    );

    const now = currentDatetime();
    const updatedActivity = await updateActivityRepo({
      ...activityUpdate,
      oid: activity.oid,
      created_by_user_oid: activity.created_by_user_oid,
      created_at: activity.created_at,
      updated_by_user_oid: authenticatedUser.oid,
      updated_at: now,
      version: version,
    });

    res.status(200).json(entity2Dto(updatedActivity, activityCategory));
  } catch (error) {
    console.error('updateActivity error:', error);
    next(error);
  }
};
