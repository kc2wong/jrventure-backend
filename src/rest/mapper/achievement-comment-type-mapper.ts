import { ApprovalCommentTypeDto } from '../dto-schema';
import { ApprovalCommentTypeEntity } from '../../repo/entity/db_entity';

const statusDto2EntityMap: Record<
  ApprovalCommentTypeDto,
  ApprovalCommentTypeEntity
> = {
  Conversation: ApprovalCommentTypeEntity.Conversation,
  Rejection: ApprovalCommentTypeEntity.Rejection,
};

const statusEntity2DtoMap: Record<
  ApprovalCommentTypeEntity,
  ApprovalCommentTypeDto
> = Object.fromEntries(
  Object.entries(statusDto2EntityMap).map(([key, value]) => [value, key])
) as Record<ApprovalCommentTypeEntity, ApprovalCommentTypeDto>;

export const dto2Entity = (
  src: ApprovalCommentTypeDto
): ApprovalCommentTypeEntity => {
  return statusDto2EntityMap[src];
};

export const entity2Dto = (
  src: ApprovalCommentTypeEntity
): ApprovalCommentTypeDto => {
  return statusEntity2DtoMap[src];
};
