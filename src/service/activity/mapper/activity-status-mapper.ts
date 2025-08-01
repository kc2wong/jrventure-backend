import { ActivityStatusDto } from '@api/activity/activity-schema';
import { ActivityStatus } from '@repo/db';

const statusDto2EntityMap: Record<ActivityStatusDto, ActivityStatus> = {
  Open: ActivityStatus.open,
  Closed: ActivityStatus.closed,
  Cancelled: ActivityStatus.cancelled,
  Scheduled: ActivityStatus.scheduled,
};

const statusEntity2DtoMap: Record<ActivityStatus, ActivityStatusDto> =
  Object.fromEntries(
    Object.entries(statusDto2EntityMap).map(([key, value]) => [value, key])
  ) as Record<ActivityStatus, ActivityStatusDto>;

export const dto2Entity = (src: ActivityStatusDto): ActivityStatus => {
  return statusDto2EntityMap[src];
};

export const entity2Dto = (src: ActivityStatus): ActivityStatusDto => {
  return statusEntity2DtoMap[src];
};
