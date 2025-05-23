import { ActivityStatus } from '@prisma/client';
import { ActivityStatusDto } from '../dto-schema';

const statusDto2EntityMap: Record<ActivityStatusDto, ActivityStatus> = {
  Open: ActivityStatus.Open,
  Closed: ActivityStatus.Closed,
  Cancelled: ActivityStatus.Cancelled,
  Scheduled: ActivityStatus.Scheduled,
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
