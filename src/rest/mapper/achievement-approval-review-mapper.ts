import { AchievementApprovalReviewDto } from '../dto-schema';
import { AchievementApprovalReviewEntity } from '../../repo/entity/db_entity';
import { entity2Dto as datetimeDto2Entity } from './datetime-dto-mapper';

export const entity2Dto = ({
  oid,
  comment,
  created_at,
  created_by_user_oid,
  updated_at,
  updated_by_user_oid,
  version,
}: AchievementApprovalReviewEntity): AchievementApprovalReviewDto => {
  return {
    id: oid.toString(),
    comment,
    createdAt: datetimeDto2Entity(created_at),
    createdBy: created_by_user_oid.toString(),
    updatedAt: datetimeDto2Entity(updated_at),
    updatedBy: updated_by_user_oid.toString(),
    version,
  };
};
