import {
  CreateUserDto,
  UserDto,
} from '@api/user/user-schema';
import { creationDto2Entity, entity2Dto } from '@service/user/mapper/user-mapper';
import {
  validateStudentIds,
  validateStudentUserUniqueness,
  validateUserUniqueness,
} from '@service/user/shared/user-validation';
import {
  UserRole,
  Class as ClassEntity,
  Student as StudentEntity,
} from '@prisma/client';
import { currentDatetime } from '@util/datetime-util';
import { createUserRepo } from '@repo/user/create-user';
import { AuthenticatedUser } from '@type/authentication';

export const createUserService = async (
  currentUser: AuthenticatedUser,
  userCreationDto: CreateUserDto
): Promise<UserDto> => {
  const userCreationEntity = creationDto2Entity(userCreationDto);
  const studentIds = userCreationDto.entitledStudentId;

  const studentClassMap = await validateStudentIds(studentIds);
  const studentMap = new Map(
    Array.from(studentClassMap.entries()).map(([id, value]) => [
      id,
      value.student,
    ])
  );

  await validateUserUniqueness(userCreationEntity.email);
  if (userCreationEntity.role === UserRole.student) {
    await validateStudentUserUniqueness(studentMap);
  }

  const now = currentDatetime();
  const createUserOid = currentUser.oid;

  const newUser = await createUserRepo(
    {
      ...userCreationEntity,
      password: '123456',
      password_expiry_datetime: now,
      last_login_datetime: null,
      created_by_user_oid: createUserOid,
      created_at: now,
      updated_by_user_oid: createUserOid,
      updated_at: now,
      version: 1,
    },
    Array.from(studentMap.values())
  );

  const studentClassPairs: [StudentEntity, ClassEntity][] = Array.from(
    studentClassMap.values()
  ).map(({ student, clazz }) => [student, clazz]);
  return entity2Dto(newUser, studentClassPairs);
};
