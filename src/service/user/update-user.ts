import { CreateUserDto, UpdateUserDto, UserDto } from '@api/user/user-schema';
import { entity2Dto, updateDto2Entity } from '@service/user/mapper/user-mapper';
import {
  validateStudentIds,
  validateStudentUserUniqueness,
  validateUserUniqueness,
} from '@service/user/shared/user-validation';
import { Class as ClassEntity, Student as StudentEntity } from '@prisma/client';
import { currentDatetime } from '@util/datetime-util';
import { NotFoundErrorDto } from '@api/shared/error-schema';
import { safeParseInt } from '@util/string-util';
import { findUserRepo } from '@repo/user/find-user';
import { updateUserRepo } from '@repo/user/update-user';
import { AuthenticatedUser } from '@type/authentication';

export const updateUserService = async (
  currentUser: AuthenticatedUser,
  id: string,
  userUpdateDto: UpdateUserDto
): Promise<UserDto> => {
  const oid = safeParseInt(id);
  const user = oid ? await findUserRepo({ id: [oid] }) : [];
  if (user.length !== 1) {
    throw new NotFoundErrorDto('User', 'id', id);
  }

  const studentClassMap = await validateStudentIds(userUpdateDto.entitledStudentId);
  const studentMap = new Map(
    Array.from(studentClassMap.entries()).map(([id, value]) => [
      id,
      value.student,
    ])
  );

  await validateUserUniqueness(userUpdateDto.email, oid);
  if (userUpdateDto.role === 'Student') {
    await validateStudentUserUniqueness(studentMap, oid);
  }

  const userUpdate = updateDto2Entity(user[0].user, userUpdateDto);
  const updatedUser = await updateUserRepo(
    {
      ...userUpdate,
      updated_at: currentDatetime(),
      updated_by_user_oid: currentUser.oid,
    },
    Array.from(studentMap.values())
  );

  const studentClassPairs: [StudentEntity, ClassEntity][] = Array.from(
    studentClassMap.values()
  ).map(({ student, clazz }) => [student, clazz]);
  return entity2Dto(updatedUser, studentClassPairs);
};
