import { Request, Response, NextFunction } from 'express';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  approvalBucketName,
  publicBucketName,
  s3client,
} from '../../../util/s3-util';
import {
  AchievementApprovalGetById200ResponseDto,
  AchievementApprovalGetByIdRequestPathDto,
} from '../../dto-schema';
import { detailEntity2Dto } from '../../mapper/achievement-approval-mapper';
import { getAchievementApprovalByIdRepo } from '../../../repo/achievement-approval-repo';
import { NotFoundErrorDto } from '../error-validation';
import { GetObjectCommand } from '@aws-sdk/client-s3';

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
    const {
      achievementApproval,
      attachment: attachmentEntity,
      review,
      student,
      activity,
    } = result;
    const attachmentPromise = Promise.all(
      attachmentEntity.map(async (atch) => {
        const getObjectCommand = new GetObjectCommand({
          Bucket: atch.bucket_name,
          Key: atch.object_key,
        });
        const getUrl =
          atch.bucket_name === publicBucketName
            ? `https://${atch.bucket_name}.s3.${
                s3client.config.region
              }.amazonaws.com/${encodeURIComponent(atch.object_key)}`
            : await getSignedUrl(s3client, getObjectCommand, {
                // 1 hr
                expiresIn: 3600,
              });
        return { ...atch, getUrl };
      })
    );
    const attachment = await attachmentPromise;
    res
      .status(200)
      .json(
        detailEntity2Dto(
          achievementApproval,
          student,
          activity,
          attachment,
          review
        )
      );
  } catch (error) {
    next(error);
  }
};
