import { UserStatus } from '@prisma/client';
import { UserStatusDto } from '../dto-schema';

const statusDto2EntityMap: Record<UserStatusDto, UserStatus> = {
  Active: UserStatus.active,
  Inactive: UserStatus.inactivate,
  Suspend: UserStatus.suspend,
};

const statusEntity2DtoMap: Record<UserStatus, UserStatusDto> =
  Object.fromEntries(
    Object.entries(statusDto2EntityMap).map(([key, value]) => [value, key])
  ) as Record<UserStatus, UserStatusDto>;

export const dto2Entity = (src: UserStatusDto): UserStatus => {
  return statusDto2EntityMap[src];
};

export const entity2Dto = (src: UserStatus): UserStatusDto => {
  return statusEntity2DtoMap[src];
};
