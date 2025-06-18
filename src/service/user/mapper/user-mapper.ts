import {
  User as UserEntity,
  Student as StudentEntity,
  Class as ClassEntity,
} from '@prisma/client';
import { CreateUserDto, UpdateUserDto, UserDto } from '@api/user/user-schema';
import {
  entity2Dto as roleEntity2Dto,
  dto2Entity as roleDto2Entity,
} from '@service/user/mapper/user-role-mapper';
import {
  entity2Dto as statusEntity2Dto,
  dto2Entity as statusDto2Entity,
} from '@service/user/mapper/user-status-mapper';
import { entity2Dto as datetimeEntity2Dto } from '@shared/mapper/datetime-mapper';
import { removeNilValues } from '@util/string-util';
import { CreateUserEntity } from '@repo/user/user-entity';

export const creationDto2Entity = ({
  email,
  name,
  role,
  status,
  withApprovalRight,
}: CreateUserDto): CreateUserEntity => {
  return {
    email,
    name_en: name.English ? (name.English as string) : null,
    name_zh_hant: name.TraditionalChinese
      ? (name.TraditionalChinese as string)
      : null,
    name_zh_hans: name.SimplifiedChinese
      ? (name.SimplifiedChinese as string)
      : null,
    role: roleDto2Entity(role),
    status: statusDto2Entity(status),
    last_login_datetime: null,
    with_approval_right: withApprovalRight,
  };
};

export const updateDto2Entity = (
  user: UserEntity,
  { email, name, role, status, version }: UpdateUserDto
): UserEntity => {
  return {
    ...user,
    email,
    name_en: name.English ? (name.English as string) : null,
    name_zh_hant: name.TraditionalChinese
      ? (name.TraditionalChinese as string)
      : null,
    name_zh_hans: name.SimplifiedChinese
      ? (name.SimplifiedChinese as string)
      : null,
    role: roleDto2Entity(role),
    status: statusDto2Entity(status),
    version,
  };
};

export const entity2Dto = (
  src: UserEntity,
  entitledSutdent: [StudentEntity, ClassEntity][]
): UserDto => {
  return {
    id: src.oid.toString(),
    name: removeNilValues({
      English: src.name_en,
      TraditionalChinese: src.name_zh_hant,
      SimplifiedChinese: src.name_zh_hans,
    }),
    email: src.email,
    entitledStudentId: entitledSutdent
      ? entitledSutdent.map((item) => item[0].id)
      : [],
    role: roleEntity2Dto(src.role),
    status: statusEntity2Dto(src.status),
    lastLoginDatetime: datetimeEntity2Dto(src.last_login_datetime),
    passwordExpiryDatetime: datetimeEntity2Dto(src.password_expiry_datetime),
    withApprovalRight: src.with_approval_right,
    createdBy: src.created_by_user_oid.toString(),
    createdAt: datetimeEntity2Dto(src.created_at)!,
    updatedBy: src.updated_by_user_oid.toString(),
    updatedAt: datetimeEntity2Dto(src.updated_at)!,
    version: src.version,
  };
};
