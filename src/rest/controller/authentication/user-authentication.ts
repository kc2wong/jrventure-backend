import { Request, Response, NextFunction } from 'express';
import {
  UserAuthenticationPost200ResponseDto,
  UserAuthenticationPostRequestDto,
} from '../../dto-schema';
import { UserStatus } from '@prisma/client';
import { InvalidEmailOrPasswordErrorDto } from '../error-validation';
import { findUser, updateUser } from '../../../repo/user_repo';
import { currentDatetime } from '../../../util/datetime-util';
import { entity2Dto as userEntity2Dto } from '../../mapper/user-dto-mapper';

export const userAuthenticationPost = async (
  req: Request<{}, {}, UserAuthenticationPostRequestDto, {}>,
  res: Response<UserAuthenticationPost200ResponseDto>,
  next: NextFunction
) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const users = await findUser({
      email,
    });

    if (users.length != 1) {
      throw new InvalidEmailOrPasswordErrorDto(email);
    }

    const u = users[0].user;
    const lastLoginDatetime = u.last_login_datetime;
    const studentWithClass = users[0].studentWithClass;

    if (u.status != UserStatus.active) {
      throw new InvalidEmailOrPasswordErrorDto(email);
    } else if (u.password !== password) {
      throw new InvalidEmailOrPasswordErrorDto(email);
    }

    u.last_login_datetime = currentDatetime();
    updateUser(u);

    res.status(200).json({
      user: userEntity2Dto(
        { ...u, last_login_datetime: lastLoginDatetime },
        studentWithClass.map(({ student, clazz }) => [student, clazz])
      ),
      status: 'Success',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
