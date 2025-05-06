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
import { validateStudentIds, validateUserUniqueness } from './user-validation';

export const updateUser = async (
  req: Request<UsersPutRequestPathDto, {}, UsersPutRequestBodyDto, {}>,
  res: Response<UsersPut200ResponseDto>,
  next: NextFunction
) => {
  try {
    const userUpdateDto = req.body;
    const id = safeParseInt(req.params.id);

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
      Array.from(studentClassMap.entries()).map(([id, value]) => [id, value.student])
    );

    await validateUserUniqueness(userUpdateDto.email, studentMap, id);

    const userUpdate = updateDto2Entity(user[0].user, userUpdateDto);
    const updatedUser = await updateUserRepo(
      userUpdate,
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
