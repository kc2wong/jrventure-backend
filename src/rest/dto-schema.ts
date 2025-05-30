import { paths, components } from '../__generated__/openapi/schema';

type GetClassesQueryDto = paths['/classes']['get']['parameters']['query'];

type ActivityGetQueryDto = paths['/activities']['get']['parameters']['query'];

type ActivityGetByIdPathDto =
  paths['/activities/{id}']['get']['parameters']['path'];

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

type ActivityGet200ResponseDto =
  paths['/activities']['get']['responses']['200']['content']['application/json'];

type ActivityGetById200ResponseDto =
  paths['/activities/{id}']['get']['responses']['200']['content']['application/json'];

type ActivityPostRequestDto =
  paths['/activities']['post']['requestBody']['content']['application/json'];

type ActivityPost201ResponseDto =
  paths['/activities']['post']['responses']['201']['content']['application/json'];

type ActivityPutRequestPathDto =
  paths['/activities/{id}']['put']['parameters']['path'];

type ActivityPutRequestDto =
  paths['/activities/{id}']['put']['requestBody']['content']['application/json'];

type ActivityPut200ResponseDto =
  paths['/activities/{id}']['put']['responses']['200']['content']['application/json'];

type AchievementPostRequestDto =
  paths['/achievements']['post']['requestBody']['content']['application/json'];

type AchievementPost201ResponseDto =
  paths['/achievements']['post']['responses']['201']['content']['application/json'];

type AchievementGetQueryDto = paths['/achievements']['get']['parameters']['query'];

type AchievementGet200ResponseDto =
  paths['/achievements']['get']['responses']['200']['content']['application/json'];

type AchievementPutRequestPathDto =
  paths['/achievements/{id}']['put']['parameters']['path'];

type AchievementPutRequestDto =
  paths['/achievements/{id}']['put']['requestBody']['content']['application/json'];

type AchievementPut200ResponseDto =
  paths['/achievements/{id}']['put']['responses']['200']['content']['application/json'];

type AchievementApprovalGetQueryDto = paths['/achievement-approvals']['get']['parameters']['query'];

type AchievementApprovalGet200ResponseDto =
  paths['/achievement-approvals']['get']['responses']['200']['content']['application/json'];

  type AchievementApprovalPutRequestPathDto =
  paths['/achievement-approvals/{id}']['put']['parameters']['path'];

type AchievementApprovalPutRequestDto =
  paths['/achievement-approvals/{id}']['put']['requestBody']['content']['application/json'];

type AchievementApprovalPut200ResponseDto =
  paths['/achievement-approvals/{id}']['put']['responses']['200']['content']['application/json'];

type ErrorDto = components['schemas']['Error'];

type LanguageDto = components['schemas']['Language'];

type ClassDto = components['schemas']['Class'];

type StudentDto = components['schemas']['Student'];

type UserRoleDto = components['schemas']['UserRole'];

type UserStatusDto = components['schemas']['UserStatus'];

type AchievementSubmissionRoleDto =
  components['schemas']['AchievementSubmissionRole'];

type ActivityStatusDto = components['schemas']['ActivityStatus'];

type AuthenticationResponseDto =
  components['schemas']['AuthenticationResponse'];

type UserRegistrationDto = components['schemas']['UserRegistration'];

type UserCreationDto = components['schemas']['UserCreation'];

type UserUpdateDto = components['schemas']['UserUpdate'];

type UserDto = components['schemas']['User'];

type ActivityCategoryDto = components['schemas']['ActivityCategory'];

type ActivityDto = components['schemas']['Activity'];

type FindActivityOrderByFieldDto =
  components['schemas']['FindActivityOrderByField'];

type ActivityPayloadDto = components['schemas']['ActivityPayload'];

type AchievementStatusDto = components['schemas']['AchievementStatus'];

type AchievementApprovalStatusDto =
  components['schemas']['AchievementApprovalStatus'];

type AchievementCreationDto = components['schemas']['AchievementCreation'];

type AchievementDto = components['schemas']['Achievement'];

type AchievementApprovalDto = components['schemas']['AchievementApproval'];

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
  ActivityGetQueryDto,
  ActivityCategoryGet200ResponseDto,
  ActivityGet200ResponseDto,
  ActivityGetByIdPathDto,
  ActivityGetById200ResponseDto,
  AchievementPostRequestDto,
  AchievementPost201ResponseDto,
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
  ActivityDto,
  ActivityStatusDto,
  AchievementSubmissionRoleDto,
  AchievementCreationDto,
  AchievementStatusDto,
  AchievementDto,
  AchievementApprovalStatusDto,
  AchievementApprovalDto,
  ActivityPayloadDto,
  ActivityPostRequestDto,
  ActivityPost201ResponseDto,
  ActivityPutRequestPathDto,
  ActivityPutRequestDto,
  ActivityPut200ResponseDto,
  AchievementPutRequestPathDto,
  AchievementPutRequestDto,
  AchievementPut200ResponseDto,
  AchievementApprovalPutRequestPathDto,
  AchievementApprovalPutRequestDto,
  AchievementApprovalPut200ResponseDto,
  FindActivityOrderByFieldDto,
  AchievementGetQueryDto,
  AchievementGet200ResponseDto,
  AchievementApprovalGetQueryDto,
  AchievementApprovalGet200ResponseDto
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
