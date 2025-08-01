import { UserStatusDto } from '@api/user/user-schema';
import { UserStatusEnum } from '@db/drizzle-schema';

const statusDto2EntityMap: Record<UserStatusDto, UserStatusEnum> = {
  Active: UserStatusEnum.active,
  Inactive: UserStatusEnum.inactivate,
  Suspend: UserStatusEnum.suspend,
};

const statusEntity2DtoMap: Record<UserStatusEnum, UserStatusDto> =
  Object.fromEntries(
    Object.entries(statusDto2EntityMap).map(([key, value]) => [value, key])
  ) as Record<UserStatusEnum, UserStatusDto>;

export const dto2Entity = (src: UserStatusDto): UserStatusEnum => {
  return statusDto2EntityMap[src];
};

export const entity2Dto = (src: UserStatusEnum): UserStatusDto => {
  return statusEntity2DtoMap[src];
};
