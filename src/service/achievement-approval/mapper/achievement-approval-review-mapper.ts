import { entity2Dto as datetimeEntity2Dto } from '@shared/mapper/datetime-mapper';
import { entity2Dto as commentTypeEntity2Dto } from './achievement-approval-comment-type-mapper';
import { AchievementApprovalReviewDto } from '@api/achievement-approval/achievement-approval-schema';
import { AchievementApprovalReview } from '@repo/db';

export const entity2Dto = ({
  oid,
  commentType,
  comment,
  createdAt,
  createdByUserOid,
  updatedAt,
  updatedByUserOid,
  version,
}: AchievementApprovalReview): AchievementApprovalReviewDto => {
  return {
    id: oid.toString(),
    commentType: commentTypeEntity2Dto(commentType),
    comment,
    createdAt: datetimeEntity2Dto(createdAt),
    createdBy: createdByUserOid.toString(),
    updatedAt: datetimeEntity2Dto(updatedAt),
    updatedBy: updatedByUserOid.toString(),
    version,
  };
};
