import { CreateAchievementApprovalReviewDto } from '@api/achievement-approval/achievement-approval-schema';
import { NotFoundErrorDto } from '@api/shared/error-schema';
import { createAchievementApprovalReviewRepo } from '@repo/achievement-approval/create-achievement-approval-review';
import { getAchievementApprovalByOidRepo } from '@repo/achievement-approval/get-achievement-approval';
import { updateAchievementApprovalRepo } from '@repo/achievement-approval/update-achievement-approval';
import { AchievementApprovalReview, AchievementApprovalStatus } from '@repo/db';
import { dto2Entity as contentTypeDto2Entity } from '@service/achievement-approval/mapper/achievement-approval-comment-type-mapper';
import { AuthenticatedUser } from '@type/authentication';
import { safeParseInt } from '@util/string-util';

export const createAchievementApprovalReviewService = async (
  authenticatedUser: AuthenticatedUser,
  id: string,
  { comment, commentType }: CreateAchievementApprovalReviewDto
): Promise<AchievementApprovalReview> => {
  const now = new Date();
  const oid = safeParseInt(id);
  const result = oid ? await getAchievementApprovalByOidRepo(oid) : undefined;

  if (result === undefined) {
    throw new NotFoundErrorDto('Achievement Approval', 'id', id);
  }

  const { achievementApproval } = result;

  if (commentType === 'Rejection') {
    await updateAchievementApprovalRepo({
      ...achievementApproval,
      status: AchievementApprovalStatus.rejected,
    });
  }

  return await createAchievementApprovalReviewRepo({
    commentType: contentTypeDto2Entity(commentType),
    comment,
    createdByUserOid: authenticatedUser.oid,
    createdAt: now,
    updatedByUserOid: authenticatedUser.oid,
    updatedAt: now,
    version: 1,
    achievementApprovalOid: achievementApproval.oid,
  });
};
