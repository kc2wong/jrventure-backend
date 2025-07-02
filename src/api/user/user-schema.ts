import { z } from 'zod';
import { components, paths } from '@openapi/schema';
import {
  errorMessageNotRequired,
  errorMessageRequired,
  zodBoolean,
  zodEmail,
  zodEnum,
  zodNumber,
  zodOptionalString,
  zodString,
} from '@type/zod';
import { asArray } from '@util/array-util';

export const userRoleSchema = zodEnum([
  'Student',
  'Parent',
  'Teacher',
  'Admin',
  'Alumni',
]);
export const userStatusSchema = zodEnum(['Active', 'Inactive', 'Suspend']);

export const findUserQuerySchema = z.object({
  id: z
    .union([
      zodString(),
      z.array(zodString()),
    ])
    .optional()
    .transform((val) => asArray(val)),
  email: zodOptionalString(),
  name: zodOptionalString(),
  studentId: zodOptionalString(),
  role: z
    .union([
      userRoleSchema,
      z.array(userRoleSchema),
    ])
    .optional()
    .transform((val) => asArray(val)),
  status: z
    .union([
      userStatusSchema,
      z.array(userStatusSchema),
    ])
    .optional()
    .transform((val) => asArray(val)),
});


const userBaseSchema = z.object({
  email: zodEmail(),
  version: zodNumber(),
  name: z
    .record(zodOptionalString({ maxLength: 50 }))
    .refine((data) => data['English'] && data['English'].trim().length > 0, {
      message: errorMessageRequired.message,
      path: ['English'], // path of error
    }),
  role: userRoleSchema,
  status: userStatusSchema,
  withApprovalRight: zodBoolean(),
  entitledStudentId: z.array(zodString()),
});

const withRefinements = <T extends z.ZodTypeAny>(schema: T): T =>
  schema
    .refine(
      (data: any) =>
        (data.role !== 'Teacher' && data.withApprovalRight === false) ||
        data.role === 'Teacher',
      {
        message: errorMessageNotRequired.message,
        path: ['withApprovalRight'],
      }
    )
    .refine(
      (data: any) =>
        data.role !== 'Student' ||
        (data.entitledStudentId && data.entitledStudentId.length > 0),
      {
        message: errorMessageRequired.message,
        path: ['studentId'],
      }
    )
    .refine(
      (data: any) =>
        data.role === 'Student' ||
        data.role === 'Parent' ||
        !data.entitledStudentId ||
        data.entitledStudentId.length === 0,
      {
        message: errorMessageNotRequired.message,
        path: ['studentId'],
      }
    ) as unknown as T;

export const createUserSchema = withRefinements(
  userBaseSchema.omit({ version: true })
);
export const updateUserSchema = withRefinements(userBaseSchema);

export type UserRoleDto = z.infer<typeof userRoleSchema>;
export type UserStatusDto = z.infer<typeof userStatusSchema>;
export type CreateUserDto = components['schemas']['UserCreation'];
export type UserRegistrationDto = components['schemas']['UserRegistration'];
export type UpdateUserDto = z.infer<typeof userBaseSchema>;
export type UserDto = components['schemas']['User'];

export type FindUserQueryDto = NonNullable<
  paths['/users']['get']['parameters']['query']
>;
export type FindUser200ResponseDto =
  paths['/users']['get']['responses']['200']['content']['application/json'];

export type CreateUserRequestDto =
  paths['/users']['post']['requestBody']['content']['application/json'];

export type CreateUser201ResponseDto =
  paths['/users']['post']['responses']['201']['content']['application/json'];

export type UpdateUserPathDto =
  paths['/users/{id}']['put']['parameters']['path'];

export type UpdateUserRequestDto =
  paths['/users/{id}']['put']['requestBody']['content']['application/json'];

export type UpdateUser201ResponseDto =
  paths['/users/{id}']['put']['responses']['200']['content']['application/json'];
