import { components, paths } from '@openapi/schema';

export type ClassDto = components['schemas']['Class'];
export type StudentDto = components['schemas']['Student'];

export type FindStudentQueryDto = NonNullable<
  paths['/students']['get']['parameters']['query']
>;
export type FindStudent200ResponseDto =
  paths['/students']['get']['responses']['200']['content']['application/json'];