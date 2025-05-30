import { Request, Response, NextFunction } from 'express';
import { jwtDecode } from 'jwt-decode';
import { safeParseInt } from '../../util/string-util';

const unauthenticatedPath = [
  '/user-authentications',
  '/google-authentications',
];

export const jwtHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const path = req.path;
  const jwt = req.headers.authorization;
  if (jwt) {
    const decodedJwt = jwtDecode(jwt) as any;
    const user = decodedJwt.user;
    const role = user.role;
    res.locals.authenticatedUser = {
      oid: safeParseInt(user.id)!,
      entitledStudentId: user.entitledStudentId as string[],
      entitledAllStudent: role === 'Teacher',
      withApprovalRight: user.withApprovalRight,
      userRole: user.role,
    };
    next();
  } else {
    if (!unauthenticatedPath.includes(path)) {
      res.status(501).json({
        code: 'NO_LOGIN_SESSION',
        message:
          'You must login to the system before performing this operation',
        parameter: [],
      });
    } else {
      next();
    }
  }
};
