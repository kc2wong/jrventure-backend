import { Request, Response, NextFunction } from 'express';

import {
  AchievementApprovalApprovalPost201ResponseDto,
  AchievementApprovalApprovalPostRequestPathDto,
} from '../../dto-schema';
import {
  deleteAchievementApprovalRepo,
  getAchievementApprovalByIdRepo,
} from '../../../repo/achievement-approval-repo';
import {
  createAchievementRepo,
  getAchievementByIdRepo,
  updateAchievementRepo,
} from '../../../repo/achievement-repo';
import { NotFoundErrorDto } from '../error-validation';
import {
  approvalBucketName,
  copyObject,
  deleteObject,
  publicBucketName,
  s3client,
} from '../../../util/s3-util';
import { detailEntity2Dto } from '../../mapper/achievement-mapper';
import { Achievement } from '@prisma/client';

export const approveAchievementApproval = async (
  req: Request<AchievementApprovalApprovalPostRequestPathDto, {}, {}>,
  res: Response<AchievementApprovalApprovalPost201ResponseDto>,
  next: NextFunction
) => {
  const id = req.params.id;

  const now = new Date();
  const authenticatedUser = res.locals.authenticatedUser!;
  try {
    const result = await getAchievementApprovalByIdRepo(id);
    if (result === undefined) {
      throw new NotFoundErrorDto('Achievement Approval', 'id', id);
    }
    const { achievementApproval, attachment, review, student, activity } =
      result;

    // 🔄 Handle attachment copying
    const newAttachments = await Promise.all(
      attachment.map(async (atch) => {
        const { oid, bucket_name, object_key, file_name, file_size } = atch;
        if (bucket_name !== publicBucketName) {
          await copyObject(
            publicBucketName,
            `${bucket_name}/${object_key}`,
            object_key
          );
        }
        return {
          oid,
          bucket_name: publicBucketName,
          object_key,
          file_name,
          file_size,
          getUrl: `https://${publicBucketName}.s3.${
            s3client.config.region
          }.amazonaws.com/${encodeURIComponent(object_key)}`,
        };
      })
    );

    const existingAchievement = achievementApproval.achievement_oid
      ? (
          await getAchievementByIdRepo(
            achievementApproval.achievement_oid.toString()
          )
        )?.achievement
      : undefined;

    let achievement: Achievement;
    if (existingAchievement) {
      const {
        oid,
        version,
        created_at,
        created_by_user_oid,
        activity_oid,
        student_oid,
        achievement_submission_role,
        rating,
        comment,
      } = existingAchievement;

      achievement = await updateAchievementRepo(
        {
          oid,
          version,
          created_by_user_oid,
          created_at,
          updated_by_user_oid: authenticatedUser.oid,
          updated_at: now,
          comment,
          activity_oid,
          student_oid,
          achievement_submission_role,
          rating,
          status: 'Approved',
          num_of_attachment: newAttachments.length,
        },
        newAttachments
      );
    } else {
      const {
        activity_oid,
        student_oid,
        achievement_submission_role,
        rating,
        comment,
      } = achievementApproval;

      achievement = await createAchievementRepo(
        {
          created_by_user_oid: authenticatedUser.oid,
          created_at: now,
          version: 1,
          updated_by_user_oid: authenticatedUser.oid,
          updated_at: now,
          comment,
          activity_oid,
          student_oid,
          achievement_submission_role,
          rating,
          status: 'Approved',
          num_of_attachment: newAttachments.length,
        },
        newAttachments
      );
    }

    // delete approval record and attachment
    await deleteAchievementApprovalRepo(
      achievementApproval.oid,
      achievementApproval.version
    );
    await Promise.all(
      attachment.map(async ({ bucket_name, object_key }) => {
        if (bucket_name === approvalBucketName) {
          await deleteObject(bucket_name, object_key);
        }
      })
    );

    res.status(201).json(
      detailEntity2Dto(
        achievement,
        student,
        activity,
        newAttachments.map((atch) => {
          return { ...atch, achievement_oid: achievement.oid };
        })
      )
    );
  } catch (error) {
    console.error('createAchievement error:', error);
    next(error);
  }
};
