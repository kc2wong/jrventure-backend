import { currentDatetime } from '@util/datetime-util';
import {
  GoogleAuthentication200ResponseDto,
  GoogleAuthenticationRequestDto,
} from '@api/authentication/authentication-schema';
import { findUserRepo } from '@repo/user/find-user';
import { InvalidEmailOrPasswordErrorDto } from '@api/shared/error-schema';
import { updateUserRepo } from '@repo/user/update-user';
import { entity2Dto as userEntity2Dto } from '@service/user/mapper/user-mapper';
import { OAuth2Client } from 'google-auth-library';
import { UserStatus } from '@repo/db';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);

const GOOGLE_IOS_CLIENT_ID = process.env.GOOGLE_IOS_CLIENT_ID;
const iosOauth2Client = new OAuth2Client(GOOGLE_IOS_CLIENT_ID);

const GOOGLE_ANDROID_CLIENT_ID = process.env.GOOGLE_ANDROID_CLIENT_ID;
const androidOauth2Client = new OAuth2Client(GOOGLE_ANDROID_CLIENT_ID);

export const googleAuthenticationService = async (
  requestDto: GoogleAuthenticationRequestDto
): Promise<GoogleAuthentication200ResponseDto> => {
  const { type, token } = requestDto;
  console.log('googleAuthenticationService called, requestDto = ', requestDto);

  const email =
    type === 'Web'
      ? await verifyWebIdToken(token)
      : type === 'iOS'
      ? await verifyIosIdToken(token)
      : await verifyAndroidIdToken(token);
  const users = await findUserRepo({
    email,
  });

  console.log('googleAuthenticationService, users = ', email);
  if (users.length != 1) {
    throw new InvalidEmailOrPasswordErrorDto(email!);
  }

  const u = users[0].user;
  // const lastLoginDatetime = u.last_login_datetime;
  const lastLoginDatetime = u.lastLoginDatetime;
  const studentWithClass = users[0].studentWithClass;

  if (u.status != UserStatus.active) {
    throw new InvalidEmailOrPasswordErrorDto(email!);
  }

  // u.last_login_datetime = currentDatetime();
  u.lastLoginDatetime = currentDatetime();
  updateUserRepo(u);

  return {
    user: userEntity2Dto(
      // { ...u, last_login_datetime: lastLoginDatetime },
      { ...u, lastLoginDatetime: lastLoginDatetime },
      studentWithClass.map(({ student, clazz }) => [student, clazz])
    ),
    status: 'Success',
  };
};

const verifyWebIdToken = async (
  accessToken: string
): Promise<string | undefined> => {
  const tokenInfo = await oauth2Client.getTokenInfo(accessToken);
  return tokenInfo.email;
};

const verifyIosIdToken = async (
  idToken: string
): Promise<string | undefined> => {
  const ticket = await iosOauth2Client.verifyIdToken({
    idToken,
    audience: GOOGLE_IOS_CLIENT_ID,
  });
  return ticket.getPayload()?.email;
};

const verifyAndroidIdToken = async (
  idToken: string
): Promise<string | undefined> => {
  const ticket = await androidOauth2Client.verifyIdToken({
    idToken,
    audience: GOOGLE_ANDROID_CLIENT_ID,
  });
  return ticket.getPayload()?.email;
};
