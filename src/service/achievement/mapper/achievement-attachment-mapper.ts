import { AchievementAttachmentDto } from '@api/achievement/achievement-schema';
import { AchievementAttachment } from '@prisma/client';

export const entity2Dto = ({
  file_name,
  object_key,
  getUrl,
}: AchievementAttachment & {
  getUrl: string;
}): AchievementAttachmentDto => {
  return {
    fileName: file_name,
    objectKey: object_key,
    getUrl,
  };
};
