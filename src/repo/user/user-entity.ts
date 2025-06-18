import { User } from '@prisma/client';

export type CreateUserEntity = Omit<
  User,
  | 'oid'
  | 'password'
  | 'password_expiry_datetime'
  | 'created_by_user_oid'
  | 'created_at'
  | 'updated_by_user_oid'
  | 'updated_at'
  | 'version'
>;
