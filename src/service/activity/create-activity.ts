import { ActivityDto, CreateActivityDto } from '@api/activity/activity-schema';
import { createActivityRepo } from '@repo/activity/create-activity';
import {
  creationDto2Entity,
  entity2Dto,
} from '@service/activity/mapper/activity-mapper';
import { validateActivityCategory } from '@service/activity/shared/activity-validation';
import { AuthenticatedUser } from '@type/authentication';
import { currentDatetime } from '@util/datetime-util';

export const createActivityService = async (
  currentUser: AuthenticatedUser,
  activityCreationDto: CreateActivityDto
): Promise<ActivityDto> => {
  const activityCategory = await validateActivityCategory(
    activityCreationDto.categoryCode
  );
  
  const activityCreation = creationDto2Entity(
    activityCreationDto,
    activityCategory
  );

  const now = currentDatetime();

  // const newActivity = await createActivityRepo({
  //   ...activityCreation,
  //   created_by_user_oid: currentUser.oid,
  //   created_at: now,
  //   updated_by_user_oid: currentUser.oid,
  //   updated_at: now,
  //   version: 1,
  // });

  const newActivity = await createActivityRepo({
    ...activityCreation,
    createdByUserOid: currentUser.oid,
    createdAt: now,
    updatedByUserOid: currentUser.oid,
    updatedAt: now,
    version: 1,
  });

  return entity2Dto(newActivity, activityCategory);
};
