import { Request, Response, NextFunction } from 'express';
import {
  UsersPut200ResponseDto,
  UsersPutRequestBodyDto,
  UsersPutRequestPathDto,
} from '../../dto-schema';
import { entity2Dto, updateDto2Entity } from '../../mapper/user-dto-mapper';
import {
  updateUser as updateUserRepo,
  findUser,
} from '../../../repo/user_repo';
import { safeParseInt } from '../../../util/string-util';
import { UserNotFoundErrorDto } from '../error-not-found';
import {
  validateStudentIds,
  validateStudentUserUniqueness,
  validateUserUniqueness,
} from './user-validation';
import { NotLoginErrorDto } from '../error-unauthorized';
import { currentDatetime } from '../../../util/datetime-util';

export const updateUser = async (
  req: Request<UsersPutRequestPathDto, {}, UsersPutRequestBodyDto, {}>,
  res: Response<UsersPut200ResponseDto>,
  next: NextFunction
) => {
  try {
    const userUpdateDto = req.body;
    const id = safeParseInt(req.params.id);

    const authenticatedUser = res.locals.authenticatedUser;
    if (!authenticatedUser) {
      throw new NotLoginErrorDto();
    }
    if (!id) {
      throw new UserNotFoundErrorDto(req.params.id);
    }

    const user = await findUser({ id: [id] });
    if (user.length !== 1) {
      throw new UserNotFoundErrorDto(req.params.id);
    }

    const studentClassMap = await validateStudentIds(
      userUpdateDto.entitledStudentId
    );
    const studentMap = new Map(
      Array.from(studentClassMap.entries()).map(([id, value]) => [
        id,
        value.student,
      ])
    );

    await validateUserUniqueness(userUpdateDto.email, id);
    if (userUpdateDto.role === 'Student') {
      await validateStudentUserUniqueness(studentMap);
    }

    const userUpdate = updateDto2Entity(user[0].user, userUpdateDto);
    const updatedUser = await updateUserRepo(
      {
        ...userUpdate,
        updated_at: currentDatetime(),
        updated_by_user_oid: authenticatedUser.oid,
      },
      Array.from(studentMap.values())
    );

    res.status(200).json(
      entity2Dto(
        updatedUser,
        Array.from(studentClassMap.values()).map(({ student, clazz }) => [
          student,
          clazz,
        ]) // student
      )
    );
  } catch (error) {
    next(error);
  }
};
