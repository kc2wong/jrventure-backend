import { z } from 'zod';
import { components, paths } from '@openapi/schema';

export type ClassDto = components['schemas']['Class'];

export type FindClassQueryDto = NonNullable<
  paths['/classes']['get']['parameters']['query']
>;
export type FindClass200ResponseDto =
  paths['/classes']['get']['responses']['200']['content']['application/json'];
