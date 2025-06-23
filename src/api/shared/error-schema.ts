import { components } from '@openapi/schema';
import { replaceParameters } from '@util/string-util';

export type ErrorDto = components['schemas']['Error'];

export interface BaseErrorDto {
  message: string;
  code: string;
  parameters?: string[];
}

export class BadRequestErrorDto extends Error {
  code: string;
  parameters?: string[];

  constructor(message: string, code: string, parameters: string[] = []) {
    super(message);
    this.code = code;
    this.parameters = parameters;
    this.name = 'BadRequestErrorDto';
  }
}

export class UnAuthorizedErrorDto extends Error {
  code: string;
  parameters?: string[];

  constructor(message: string, code: string, parameters: string[] = []) {
    super(message);
    this.code = code;
    this.parameters = parameters;
    this.name = 'UnAuthorizedErrorDto';
  }
}

export class NotFoundErrorDto extends BadRequestErrorDto {
  constructor(objectName: string, fieldName: string, fieldValue: string) {
    super(
      replaceParameters('Object {1} with [{2}] = [{3}] is not found', [
        objectName,
        fieldName,
        fieldValue,
      ]),
      'NOT_FOUND',
      [objectName, fieldName, fieldValue]
    );
  }
}

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
  constructor(role: string) {
    super(
      replaceParameters('Cannot specify student Id for role {1}', [role]),
      'STUDENT_ID_NOT_APPLICABLE_FOR_ROLE',
      [role]
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

export class UserForStudentExistsErrorDto extends BadRequestErrorDto {
  constructor(studentId: string) {
    super(
      replaceParameters('User for student {1} already exists', [studentId]),
      'USER_FOR_STUDENT_EXISTS',
      [studentId]
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
