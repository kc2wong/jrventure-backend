import { entity2Dto as datetimeEntity2Dto } from '@shared/mapper/datetime-mapper';
import { entity2Dto as commentTypeEntity2Dto } from './achievement-approval-comment-type-mapper';
import { AchievementApprovalReview } from '@prisma/client';
import { AchievementApprovalReviewDto } from '@api/achievement-approval/achievement-approval-schema';

export const entity2Dto = ({
  oid,
  comment_type,
  comment,
  created_at,
  created_by_user_oid,
  updated_at,
  updated_by_user_oid,
  version,
}: AchievementApprovalReview): AchievementApprovalReviewDto => {
  return {
    id: oid.toString(),
    commentType: commentTypeEntity2Dto(comment_type),
    comment,
    createdAt: datetimeEntity2Dto(created_at),
    createdBy: created_by_user_oid.toString(),
    updatedAt: datetimeEntity2Dto(updated_at),
    updatedBy: updated_by_user_oid.toString(),
    version,
  };
};
