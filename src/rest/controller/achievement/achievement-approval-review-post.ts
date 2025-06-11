import { Request, Response, NextFunction } from 'express';

import {
  AchievementApprovalReviewPost201ResponseDto,
  AchievementApprovalReviewPostRequestDto,
  AchievementApprovalReviewPostRequestPathDto,
} from '../../dto-schema';
import {
  getAchievementApprovalByIdRepo,
  updateAchievementApprovalRepo,
} from '../../../repo/achievement-approval-repo';
import { createAchievementApprovalReviewRepo } from '../../../repo/achievement-approval-review-repo';
import { NotFoundErrorDto } from '../error-validation';
import { dto2Entity as contentTypeDto2Entity } from '../../mapper/achievement-comment-type-mapper';
import { entity2Dto } from '../../mapper/achievement-approval-review-mapper';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { publicBucketName, s3client } from '../../../util/s3-util';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { approvalDetailEntity2Dto } from '../../mapper/achievement-approval-mapper';

export const createAchievementApprovalReview = async (
  req: Request<
    AchievementApprovalReviewPostRequestPathDto,
    {},
    AchievementApprovalReviewPostRequestDto
  >,
  res: Response<AchievementApprovalReviewPost201ResponseDto>,
  next: NextFunction
) => {
  const id = req.params.id;
  const { commentType, comment } = req.body;

  if (commentType !== 'Conversation' && commentType !== 'Rejection') {
    // throw exception
  }

  const now = new Date();
  const authenticatedUser = res.locals.authenticatedUser!;
  try {
    const result = await getAchievementApprovalByIdRepo(id);
    if (result === undefined) {
      throw new NotFoundErrorDto('Achievement Approval', 'id', id);
    }
    const {
      achievementApproval,
      attachment: existingAttachments,
      review,
      student,
      activity,
    } = result;

    if (commentType === 'Rejection') {
      const updatedAchievement = await updateAchievementApprovalRepo({
        ...achievementApproval,
        status: 'Rejected',
      });
    }

    const newReview = await createAchievementApprovalReviewRepo({
      comment_type: contentTypeDto2Entity(commentType),
      comment,
      created_by_user_oid: authenticatedUser.oid,
      created_at: now,
      updated_by_user_oid: authenticatedUser.oid,
      updated_at: now,
      version: 1,
      achievement_approval_oid: achievementApproval.oid,
    });

    const attachmentPromise = Promise.all(
      existingAttachments.map(async (atch) => {
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
      .status(201)
      .json(
        approvalDetailEntity2Dto(
          achievementApproval,
          student,
          activity,
          attachment,
          [...review, newReview]
        )
      );
  } catch (error) {
    console.error('createAchievement error:', error);
    next(error);
  }
};
