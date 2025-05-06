import { Request, Response, NextFunction } from 'express';
import {
  GoogleAuthenticationPost200ResponseDto,
  GoogleAuthenticationPostRequestDto,
} from '../../dto-schema';
import { UserStatus } from '@prisma/client';
import { InvalidEmailOrPasswordErrorDto } from '../error-validation';
import { findUser, updateUser } from '../../../repo/user_repo';
import { currentDatetime } from '../../../util/datetime-util';
import { entity2Dto as userEntity2Dto } from '../../mapper/user-dto-mapper';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleAuthenticationPost = async (
  req: Request<{}, {}, GoogleAuthenticationPostRequestDto, {}>,
  res: Response<GoogleAuthenticationPost200ResponseDto>,
  next: NextFunction
) => {
  try {
    const accessToken = req.body.accessToken;

    // Verify the idToken
    const tokenInfo = await client.getTokenInfo(accessToken);
    const email = tokenInfo.email;
    const users = await findUser({
      email,
    });

    if (users.length != 1) {
      throw new InvalidEmailOrPasswordErrorDto(email!);
    }

    const u = users[0].user;
    const lastLoginDatetime = u.last_login_datetime;
    const studentWithClass = users[0].studentWithClass;

    if (u.status != UserStatus.active) {
      throw new InvalidEmailOrPasswordErrorDto(email!);
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
  } catch (err) {
    console.error('Google sign-in error:', err);
    next(err);
  }
};
