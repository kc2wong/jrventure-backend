import {
  ActivityDto,
  UpdateActivityDto,
} from '@api/activity/activity-schema';
import { NotFoundErrorDto } from '@api/shared/error-schema';
import { getActivityByOidRepo } from '@repo/activity/get-activity';
import { updateActivityRepo } from '@repo/activity/update-activity';
import {
  entity2Dto,
  updateDto2Entity,
} from '@service/activity/mapper/activity-mapper';
import { validateActivityCategory } from '@service/activity/shared/activity-validation';
import { AuthenticatedUser } from '@type/authentication';
import { currentDatetime } from '@util/datetime-util';
import { safeParseInt } from '@util/string-util';

export const updateActivityService = async (
  currentUser: AuthenticatedUser,
  id: string,
  updateActivityDto: UpdateActivityDto
): Promise<ActivityDto> => {
  const oid = safeParseInt(id);
  const existingActivity = oid ? await getActivityByOidRepo(oid) : undefined;
  if (existingActivity === undefined) {
    throw new NotFoundErrorDto('Activity', 'id', id);
  }

  const activityCategory = await validateActivityCategory(
    updateActivityDto.categoryCode
  );

  const activityUpdate = updateDto2Entity(
    updateActivityDto,
    existingActivity.activity,
    activityCategory
  );

  const now = currentDatetime();

  const newActivity = await updateActivityRepo({
    ...activityUpdate,
    // created_by_user_oid: currentUser.oid,
    // created_at: now,
    // updated_by_user_oid: currentUser.oid,
    // updated_at: now,
    createdByUserOid: currentUser.oid,
    createdAt: now,
    updatedByUserOid: currentUser.oid,
    updatedAt: now,
    version: 1,
  });

  return entity2Dto(newActivity, activityCategory);
};
