import {
  Class,
  Student,
  User,
  UserRole,
  UserStatus,
} from '@prisma/client';

type UserCreationEntity = Omit<
  User,
  | 'oid'
  | 'created_datetime'
  | 'password'
  | 'password_expiry_datetime'
  | 'created_by_user_oid'
  | 'created_at'
  | 'updated_by_user_oid'
  | 'updated_at'
  | 'version'
>;

export type {
  Class as ClassEntity,
  Student as StudentEntity,
  User as UserEntity,
  UserRole as UserRoleEntity,
  UserStatus as UserStatusEntity,
  UserCreationEntity,
};
