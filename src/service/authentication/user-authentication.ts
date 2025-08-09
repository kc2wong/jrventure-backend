import {
  UserAuthentication200ResponseDto,
  UserAuthenticationRequestDto,
} from '@api/authentication/authentication-schema';
import { InvalidEmailOrPasswordErrorDto } from '@api/shared/error-schema';
import { UserStatus } from '@repo/db';
import { findUserRepo } from '@repo/user/find-user';
import { updateUserRepo } from '@repo/user/update-user';
import { entity2Dto as userEntity2Dto } from '@service/user/mapper/user-mapper';
import { currentDatetime } from '@util/datetime-util';
import { logger } from '@util/logging-util';

export const userAuthenticationService = async (
  requestDto: UserAuthenticationRequestDto
): Promise<UserAuthentication200ResponseDto> => {
  logger.info('userAuthenticationService() - start');

  const { email, password } = requestDto;
  const users = await findUserRepo({
    email,
  });

  if (users.length != 1) {
    throw new InvalidEmailOrPasswordErrorDto(email);
  }

  const u = users[0].user;
  const lastLoginDatetime = u.lastLoginDatetime;
  const studentWithClass = users[0].studentWithClass;

  if (u.status != UserStatus.active) {
    throw new InvalidEmailOrPasswordErrorDto(email);
  } else if (u.password !== password) {
    throw new InvalidEmailOrPasswordErrorDto(email);
  }

  // u.last_login_datetime = currentDatetime();
  u.lastLoginDatetime = currentDatetime();
  updateUserRepo(u);

  logger.info('userAuthenticationService() - end');
  return {
    user: userEntity2Dto(
      // { ...u, last_login_datetime: lastLoginDatetime },
      { ...u, lastLoginDatetime: lastLoginDatetime },
      studentWithClass.map(({ student, clazz }) => [student, clazz])
    ),
    status: 'Success',
  };
};
