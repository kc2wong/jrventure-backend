import { Request, Response, NextFunction } from 'express';
import { jwtDecode } from 'jwt-decode';
import { safeParseInt } from '../../util/string-util';

export const jwtHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const jwt = req.headers.authorization;
  if (jwt) {
    const decodedJwt = jwtDecode(jwt) as any;
    const user = decodedJwt.user;
    res.locals.authenticatedUser = { oid: safeParseInt(user.id)! };
  }
  next();
};
