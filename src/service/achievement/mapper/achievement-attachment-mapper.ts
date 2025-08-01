import { AchievementAttachmentDto } from '@api/achievement/achievement-schema';
import { AchievementAttachment } from '@repo/db';

export const entity2Dto = ({
  fileName,
  objectKey,
  getUrl,
}: AchievementAttachment & {
  getUrl: string;
}): AchievementAttachmentDto => {
  return {
    fileName,
    objectKey,
    getUrl,
  };
};
