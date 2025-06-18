import { UserDto, UserRegistrationDto } from '@api/user/user-schema';
import { creationDto2Entity, entity2Dto } from '@service/user/mapper/user-mapper';
import {
  validateStudentIds,
  validateStudentUserUniqueness,
  validateUserUniqueness,
} from '@service/user/shared/user-validation';
import {
  UserRole,
  Class as ClassEntity,
  Student as StudentEntity,
} from '@prisma/client';
import { currentDatetime } from '@util/datetime-util';
import { createUserRepo } from '@repo/user/create-user';
import { OAuth2Client } from 'google-auth-library';
import { NotFoundErrorDto } from '@api/shared/error-schema';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const registerUserService = async (
  userRegistrationDto: UserRegistrationDto
): Promise<UserDto> => {
  const { accessToken, studentId, studentName } = userRegistrationDto;
  const tokenInfo = await googleClient.getTokenInfo(accessToken);
  const email = tokenInfo.email;
  const role = 'Student';
  const status = 'Active';
  // no approval right for student self registratiom
  const withApprovalRight = false;

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
    throw new NotFoundErrorDto(
      'Student',
      'studentId / studentName',
      `${studentId} / ${studentName}`
    );
  }

  const userCreationEntity = creationDto2Entity({
    email: email!,
    status: status,
    role: role,
    name: {
      English: matchedStudentEntry.student.name_en ?? undefined,
      TraditionalChinese: matchedStudentEntry.student.name_zh_hant ?? undefined,
      SimplifiedChinese: matchedStudentEntry.student.name_zh_hans ?? undefined,
    },
    entitledStudentId: [studentId],
    withApprovalRight,
  });

  const studentMap = new Map(
    Array.from(studentClassMap.entries()).map(([id, value]) => [
      id,
      value.student,
    ])
  );
  await validateUserUniqueness(userCreationEntity.email);
  if (userCreationEntity.role === UserRole.student) {
    await validateStudentUserUniqueness(studentMap);
  }

  const now = currentDatetime();
  const createUserOid = 1;

  const newUser = await createUserRepo(
    {
      ...userCreationEntity,
      password: '123456',
      password_expiry_datetime: now,
      last_login_datetime: null,
      created_by_user_oid: createUserOid,
      created_at: now,
      updated_by_user_oid: createUserOid,
      updated_at: now,
      version: 1,
    },
    Array.from(studentMap.values())
  );

  const studentClassPairs: [StudentEntity, ClassEntity][] = Array.from(
    studentClassMap.values()
  ).map(({ student, clazz }) => [student, clazz]);
  return entity2Dto(newUser, studentClassPairs);
};
