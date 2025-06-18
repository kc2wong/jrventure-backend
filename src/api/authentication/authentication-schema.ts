import { paths } from '@openapi/schema';

export type UserAuthenticationRequestDto =
  paths['/user-authentications']['post']['requestBody']['content']['application/json'];

export type UserAuthentication200ResponseDto =
  paths['/user-authentications']['post']['responses']['200']['content']['application/json'];

export type GoogleAuthenticationRequestDto =
  paths['/google-authentications']['post']['requestBody']['content']['application/json'];

export type GoogleAuthentication200ResponseDto =
  paths['/google-authentications']['post']['responses']['200']['content']['application/json'];
