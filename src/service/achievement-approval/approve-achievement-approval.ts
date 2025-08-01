import { AchievementDetailDto } from '@api/achievement/achievement-schema';
import { NotFoundErrorDto } from '@api/shared/error-schema';
import { deleteAchievementApprovalRepo } from '@repo/achievement-approval/delete-achievement-approval';
import { getAchievementApprovalByOidRepo } from '@repo/achievement-approval/get-achievement-approval';
import { createAchievementRepo } from '@repo/achievement/create-achievement';
import { getAchievementByOidRepo } from '@repo/achievement/get-achievement';
import { updateAchievementRepo } from '@repo/achievement/update-achievement';
import { Achievement, AchievementStatus } from '@repo/db';
import { detailEntity2Dto } from '@service/achievement/mapper/achievement-mapper';
import { AuthenticatedUser } from '@type/authentication';
import { currentDatetime } from '@util/datetime-util';
import {
  approvalBucketName,
  copyObject,
  deleteObject,
  publicBucketName,
  s3client,
} from '@util/s3-util';
import { safeParseInt } from '@util/string-util';

export const approveAchievementApprovalService = async (
  authenticatedUser: AuthenticatedUser,
  id: string
): Promise<AchievementDetailDto> => {
  const now = currentDatetime();

  const oid = safeParseInt(id);
  const result = oid ? await getAchievementApprovalByOidRepo(oid) : undefined;
  if (result === undefined) {
    throw new NotFoundErrorDto('Achievement Approval', 'id', id);
  }
  const { achievementApproval, attachment, student, activity } = result;

  // 🔄 Handle attachment copying
  const newAttachments = await Promise.all(
    attachment.map(async (atch) => {
      const { oid, bucketName, objectKey, fileName, fileSize } = atch;
      if (bucketName !== publicBucketName) {
        await copyObject(
          publicBucketName,
          `${bucketName}/${objectKey}`,
          objectKey
        );
      }
      return {
        oid,
        bucketName: publicBucketName,
        objectKey,
        fileName,
        fileSize,
        getUrl: `https://${publicBucketName}.s3.${
          s3client.config.region
        }.amazonaws.com/${encodeURIComponent(objectKey)}`,
      };
    })
  );

  const existingAchievement = achievementApproval.achievementOid
    ? (await getAchievementByOidRepo(achievementApproval.achievementOid))
        ?.achievement
    : undefined;

  let achievement: Achievement;
  if (existingAchievement) {
    const {
      oid,
      version,
      createdAt,
      createdByUserOid,
      activityOid,
      studentOid,
      achievementSubmissionRole,
      rating,
      comment,
    } = existingAchievement;

    achievement = await updateAchievementRepo(
      {
        oid,
        version,
        createdByUserOid,
        createdAt,
        updatedByUserOid: authenticatedUser.oid,
        updatedAt: now,
        comment,
        activityOid,
        studentOid,
        achievementSubmissionRole,
        rating,
        status: AchievementStatus.approved,
        numOfAttachment: newAttachments.length,
      },
      newAttachments
    );
  } else {
    const {
      activityOid,
      studentOid,
      achievementSubmissionRole,
      rating,
      comment,
    } = achievementApproval;

    achievement = await createAchievementRepo(
      {
        createdByUserOid: authenticatedUser.oid,
        createdAt: now,
        version: 1,
        updatedByUserOid: authenticatedUser.oid,
        updatedAt: now,
        comment,
        activityOid,
        studentOid,
        achievementSubmissionRole,
        rating,
        status: AchievementStatus.approved,
        numOfAttachment: newAttachments.length,
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
    attachment.map(async ({ bucketName, objectKey }) => {
      if (bucketName === approvalBucketName) {
        await deleteObject(bucketName, objectKey);
      }
    })
  );

  return detailEntity2Dto(
    achievement,
    student,
    activity,
    newAttachments.map((atch) => {
      return { ...atch, achievementOid: achievement.oid };
    })
  );
};
