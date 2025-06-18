import { entity2Dto } from '@service/activity/mapper/activity-mapper';
import { safeParseInt } from '@util/string-util';
import { ActivityDto } from '@api/activity/activity-schema';
import { getActivityByOidRepo } from '@repo/activity/get-activity';

export const getActivityByIdService = async (
  id: string
): Promise<ActivityDto | undefined> => {
  const oid = safeParseInt(id);

  const result = oid ? await getActivityByOidRepo(oid) : undefined;
  return result ? entity2Dto(result.activity, result.category) : undefined;
};
