import { Request, Response, NextFunction } from 'express';
import { UsersPost201ResponseDto, UsersPostRequestDto } from '../../dto-schema';
import { creationDto2Entity, entity2Dto } from '../../mapper/user-dto-mapper';
import { createUser as createUserRepo } from '../../../repo/user_repo';
import { currentDatetime } from '../../../util/datetime-util';
import {
  validateField,
  validateStudentIds,
  validateUserUniqueness,
} from './user-validation';
import { OAuth2Client } from 'google-auth-library';
import {
  ClassEntity,
  StudentEntity,
  UserCreationEntity,
} from '../../../repo/entity/db_entity';
import { StudentNotFoundErrorDto } from '../error-not-found';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const createUser = async (
  req: Request<{}, {}, UsersPostRequestDto>,
  res: Response<UsersPost201ResponseDto>,
  next: NextFunction
) => {
  try {
    const userCreationDto = req.body;
    const isSignUpWithGoogle = 'accessToken' in userCreationDto;

    let userCreation: UserCreationEntity;
    let studentIds: string[];

    if (isSignUpWithGoogle) {
      const { accessToken, studentId, studentName } = userCreationDto;
      const tokenInfo = await googleClient.getTokenInfo(accessToken);
      const email = tokenInfo.email;

      const studentClassMap = await validateStudentIds([studentId]);

      const matchedStudentEntry = Array.from(studentClassMap.values()).find(
        ({ student }) =>
          (student.name_en &&
            student.name_en.toLowerCase().includes(studentName.toLowerCase()) &&
            studentName.length >= student.name_en.length / 2) ||
          (student.name_zh_hant &&
            student.name_zh_hant
              .toLowerCase()
              .includes(studentName.toLowerCase()) &&
            studentName.length >= student.name_zh_hant.length / 2) ||
          (student.name_zh_hans &&
            student.name_zh_hans
              .toLowerCase()
              .includes(studentName.toLowerCase()) &&
            studentName.length >= student.name_zh_hans.length / 2)
      );

      if (!matchedStudentEntry) {
        throw new StudentNotFoundErrorDto(studentId, studentName);
      }

      userCreation = creationDto2Entity({
        email: email!,
        status: 'Active',
        role: 'Student',
        name: {
          English: matchedStudentEntry.student.name_en,
          TraditionalChinese: matchedStudentEntry.student.name_zh_hant,
          SimplifiedChinese: matchedStudentEntry.student.name_zh_hans,
        },
        entitledStudentId: [studentId],
      });

      studentIds = [studentId];
    } else {
      validateField(userCreationDto);
      userCreation = creationDto2Entity(userCreationDto);
      studentIds = userCreationDto.entitledStudentId;
    }

    const studentClassMap = await validateStudentIds(studentIds);
    const studentMap = new Map(
      Array.from(studentClassMap.entries()).map(([id, value]) => [
        id,
        value.student,
      ])
    );

    await validateUserUniqueness(userCreation.email!, studentMap);

    const now = currentDatetime();

    const newUser = await createUserRepo(
      {
        ...userCreation,
        password: '123456',
        password_expiry_datetime: now,
        last_login_datetime: null,
        created_by_user_id: -1,
        created_at: now,
        updated_by_user_id: -1,
        updated_at: now,
        version: 1,
      },
      Array.from(studentMap.values())
    );

    const studentClassPairs: [StudentEntity, ClassEntity][] = Array.from(
      studentClassMap.values()
    ).map(({ student, clazz }) => [student, clazz]);
    res.status(201).json(entity2Dto(newUser, studentClassPairs));
  } catch (error) {
    console.error('createUser error:', error);
    next(error);
  }
};
