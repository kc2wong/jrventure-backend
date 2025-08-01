import { UserRoleDto } from '@api/user/user-schema';
import { UserRole } from '@repo/db';
const roleDto2EntityMap: Record<UserRoleDto, UserRole> = {
  Student: UserRole.student,
  Parent: UserRole.parent,
  Teacher: UserRole.teacher,
  Admin: UserRole.admin,
  Alumni: UserRole.alumni,
};

const roleEntity2DtoMap: Record<UserRole, UserRoleDto> = Object.fromEntries(
  Object.entries(roleDto2EntityMap).map(([key, value]) => [value, key])
) as Record<UserRole, UserRoleDto>;

export const dto2Entity = (src: UserRoleDto): UserRole => {
  return roleDto2EntityMap[src];
};

export const entity2Dto = (src: UserRole): UserRoleDto => {
  return roleEntity2DtoMap[src];
};
