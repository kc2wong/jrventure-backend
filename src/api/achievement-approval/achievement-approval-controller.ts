import { NextFunction, Request, Response } from 'express';

import {
  UpdateAchievement200ResponseDto,
  UpdateAchievementDto,
  UpdateAchievementPathDto,
} from '@api/achievement/achievement-schema';
import {
  ApproveAchievementApproval201ResponseDto,
  ApproveAchievementApprovalPathDto,
  CreateAchievementApprovalReview201ResponseDto,
  CreateAchievementApprovalReviewDto,
  CreateAchievementApprovalReviewPathDto,
  FindAchievementApproval200ResponseDto,
  FindAchievementApprovalQueryDto,
  GetAchievementApprovalById200ResponseDto,
  GetAchievementApprovalByIdPathDto,
  ProfanityCheckAchievementApprovalPathDto,
} from '@api/achievement-approval/achievement-approval-schema';
import { NotFoundErrorDto } from '@api/shared/error-schema';
import { updateAchievementService } from '@service/achievement/update-achievement';
import { approveAchievementApprovalService } from '@service/achievement-approval/approve-achievement-approval';
import { createAchievementApprovalService } from '@service/achievement-approval/create-achievement-approval';
import { createAchievementApprovaProfanityChecklService } from '@service/achievement-approval/create-achievement-approval-profanity-check';
import { createAchievementApprovalReviewService } from '@service/achievement-approval/create-achievement-approval-review';
import { findAchievementApprovalService } from '@service/achievement-approval/find-achievement-approval';
import { getAchievementApprovalByIdService } from '@service/achievement-approval/get-achievement-approval';

export const findAchievementApprovalApi = async (
  req: Request<{}, {}, {}, FindAchievementApprovalQueryDto>,
  res: Response<FindAchievementApproval200ResponseDto>,
  next: NextFunction
) => {
  try {
    const result = await findAchievementApprovalService(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAchievementApprovalByIdApi = async (
  req: Request<GetAchievementApprovalByIdPathDto, {}, {}>,
  res: Response<GetAchievementApprovalById200ResponseDto>,
  next: NextFunction
) => {
  try {
    const achievementApproval = await getAchievementApprovalByIdService(
      req.params.id
    );
    if (achievementApproval === undefined) {
      throw new NotFoundErrorDto('Achievement Approval', 'id', req.params.id);
    }
    res.status(200).json(achievementApproval);
  } catch (error) {
    next(error);
  }
};

export const createAchievementApprovalReviewApi = async (
  req: Request<
    CreateAchievementApprovalReviewPathDto,
    {},
    CreateAchievementApprovalReviewDto
  >,
  res: Response<CreateAchievementApprovalReview201ResponseDto>,
  next: NextFunction
) => {
  const authenticatedUser = res.locals.authenticatedUser;
  const id = req.params.id;
  try {
    await createAchievementApprovalReviewService(
      authenticatedUser,
      id,
      req.body
    );
    const achievementApprovalDetail = await getAchievementApprovalByIdService(
      id
    );
    res.status(201).json(achievementApprovalDetail);
  } catch (error) {
    next(error);
  }
};

export const approveAchievementApprovalApi = async (
  req: Request<ApproveAchievementApprovalPathDto, {}, {}>,
  res: Response<ApproveAchievementApproval201ResponseDto>,
  next: NextFunction
) => {
  const authenticatedUser = res.locals.authenticatedUser;
  const id = req.params.id;
  try {
    const achievementDetail = await approveAchievementApprovalService(
      authenticatedUser,
      id
    );
    res.status(201).json(achievementDetail);
  } catch (error) {
    next(error);
  }
};

export const profanityCheckAchievementApprovalApi = async (
  req: Request<ProfanityCheckAchievementApprovalPathDto, {}, {}>,
  res: Response<{}>,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    await createAchievementApprovaProfanityChecklService(id);
    res.status(204).end();
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
