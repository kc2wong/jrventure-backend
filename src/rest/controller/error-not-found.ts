import { replaceParameters } from '../../util/string-util';

export class NotFoundErrorDto extends Error {
  code: string;
  parameters?: string[];

  constructor(message: string, code: string, parameters: string[] = []) {
    super(message);
    this.name = 'NotFoundErrorDto';
    this.code = code;
    this.parameters = parameters;
  }
}

export class StudentNotFoundErrorDto extends NotFoundErrorDto {
  constructor(studentId: string, studentName?: string) {
    super(
      studentName
        ? replaceParameters('Student with ID {1} and name {2} is not found', [
            studentId,
            studentName,
          ])
        : replaceParameters('Student with ID {1} is not found', [studentId]),
      'STUDENT_NOT_FOUND',
      studentName ? [studentId, studentName] : [studentId]
    );
  }
}

export class UserNotFoundErrorDto extends NotFoundErrorDto {
  constructor(userId: string) {
    super(
      replaceParameters('User with number {1} is not found', [userId]),
      'USER_NOT_FOUND'
    );
  }
}

export class UserRegistrationNotFoundErrorDto extends NotFoundErrorDto {
  constructor(id: number) {
    super(
      replaceParameters('User registration with id [{1}] not found', [
        id.toString(),
      ]),
      'USER_REGISTRATION_NOT_FOUND',
      [id.toString()]
    );
  }
}
