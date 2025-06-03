import { replaceParameters } from '../../util/string-util';
import {
  BadRequestErrorDto,
  UnAuthorizedErrorDto,
  UserRoleDto,
} from '../dto-schema';

export class ZodValidationErrorDto extends BadRequestErrorDto {
  constructor(message: string, path: string, parameters: string[] = []) {
    super(message, message, [...parameters, path]);
  }
}

export class ValueTooLargeErrorDto extends BadRequestErrorDto {
  constructor(fileValue: string, filedName: string) {
    super(
      replaceParameters('Value for [${1}] cannot be greater than [{2}]', [
        filedName,
        fileValue,
      ]),
      'TOO_LARGE_VALUE',
      [fileValue, filedName]
    );
  }
}

export class InvalidValueErrorDto extends BadRequestErrorDto {
  constructor(fileValue: string, filedName: string) {
    super(
      replaceParameters('Invalid value [${1}] for field [{2}]', [
        fileValue,
        filedName,
      ]),
      'INVALID_VALUE',
      [fileValue, filedName]
    );
  }
}

export class NotFoundErrorDto extends BadRequestErrorDto {
  constructor(objectName: string, fieldName: string, fieldValue: string) {
    super(
      replaceParameters('Object ${1} with [${2}] = [${3}] is not found', [
        objectName,
        fieldName,
        fieldValue,
      ]),
      'NOT_FOUND',
      [objectName, fieldName, fieldValue]
    );
  }
}

// export class InvalidClassErrorDto extends BadRequestErrorDto {
//   constructor(classId: string) {
//     super(
//       replaceParameters('Invalid class id {1}', [classId]),
//       'INVALID_CLASS',
//       [classId]
//     );
//   }
// }

// export class ClassNotFoundErrorDto extends BadRequestErrorDto {
//   constructor(classId: string) {
//     super(
//       replaceParameters('Class {1} is not found', [classId]),
//       'CLASS_NOT_FOUND',
//       [classId]
//     );
//   }
// }

export class UserRegistrationNotPendingErrorDto extends BadRequestErrorDto {
  constructor(classId: string, studentNumber: number) {
    super(
      replaceParameters(
        'Registration for student in class {1} with number {2} is not pending for approval',
        [classId, studentNumber]
      ),
      'USER_REGISTRATION_NOT_PENDING',
      [studentNumber.toString(), classId]
    );
  }
}

export class UserRegistrationExistsErrorDto extends BadRequestErrorDto {
  constructor(classId: string, studentNumber: number) {
    super(
      replaceParameters(
        'Registration for student in class {1} with number {2} is pending for approval',
        [classId, studentNumber]
      ),
      'USER_REGISTRATION_EXISTS',
      [studentNumber.toString(), classId]
    );
  }
}

// export class StudentNotFoundByIdErrorDto extends BadRequestErrorDto {
//   constructor(studentId: string) {
//     super(
//       replaceParameters('Student with id {1} is not found', [studentId]),
//       'STUDENT_NOT_FOUND_BY_ID',
//       [studentId]
//     );
//   }
// }

export class UserWithEmailExistsErrorDto extends BadRequestErrorDto {
  constructor(email: string) {
    super(
      replaceParameters('User with email {1} already exists', [email]),
      'USER_WITH_EMAIL_EXISTS',
      [email]
    );
  }
}

export class StudentIdNotForRoleErrorDto extends BadRequestErrorDto {
  constructor(role: UserRoleDto) {
    super(
      replaceParameters('Cannot specify student Id for role {1}', [role]),
      'STUDENT_ID_NOT_APPLICABLE_FOR_ROLE',
      [role]
    );
  }
}

export class UserForStudentExistsErrorDto extends BadRequestErrorDto {
  constructor(studentId: string) {
    super(
      replaceParameters('User for student {1} already exists', [studentId]),
      'USER_FOR_STUDENT_EXISTS',
      [studentId]
    );
  }
}

export class InvalidFieldErrorDto extends BadRequestErrorDto {
  constructor(classId: string, studentNumber: number) {
    super(
      replaceParameters(
        'Registration for student in class {1} with number {2} is pending for approval',
        [classId, studentNumber]
      ),
      'USER_REGISTRATION_EXISTS',
      [studentNumber.toString(), classId]
    );
  }
}

export class AchievementExistsErrorDto extends BadRequestErrorDto {
  constructor(studentId: string, activityId: string) {
    super(
      replaceParameters(
        'Achievement for student {1} and activity {2} already exists',
        [studentId, activityId]
      ),
      'ACHIEVEMENT_EXISTS',
      [studentId, activityId]
    );
  }
}

export class DataEntitlementErrorDto extends BadRequestErrorDto {
  constructor(objectName: string, fieldName: string, fieldValue: string) {
    super(
      replaceParameters('Cannot operate object {1} with [{2}] = [{3}]', [
        objectName,
        fieldName,
        fieldValue,
      ]),
      'UNAUTHORIZED_DATA_ENTITLEMENT',
      [objectName, fieldName, fieldValue]
    );
  }
}

export class InvalidEmailOrPasswordErrorDto extends UnAuthorizedErrorDto {
  constructor(email: string) {
    super(
      replaceParameters(
        'User with email {1} is not found or password is invalid',
        [email]
      ),
      'INVALID_EMAIL_PASSWORD',
      [email]
    );
  }
}
