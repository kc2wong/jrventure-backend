import { paths, components } from '../__generated__/openapi/schema';

type GetClassesQueryDto = paths['/classes']['get']['parameters']['query'];

type GetClasses200ResponseDto =
  paths['/classes']['get']['responses']['200']['content']['application/json'];

type FindStudentsQueryDto = paths['/students']['get']['parameters']['query'];

type FindStudents200ResponseDto =
  paths['/students']['get']['responses']['200']['content']['application/json'];

type UserGetQueryDto = paths['/users']['get']['parameters']['query'];

type UserGet200ResponseDto =
  paths['/users']['get']['responses']['200']['content']['application/json'];

type UsersPostRequestDto =
  paths['/users']['post']['requestBody']['content']['application/json'];

type UsersPost201ResponseDto =
  paths['/users']['post']['responses']['201']['content']['application/json'];

type UsersPutRequestPathDto = paths['/users/{id}']['put']['parameters']['path'];

type UsersPutRequestBodyDto =
  paths['/users/{id}']['put']['requestBody']['content']['application/json'];

type UsersPut200ResponseDto =
  paths['/users/{id}']['put']['responses']['200']['content']['application/json'];

type UserAuthenticationPostRequestDto =
  paths['/user-authentications']['post']['requestBody']['content']['application/json'];

type UserAuthenticationPost200ResponseDto =
  paths['/user-authentications']['post']['responses']['200']['content']['application/json'];

type GoogleAuthenticationPostRequestDto =
  paths['/google-authentications']['post']['requestBody']['content']['application/json'];

type GoogleAuthenticationPost200ResponseDto =
  paths['/google-authentications']['post']['responses']['200']['content']['application/json'];

type ActivityCategoryGet200ResponseDto =
  paths['/activity-categories']['get']['responses']['200']['content']['application/json'];

type ErrorDto = components['schemas']['Error'];

type LanguageDto = components['schemas']['Language'];

type ClassDto = components['schemas']['Class'];

type StudentDto = components['schemas']['Student'];

type UserRoleDto = components['schemas']['UserRole'];

type UserStatusDto = components['schemas']['UserStatus'];

type AuthenticationResponseDto =
  components['schemas']['AuthenticationResponse'];

type UserRegistrationDto = components['schemas']['UserRegistration'];

type UserCreationDto = components['schemas']['UserCreation'];

type UserUpdateDto = components['schemas']['UserUpdate'];

type UserDto = components['schemas']['User'];

type ActivityCategoryDto = components['schemas']['ActivityCategory'];

export {
  GetClassesQueryDto,
  GetClasses200ResponseDto,
  FindStudents200ResponseDto,
  FindStudentsQueryDto,
  UserRegistrationDto,
  UserGetQueryDto,
  UserGet200ResponseDto,
  UsersPostRequestDto,
  UsersPost201ResponseDto,
  UsersPutRequestPathDto,
  UsersPutRequestBodyDto,
  UsersPut200ResponseDto,
  UserAuthenticationPostRequestDto,
  UserAuthenticationPost200ResponseDto,
  GoogleAuthenticationPostRequestDto,
  GoogleAuthenticationPost200ResponseDto,
  ClassDto,
  ActivityCategoryGet200ResponseDto,
  StudentDto,
  ErrorDto,
  LanguageDto,
  AuthenticationResponseDto,
  UserRoleDto,
  UserStatusDto,
  UserCreationDto,
  UserUpdateDto,
  UserDto,
  ActivityCategoryDto,
};

class BaseErrorDto extends Error {
  code: string;
  parameters?: string[];

  constructor(message: string, code: string, parameters: string[] = []) {
    super(message);
    this.code = code;
    this.parameters = parameters;
  }
}

class BadRequestErrorDto extends BaseErrorDto {
  constructor(message: string, code: string, parameters: string[] = []) {
    super(message, code, parameters);
    this.name = 'BadRequestErrorDto';
  }
}

class NotFoundErrorDto extends BaseErrorDto {
  constructor(message: string, code: string, parameters: string[] = []) {
    super(message, code, parameters);
    this.name = 'NotFoundErrorDto';
  }
}

class UnAuthorizedErrorDto extends BaseErrorDto {
  constructor(message: string, code: string, parameters: string[] = []) {
    super(message, code, parameters);
    this.name = 'UnAuthorizedErrorDto';
  }
}
export { BaseErrorDto, BadRequestErrorDto, UnAuthorizedErrorDto };
