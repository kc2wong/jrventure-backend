import {
  User as UserEntity,
  Class as ClassEntity,
  Student as StudentEntity,
  CreateUserEntity,
} from '@repo/db';
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

export const creationDto2Entity = ({
  email,
  name,
  role,
  status,
  withApprovalRight,
}: CreateUserDto): CreateUserEntity => {
  return {
    email,
    nameEn: name.English ? (name.English as string) : null,
    nameZhHant: name.TraditionalChinese
      ? (name.TraditionalChinese as string)
      : null,
    nameZhHans: name.SimplifiedChinese
      ? (name.SimplifiedChinese as string)
      : null,
    role: roleDto2Entity(role),
    status: statusDto2Entity(status),
    lastLoginDatetime: null,
    withApprovalRight,
  };
};

export const updateDto2Entity = (
  user: UserEntity,
  { email, name, role, status, version }: UpdateUserDto
): UserEntity => {
  return {
    ...user,
    email,
    nameEn: name.English ? (name.English as string) : null,
    nameZhHant: name.TraditionalChinese
      ? (name.TraditionalChinese as string)
      : null,
    nameZhHans: name.SimplifiedChinese
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
  const {
    oid,
    email,
    nameEn,
    nameZhHant,
    nameZhHans,
    role,
    status,
    withApprovalRight,
    lastLoginDatetime,
    passwordExpiryDatetime,
    createdByUserOid,
    createdAt,
    updatedByUserOid,
    updatedAt,
  } = src;
  return {
    id: oid.toString(),
    name: removeNilValues({
      English: nameEn,
      TraditionalChinese: nameZhHant,
      SimplifiedChinese: nameZhHans,
    }),
    email: email,
    entitledStudentId: entitledSutdent
      ? entitledSutdent.map((item) => item[0].id)
      : [],
    role: roleEntity2Dto(role),
    status: statusEntity2Dto(status),
    lastLoginDatetime: datetimeEntity2Dto(lastLoginDatetime),
    passwordExpiryDatetime: datetimeEntity2Dto(passwordExpiryDatetime),
    withApprovalRight,
    createdBy: createdByUserOid.toString(),
    createdAt: datetimeEntity2Dto(createdAt)!,
    updatedBy: updatedByUserOid.toString(),
    updatedAt: datetimeEntity2Dto(updatedAt)!,
    version: src.version,
  };
};
