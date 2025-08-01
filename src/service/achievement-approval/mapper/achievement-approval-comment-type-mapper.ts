import { AchievementApprovalCommentType } from '@api/achievement-approval/achievement-approval-schema';
import { ApprovalCommentType } from '@repo/db';

const statusDto2EntityMap: Record<
  AchievementApprovalCommentType,
  ApprovalCommentType
> = {
  Conversation: ApprovalCommentType.conversation,
  Rejection: ApprovalCommentType.rejection,
};

const statusEntity2DtoMap: Record<
  ApprovalCommentType,
  AchievementApprovalCommentType
> = Object.fromEntries(
  Object.entries(statusDto2EntityMap).map(([key, value]) => [value, key])
) as Record<ApprovalCommentType, AchievementApprovalCommentType>;

export const dto2Entity = (
  src: AchievementApprovalCommentType
): ApprovalCommentType => {
  return statusDto2EntityMap[src];
};

export const entity2Dto = (
  src: ApprovalCommentType
): AchievementApprovalCommentType => {
  return statusEntity2DtoMap[src];
};
