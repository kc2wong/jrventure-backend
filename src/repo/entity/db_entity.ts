import {
  Activity,
  ActivityCategory,
  Class,
  Student,
  User,
  UserRole,
  UserStatus,
} from '@prisma/client';

type UserCreationEntity = Omit<
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

type ActivityCreationEntity = Omit<
  Activity,
  | 'oid'
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
  ActivityCategory as ActivityCategoryEntity,
  Activity as ActivityEntity,
  ActivityCreationEntity
};
