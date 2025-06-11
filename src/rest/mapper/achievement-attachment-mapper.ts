import { AchievementAttachmentDto } from '../dto-schema';
import { AchievementAttachmentEntity } from '../../repo/entity/db_entity';

export const entity2Dto = ({
  file_name,
  object_key,
  getUrl,
}: AchievementAttachmentEntity & {
  getUrl: string;
}): AchievementAttachmentDto => {
  return {
    fileName: file_name,
    objectKey: object_key,
    getUrl,
  };
};
