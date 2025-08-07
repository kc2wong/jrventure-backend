import { NextFunction, Request, Response } from 'express';

import {
  GoogleAuthentication200ResponseDto,
  GoogleAuthenticationRequestDto,
  UserAuthentication200ResponseDto,
  UserAuthenticationRequestDto,
} from '@api/authentication/authentication-schema';
import { googleAuthenticationService } from '@service/authentication/google-authentication';
import { userAuthenticationService } from '@service/authentication/user-authentication';

export const userAuthenticationApi = async (
  req: Request<{}, {}, UserAuthenticationRequestDto>,
  res: Response<UserAuthentication200ResponseDto>,
  next: NextFunction
) => {
  try {
    const result = await userAuthenticationService(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const googleAuthenticationApi = async (
  req: Request<{}, {}, GoogleAuthenticationRequestDto>,
  res: Response<GoogleAuthentication200ResponseDto>,
  next: NextFunction
) => {
  try {
    const result = await googleAuthenticationService(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
