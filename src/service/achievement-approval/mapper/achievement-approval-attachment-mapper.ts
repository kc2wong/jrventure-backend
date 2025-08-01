import { AchievementAttachmentDto } from '@api/achievement/achievement-schema';
import { AchievementApprovalAttachment } from '@repo/db';

export const entity2Dto = ({
  fileName,
  objectKey,
  getUrl,
}: AchievementApprovalAttachment & {
  getUrl: string;
}): AchievementAttachmentDto => {
  return {
    fileName,
    objectKey,
    getUrl,
  };
};
