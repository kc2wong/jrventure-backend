import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { AchievementDetailDto } from '@api/achievement/achievement-schema';
import { NotFoundErrorDto } from '@api/shared/error-schema';
import { getAchievementByOidRepo } from '@repo/achievement/get-achievement';
import { detailEntity2Dto } from '@service/achievement/mapper/achievement-mapper';
import { publicBucketName, s3client } from '@util/s3-util';
import { safeParseInt } from '@util/string-util';

export const getAchievementByIdService = async (
  id: string
): Promise<AchievementDetailDto | undefined> => {
  const oid = safeParseInt(id);

  const result = oid ? await getAchievementByOidRepo(oid) : undefined;
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
        // Bucket: atch.bucket_name,
        // Key: atch.object_key,
        Bucket: atch.bucketName,
        Key: atch.objectKey,
      });
      const getUrl =
        // atch.bucket_name === publicBucketName
        atch.bucketName === publicBucketName
          ? `https://${atch.bucketName}.s3.${
              s3client.config.region
            // }.amazonaws.com/${encodeURIComponent(atch.object_key)}`
            }.amazonaws.com/${encodeURIComponent(atch.objectKey)}`
          : await getSignedUrl(s3client, getObjectCommand, {
              // 1 hr
              expiresIn: 3600,
            });
      return { ...atch, getUrl };
    })
  );
  const attachment = await attachmentPromise;
  return detailEntity2Dto(achievement, student, activity, attachment);
};
