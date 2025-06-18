import { AchievementAttachmentDto } from '@api/achievement/achievement-schema';
import { AchievementApprovalAttachment } from '@prisma/client';

export const entity2Dto = ({
  file_name,
  object_key,
  getUrl,
}: AchievementApprovalAttachment & {
  getUrl: string;
}): AchievementAttachmentDto => {
  return {
    fileName: file_name,
    objectKey: object_key,
    getUrl,
  };
};
