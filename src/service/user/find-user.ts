import { FindUserQueryDto, UserDto } from '@api/user/user-schema';
import { findUserRepo } from '@repo/user/find-user';
import { entity2Dto } from '@service/user/mapper/user-mapper';
import { dto2Entity as roleDto2Entity } from '@service/user/mapper/user-role-mapper';
import { dto2Entity as statusDto2Entity } from '@service/user/mapper/user-status-mapper';
import { safeParseInt } from '@util/string-util';

export const findUserService = async (query: FindUserQueryDto): Promise<UserDto[]> => {
  const { id, email, name, status, role, studentId } = query;

  const result = await findUserRepo({
    id: id ? id.map((i) => safeParseInt(i) ?? -1) : undefined,
    email,
    name,
    status: status ? status.map((s) => statusDto2Entity(s)) : undefined,
    role: role ? role.map((r) => roleDto2Entity(r)) : undefined,
    studentId,
  });
  return result.map((item) =>
    entity2Dto(
      item.user,
      item.studentWithClass.map(({ student, clazz }) => [student, clazz])
    )
  );
};
