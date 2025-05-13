import {
  UnAuthorizedErrorDto,
} from '../dto-schema';

export class NotLoginErrorDto extends UnAuthorizedErrorDto {
  constructor() {
    super(
      'You must login to the system before performing this operation',
      'NO_LOGIN_SESSION',
      []
    );
  }
}
