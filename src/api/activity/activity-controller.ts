import { NextFunction, Request, Response } from 'express';

import {
  GetActivityById200ResponseDto,
  GetActivityByIdPathDto,
  FindActivity200ResponseDto,
  FindActivityQueryDto,
  CreateActivity201ResponseDto,
  CreateActivityDto,
  UpdateActivityDto,
  UpdateActivity200ResponseDto,
  UpdateActivityPathDto,
} from '@api/activity/activity-schema';
import { NotFoundErrorDto } from '@api/shared/error-schema';
import { createActivityService } from '@service/activity/create-activity';
import { findActivityService } from '@service/activity/find-activity';
import { getActivityByIdService } from '@service/activity/get-activity';
import { updateActivityService } from '@service/activity/update-activity';

export const findActivityApi = async (
  req: Request<{}, {}, {}, FindActivityQueryDto>,
  res: Response<FindActivity200ResponseDto>,
  next: NextFunction
) => {
  try {
    const result = await findActivityService(req.params);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getActivityByIdApi = async (
  req: Request<GetActivityByIdPathDto, {}, {}>,
  res: Response<GetActivityById200ResponseDto>,
  next: NextFunction
) => {
  try {
    const activity = await getActivityByIdService(req.params.id);
    if (activity === undefined) {
      throw new NotFoundErrorDto('Activity', 'id', req.params.id);
    }
    res.status(200).json(activity);
  } catch (error) {
    next(error);
  }
};

export const createActivityApi = async (
  req: Request<{}, {}, CreateActivityDto>,
  res: Response<CreateActivity201ResponseDto>,
  next: NextFunction
) => {
  const authenticatedUser = res.locals.authenticatedUser;
  const activityCreationDto = req.body;
  try {
    const newActivity = await createActivityService(
      authenticatedUser,
      activityCreationDto
    );
    res.status(201).json(newActivity);
  } catch (error) {
    next(error);
  }
};

export const updateActivityApi = async (
  req: Request<UpdateActivityPathDto, {}, UpdateActivityDto>,
  res: Response<UpdateActivity200ResponseDto>,
  next: NextFunction
) => {
  const authenticatedUser = res.locals.authenticatedUser;
  const activityCreationDto = req.body;
  try {
    const newActivity = await updateActivityService(
      authenticatedUser,
      req.params.id,
      activityCreationDto
    );
    res.status(200).json(newActivity);
  } catch (error) {
    next(error);
  }
};
