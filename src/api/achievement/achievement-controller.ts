import { NextFunction, Request, Response } from 'express';
import { NotFoundErrorDto } from '@api/shared/error-schema';
import {
  CreateAchievement201ResponseDto,
  CreateAchievementDto,
  FindAchievement200ResponseDto,
  FindAchievementQueryDto,
  GetAchievementById200ResponseDto,
  GetAchievementByIdPathDto,
  UpdateAchievement200ResponseDto,
  UpdateAchievementDto,
  UpdateAchievementPathDto,
} from '@api/achievement/achievement-schema';
import { findAchievementService } from '@service/achievement/find-achievement';
import { getAchievementByIdService } from '@service/achievement/get-achievement';
import { createAchievementService } from '@service/achievement/create-achievement';
import { updateAchievementService } from '@service/achievement/update-achievement';
import { createAchievementApprovalService } from '@service/achievement-approval/create-achievement-approval';

export const findAchievementApi = async (
  req: Request<{}, {}, {}, FindAchievementQueryDto>,
  res: Response<FindAchievement200ResponseDto>,
  next: NextFunction
) => {
  try {
    const result = await findAchievementService(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAchievementByIdApi = async (
  req: Request<GetAchievementByIdPathDto, {}, {}>,
  res: Response<GetAchievementById200ResponseDto>,
  next: NextFunction
) => {
  try {
    const activity = await getAchievementByIdService(req.params.id);
    if (activity === undefined) {
      throw new NotFoundErrorDto('Activity', 'id', req.params.id);
    }
    res.status(200).json(activity);
  } catch (error) {
    next(error);
  }
};

export const createAchievementApi = async (
  req: Request<{}, {}, CreateAchievementDto>,
  res: Response<CreateAchievement201ResponseDto>,
  next: NextFunction
) => {
  const authenticatedUser = res.locals.authenticatedUser;
  const withApprovalRight = authenticatedUser.withApprovalRight === true;

  const achievementCreationDto = req.body;
  try {
    const newAchievement = withApprovalRight
      ? await createAchievementService(
          authenticatedUser,
          achievementCreationDto
        )
      : await createAchievementApprovalService(
          authenticatedUser,
          achievementCreationDto
        );
    res.status(201).json(newAchievement);
  } catch (error) {
    next(error);
  }
};

export const updateAchievementApi = async (
  req: Request<UpdateAchievementPathDto, {}, UpdateAchievementDto>,
  res: Response<UpdateAchievement200ResponseDto | any>, // allow both DTOs
  next: NextFunction
) => {
  const authenticatedUser = res.locals.authenticatedUser;
  const withApprovalRight = authenticatedUser.withApprovalRight === true;
  const achievementUpdateDto = req.body;
  try {
    if (withApprovalRight) {
      const updatedAchievement = await updateAchievementService(
        authenticatedUser,
        req.params.id,
        achievementUpdateDto
      );
      res.status(200).json(updatedAchievement);
    } else {
      const approval = await createAchievementApprovalService(
        authenticatedUser,
        achievementUpdateDto
      );
      res.status(200).json(approval); // This may have a different DTO type
    }
  } catch (error) {
    next(error);
  }
};
