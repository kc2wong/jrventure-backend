import { Request, Response, NextFunction } from 'express';
import {
  AchievementApprovalGetById200ResponseDto,
  AchievementApprovalGetByIdRequestPathDto,
} from '../../dto-schema';
import { detailEntity2Dto } from '../../mapper/achievement-approval-mapper';
import { getAchievementApprovalByIdRepo } from '../../../repo/achievement-approval-repo';
import { NotFoundErrorDto } from '../error-validation';

export const getAchievementApprovalById = async (
  req: Request<AchievementApprovalGetByIdRequestPathDto, {}, {}, {}>,
  res: Response<AchievementApprovalGetById200ResponseDto>,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const result = await getAchievementApprovalByIdRepo(id);
    if (result === undefined) {
      throw new NotFoundErrorDto('Achievement Approval', 'id', id);
    }

    const { achievementApproval, review, student, activity } = result;
    res
      .status(200)
      .json(detailEntity2Dto(achievementApproval, student, activity, review));
  } catch (error) {
    next(error);
  }
};
