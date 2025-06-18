import { AchievementDetailDto } from '@api/achievement/achievement-schema';
import { NotFoundErrorDto } from '@api/shared/error-schema';
import { Achievement } from '@prisma/client';
import { deleteAchievementApprovalRepo } from '@repo/achievement-approval/delete-achievement-approval';
import { getAchievementApprovalByOidRepo } from '@repo/achievement-approval/get-achievement-approval';
import { createAchievementRepo } from '@repo/achievement/create-achievement';
import { getAchievementByOidRepo } from '@repo/achievement/get-achievement';
import { updateAchievementRepo } from '@repo/achievement/update-achievement';
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
    ? (await getAchievementByOidRepo(achievementApproval.achievement_oid))
        ?.achievement
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

  return detailEntity2Dto(
    achievement,
    student,
    activity,
    newAttachments.map((atch) => {
      return { ...atch, achievement_oid: achievement.oid };
    })
  );
};
