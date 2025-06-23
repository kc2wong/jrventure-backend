import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { publicBucketName, s3client } from '@util/s3-util';
import { approvalDetailEntity2Dto } from '@service/achievement-approval/mapper/achievement-approval-mapper';
import { AchievementApprovalDetailDto } from '@api/achievement-approval/achievement-approval-schema';
import { getAchievementApprovalByOidRepo } from '@repo/achievement-approval/get-achievement-approval';
import { safeParseInt } from '@util/string-util';

export const getAchievementApprovalByIdService = async (
  id: string
): Promise<AchievementApprovalDetailDto | undefined> => {
  const oid = safeParseInt(id);
  const result = oid ? await getAchievementApprovalByOidRepo(oid) : undefined;

  if (result) {
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
    return approvalDetailEntity2Dto(
      achievementApproval,
      student,
      activity,
      attachment,
      review
    );
  }
  else {
    return undefined;
  }
};
