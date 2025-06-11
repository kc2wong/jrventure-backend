import { Request, Response, NextFunction } from 'express';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  publicBucketName,
  s3client,
} from '../../../util/s3-util';
import {
  AchievementGetById200ResponseDto,
  AchievementGetByIdRequestPathDto,
} from '../../dto-schema';
import { detailEntity2Dto } from '../../mapper/achievement-mapper';
import { NotFoundErrorDto } from '../error-validation';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getAchievementByIdRepo } from '../../../repo/achievement-repo';

export const getAchievementById = async (
  req: Request<AchievementGetByIdRequestPathDto, {}, {}, {}>,
  res: Response<AchievementGetById200ResponseDto>,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const result = await getAchievementByIdRepo(id);
    if (result === undefined) {
      throw new NotFoundErrorDto('Achievement', 'id', id);
    }
    const {
      achievement,
      attachment: attachmentEntity,
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
          achievement,
          student,
          activity,
          attachment,
        )
      );
  } catch (error) {
    next(error);
  }
};
