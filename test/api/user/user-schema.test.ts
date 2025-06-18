import { describe, it, expect } from 'vitest';
import { createUserSchema, CreateUserDto } from '@api/user/user-schema';

const assertType = <T extends U, U>(value: T): void => {
  // noop – only used to assert type compatibility at compile time
};

describe('createUserSchema', () => {
  it('should produce output assignable to UserCreation type', () => {
    const rawInput = {
      email: 'alice@example.com',
      name: { English: 'Alice' },
      role: 'Teacher',
      status: 'Active',
      withApprovalRight: 'true', // note: this is a string!
      entitledStudentId: [],
    };

    const result = createUserSchema.safeParse(rawInput);
    expect(result.success).toBe(true);

    if (result.success) {
      const parsed = result.data;

      // ✅ Compile-time assertion only
      assertType<typeof parsed, CreateUserDto>(parsed);
      expect(parsed.withApprovalRight).toBe(true);
    }
  });
});
