import { z } from 'zod';

import { components, paths } from '@openapi/schema';
import { zodOptionalString, zodString } from '@type/zod';
import { asArray } from '@util/array-util';


export const findStudentQuerySchema = z.object({
  id: z
    .union([zodString(), z.array(zodString())])
    .optional()
    .transform((val) => asArray(val)),
  classId: zodOptionalString(),
  name: zodOptionalString(),
});

export type ClassDto = components['schemas']['Class'];
export type StudentDto = components['schemas']['Student'];

export type FindStudentQueryDto = NonNullable<
  paths['/students']['get']['parameters']['query']
>;
export type FindStudent200ResponseDto =
  paths['/students']['get']['responses']['200']['content']['application/json'];
