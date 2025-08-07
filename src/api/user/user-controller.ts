import { NextFunction, Request, Response } from 'express';

import {
  CreateUser201ResponseDto,
  CreateUserRequestDto,
  FindUser200ResponseDto,
  FindUserQueryDto,
  UpdateUser201ResponseDto,
  UpdateUserPathDto,
  UpdateUserRequestDto,
} from '@api/user/user-schema';
import { createUserService } from '@service/user/create-user';
import { findUserService } from '@service/user/find-user';
import { registerUserService } from '@service/user/register-user';
import { updateUserService } from '@service/user/update-user';

export const findUserApi = async (
  req: Request<{}, {}, {}, FindUserQueryDto>,
  res: Response<FindUser200ResponseDto>,
  next: NextFunction
) => {
  try {
    const users = await findUserService(req.query);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const createUserApi = async (
  req: Request<{}, {}, CreateUserRequestDto>,
  res: Response<CreateUser201ResponseDto>,
  next: NextFunction
) => {
  const authenticatedUser = res.locals.authenticatedUser;
  const userCreationDto = req.body;
  const isSignUpWithGoogle = 'accessToken' in userCreationDto;
  try {
    const newUser = isSignUpWithGoogle
      ? await registerUserService(userCreationDto)
      : await createUserService(authenticatedUser!, {
          ...userCreationDto,
          name: userCreationDto.name as Record<string, string | undefined>,
        });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const updateUserApi = async (
  req: Request<UpdateUserPathDto, {}, UpdateUserRequestDto>,
  res: Response<UpdateUser201ResponseDto>,
  next: NextFunction
) => {
  const authenticatedUser = res.locals.authenticatedUser;
  const updateUserDto = req.body;
  try {
    const updatedUser = await updateUserService(
      authenticatedUser!,
      req.params.id,
      {
        ...updateUserDto,
        entitledStudentId: updateUserDto.entitledStudentId,
        name: updateUserDto.name as Record<string, string | undefined>,
      }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
