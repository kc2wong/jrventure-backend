import { describe, expect, it } from 'vitest';
import {
  zodBoolean,
  zodDate,
  zodEmail,
  zodEnum,
  zodNumber,
  zodOptionalBoolean,
  zodOptionalDate,
  zodOptionalEmail,
  zodOptionalEnum,
  zodOptionalNumber,
  zodOptionalString,
  zodString,
} from '@type/zod';
import { addDays, subDays } from '@util/datetime-util';
import exp from 'constants';

describe('zodEmail schema', () => {
  it('should fail for invalid email', () => {
    const result = zodEmail().safeParse('invalid-email');
    expect(result.success).toBe(false);

    const message = result.success ? '' : result.error.issues[0].message;
    const parsed = JSON.parse(message);
    expect(parsed).toMatchObject({
      code: 'zod.error.InvalidEmail',
      message: 'Invalid email address',
    });
  });

  it('should fail for undefined', () => {
    const result = zodEmail().safeParse(undefined);
    expect(result.success).toBe(false);
  });

  it('should fail for empty string', () => {
    const result = zodEmail().safeParse('');
    expect(result.success).toBe(false);

    const message = result.success ? '' : result.error.issues[0].message;
    const parsed = JSON.parse(message);
    expect(parsed).toMatchObject({
      code: 'zod.error.InvalidEmail',
    });
  });

  it('should fail for email longer than maxLength', () => {
    const longEmail = 'a'.repeat(70) + '@example.com';
    const result = zodEmail({ maxLength: 50 }).safeParse(longEmail);
    expect(result.success).toBe(false);

    const message = result.success ? '' : result.error.issues[0].message;
    const parsed = JSON.parse(message);
    expect(parsed).toMatchObject({
      code: 'zod.error.TooLong',
      message: 'Maximum length is 50',
    });
  });

  it('should pass for valid email', () => {
    const result = zodEmail({ maxLength: 50 }).safeParse('valid@example.com');
    expect(result.success).toBe(true);
  });
});

describe('zodOptionalEmail schema', () => {
  it('should fail for invalid email', () => {
    const result = zodOptionalEmail().safeParse('invalid-email');
    expect(result.success).toBe(false);

    const message = result.success ? '' : result.error.issues[0].message;
    const parsed = JSON.parse(message);
    expect(parsed).toMatchObject({
      code: 'zod.error.InvalidEmail',
      message: 'Invalid email address',
    });
  });

  it('should fail for email longer than maxLength', () => {
    const longEmail = 'a'.repeat(70) + '@example.com';
    const result = zodOptionalEmail({ maxLength: 50 }).safeParse(longEmail);
    expect(result.success).toBe(false);

    const message = result.success ? '' : result.error.issues[0].message;
    const parsed = JSON.parse(message);
    expect(parsed).toMatchObject({
      code: 'zod.error.TooLong',
      message: 'Maximum length is 50',
    });
  });

  it('should pass for valid email', () => {
    const result = zodOptionalEmail({ maxLength: 50 }).safeParse(
      'valid@example.com'
    );
    expect(result.success).toBe(true);
    expect(result.data).toBe('valid@example.com');
  });

  it('should pass for undefined', () => {
    const result = zodOptionalEmail({ maxLength: 50 }).safeParse(undefined);
    expect(result.success).toBe(true);
    expect(result.data).toBe(undefined);
  });

  it('should pass for empty string', () => {
    const result = zodOptionalEmail().safeParse('');
    expect(result.success).toBe(true);
    expect(result.data).toBe(undefined);
  });
});

describe('zodString schema', () => {
  it('should fail for undefined', () => {
    const result = zodString().safeParse(undefined);
    expect(result.success).toBe(false);

    const message = result.success ? '' : result.error.issues[0].message;
    const parsed = JSON.parse(message);
    expect(parsed).toMatchObject({
      code: 'zod.error.Required',
      message: 'Must have value',
    });
  });

  it('should fail for empty string', () => {
    const result = zodString().safeParse('');
    expect(result.success).toBe(false);

    const message = result.success ? '' : result.error.issues[0].message;
    const parsed = JSON.parse(message);
    expect(parsed).toMatchObject({
      code: 'zod.error.Required',
      message: 'Must have value',
    });
  });

  it('should fail for string shorter than minLength', () => {
    const shortString = 'a'.repeat(9);
    const result = zodString({ minLength: 10 }).safeParse(shortString);
    expect(result.success).toBe(false);

    const message = result.success ? '' : result.error.issues[0].message;
    const parsed = JSON.parse(message);
    expect(parsed).toMatchObject({
      code: 'zod.error.TooShort',
      message: 'Mimimum length is 10',
    });
  });

  it('should fail for string longer than maxLength', () => {
    const longString = 'a'.repeat(70);
    const result = zodString({ maxLength: 50 }).safeParse(longString);
    expect(result.success).toBe(false);

    const message = result.success ? '' : result.error.issues[0].message;
    const parsed = JSON.parse(message);
    expect(parsed).toMatchObject({
      code: 'zod.error.TooLong',
      message: 'Maximum length is 50',
    });
  });

  it('should pass for valid string', () => {
    const result = zodString({ minLength: 10, maxLength: 50 }).safeParse(
      'validstring'
    );
    expect(result.success).toBe(true);
  });
});

describe('zodOptionalString schema', () => {
  it('should pass for undefined', () => {
    const result = zodOptionalString().safeParse(undefined);
    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
  });

  it('should pass for empty string', () => {
    const result = zodOptionalString().safeParse('');
    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
  });
});

describe('zodDate schema', () => {
  it('should pass for a valid ISO date string', () => {
    const result = zodDate().safeParse('2024-06-10T10:00:00.000Z');
    expect(result.success).toBe(true);
  });

  it('fails on non-ISO date string', () => {
    const result = zodDate().safeParse('not-a-date');
    expect(result.success).toBe(false);
    if (!result.success) {
      const message = JSON.parse(result.error.issues[0].message);
      expect(message).toMatchObject({
        code: 'zod.error.InvalidDate',
        message: 'Invalid ISO datetime string',
      });
    }
  });

  it('fails if date is before minValue', () => {
    const minDate = new Date('2024-06-10T00:00:00Z');
    const earlyDate = subDays(minDate, 1).toISOString();
    const result = zodDate({ minValue: minDate }).safeParse(earlyDate);
    expect(result.success).toBe(false);
    if (!result.success) {
      const message = JSON.parse(result.error.issues[0].message);
      expect(message.code).toBe('zod.error.TooEarly');
    }
  });

  it('fails if date is after maxValue', () => {
    const maxDate = new Date('2024-06-10T00:00:00Z');
    const lateDate = addDays(maxDate, 1).toISOString();
    const result = zodDate({ maxValue: maxDate }).safeParse(lateDate);
    expect(result.success).toBe(false);
    if (!result.success) {
      const message = JSON.parse(result.error.issues[0].message);
      expect(message.code).toBe('zod.error.TooLate');
    }
  });

  it('should pass when within min and max range', () => {
    const min = new Date('2024-06-01T00:00:00Z');
    const max = new Date('2024-06-30T00:00:00Z');
    const validDate = new Date('2024-06-15T10:00:00Z').toISOString();
    const result = zodDate({ minValue: min, maxValue: max }).safeParse(
      validDate
    );
    expect(result.success).toBe(true);
  });

  it('fails on empty string', () => {
    const result = zodDate().safeParse('');
    expect(result.success).toBe(false);
    if (!result.success) {
      const message = JSON.parse(result.error.issues[0].message);
      expect(message.code).toBe('zod.error.Required');
    }
  });
});

describe('zodOptionalDate schema', () => {
  it('should pass for undefined', () => {
    const result = zodOptionalDate().safeParse(undefined);
    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
  });

  it('should pass for empty string', () => {
    const result = zodOptionalDate().safeParse('');
    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
  });
});

describe('zodNumber schema', () => {
  it('should pass for valid number within range', () => {
    const result = zodNumber({ min: 1, max: 10 }).safeParse(5);
    expect(result.success).toBe(true);
    expect(result.data).toBe(5);
  });

  it('should pass for valid integer with no range', () => {
    const result = zodNumber().safeParse(5);
    expect(result.success).toBe(true);
    expect(result.data).toBe(5);
  });

  it('should pass for valid float with no range', () => {
    const result = zodNumber().safeParse(5.5);
    expect(result.success).toBe(true);
    expect(result.data).toBe(5.5);
  });

  it('should fail for number below min', () => {
    const result = zodNumber({ min: 3 }).safeParse(2);
    expect(result.success).toBe(false);
    if (!result.success) {
      const message = JSON.parse(result.error.issues[0].message);
      expect(message.code).toBe('zod.error.TooSmall');
      expect(message.message).toBe('Mimimum number is 3');
      expect(message.parameters).toEqual(['3']);
    }
  });

  it('should fail for number above max', () => {
    const result = zodNumber({ max: 10 }).safeParse(11);
    expect(result.success).toBe(false);
    if (!result.success) {
      const message = JSON.parse(result.error.issues[0].message);
      expect(message.code).toBe('zod.error.TooLarge');
      expect(message.message).toBe('Maximum number is 10');
      expect(message.parameters).toEqual(['10']);
    }
  });

  it('should fail for decimal when isDecimal is false', () => {
    const schema = zodNumber({ isDecimal: false });
    const result = schema.safeParse(5.1);
    expect(result.success).toBe(false);
    if (!result.success) {
      const message = JSON.parse(result.error.issues[0].message);
      expect(message.code).toBe('zod.error.InvalidNumber');
      expect(message.message).toBe('Must be a number with 0 decimal places');
      expect(message.parameters).toEqual(['0']);
    }
  });

  it('should fail for decimal places exceed limit', () => {
    const schema = zodNumber({ decimalPlaces: 2 });
    const result = schema.safeParse(3.14159);
    expect(result.success).toBe(false);
    if (!result.success) {
      const message = JSON.parse(result.error.issues[0].message);
      expect(message.code).toBe('zod.error.InvalidNumber');
      expect(message.message).toBe('Must be a number with 2 decimal places');
      expect(message.parameters).toEqual(['2']);
    }
  });

  it('should pass for integer when isDecimal is false', () => {
    const schema = zodNumber({ isDecimal: false });
    const result = schema.safeParse(5);
    expect(result.success).toBe(true);
    expect(result.data).toBe(5);
  });

  it('should pass for integer when isDecimal is true', () => {
    const schema = zodNumber({ isDecimal: true });
    {
      const result = schema.safeParse(5);
      expect(result.success).toBe(true);
      expect(result.data).toBe(5);
    }
    {
      // get same result for string input
      const result = schema.safeParse('5');
      expect(result.success).toBe(true);
      expect(result.data).toBe(5);
    }
  });

  it('should pass for decimal places within limit', () => {
    const schema = zodNumber({ decimalPlaces: 2 });
    {
      const result = schema.safeParse(3.14);
      expect(result.success).toBe(true);
      expect(result.data).toBe(3.14);
    }
    {
      // get same result for string input
      const result = schema.safeParse('3.14');
      expect(result.success).toBe(true);
      expect(result.data).toBe(3.14);
    }
  });

  it('combines all options correctly', () => {
    const schema = zodNumber({
      min: 1,
      max: 5,
      isDecimal: true,
      decimalPlaces: 2,
    });
    expect(schema.safeParse(3.14).data).toBe(3.14);

    {
      const result = schema.safeParse(6);
      const message = result.success ? '' : result.error.issues[0].message;
      const parsed = JSON.parse(message);
      expect(parsed).toMatchObject({
        code: 'zod.error.TooLarge',
      });
    }

    {
      const result = schema.safeParse(0);
      const message = result.success ? '' : result.error.issues[0].message;
      const parsed = JSON.parse(message);
      expect(parsed).toMatchObject({
        code: 'zod.error.TooSmall',
      });
    }

    {
      const result = schema.safeParse(3.145);
      const message = result.success ? '' : result.error.issues[0].message;
      const parsed = JSON.parse(message);
      expect(parsed).toMatchObject({
        code: 'zod.error.InvalidNumber',
      });
    }
  });
});

describe('zodOptionalNumber schema', () => {
  const schema = zodOptionalNumber({ isDecimal: true });

  it('should pass for undefined', () => {
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
  });

  it('should pass for empty string', () => {
    const result = schema.safeParse('');
    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
  });
});

describe('zolBoolean schema', () => {
  const schema = zodBoolean();

  it('should fail for undefined', () => {
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(false);

    const message = result.success ? '' : result.error.issues[0].message;
    const parsed = JSON.parse(message);
    expect(parsed).toMatchObject({
      code: 'zod.error.Required',
      message: 'Must have value',
    });
  });

  it('should pass for valid boolean value', () => {
    {
      const result = schema.safeParse(true);
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    }
    {
      const result = schema.safeParse(false);
      expect(result.success).toBe(true);
      expect(result.data).toBe(false);
    }
  });

  it('should pass for valid string value', () => {
    {
      const result = schema.safeParse('true');
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    }
    {
      const result = schema.safeParse('false');
      expect(result.success).toBe(true);
      expect(result.data).toBe(false);
    }
  });
});

describe('zodOptionalBoolean schema', () => {
  const schema = zodOptionalBoolean();

  it('should pass for undefined', () => {
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
  });

  it('should pass for valid boolean value', () => {
    {
      const result = schema.safeParse(true);
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    }
    {
      const result = schema.safeParse(false);
      expect(result.success).toBe(true);
      expect(result.data).toBe(false);
    }
  });

  it('should pass for valid string value', () => {
    {
      const result = schema.safeParse('true');
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    }
    {
      const result = schema.safeParse('false');
      expect(result.success).toBe(true);
      expect(result.data).toBe(false);
    }
  });
});

describe('zodEnum schema', () => {
  const schema = zodEnum(['Admin', 'User', 'Guest']);

  it('should pass for a valid value', () => {
    const result = schema.safeParse('Admin');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('Admin');
    }
  });

  it('should fail for an invalid value', () => {
    const result = schema.safeParse('Teacher');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(1);

      const parsed = JSON.parse(result.error.issues[0].message);
      expect(parsed).toMatchObject({
        code: 'zod.error.InvalidValue',
        message: 'Value must be one of: Admin, User, Guest',
      });
    }
  });

  it('should fail for undefined', () => {
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(false);
    if (!result.success) {
      const parsed = JSON.parse(result.error.issues[0].message);
      expect(parsed).toMatchObject({
        code: 'zod.error.InvalidValue',
        message: 'Value must be one of: Admin, User, Guest',
      });
    }
  });
});

describe('zodOptionalEnum schema', () => {
  const schema = zodOptionalEnum(['Admin', 'User', 'Guest']);

  it('should fail for empty string', () => {
    const result = schema.safeParse('');
    expect(result.success).toBe(false);
    if (!result.success) {
      const parsed = JSON.parse(result.error.issues[0].message);
      expect(parsed).toMatchObject({
        code: 'zod.error.InvalidValue',
        message: 'Value must be one of: Admin, User, Guest',
      });
    }
  });

  it('should pass for undefined', () => {
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
  });

  it('should pass for undefined with default value', () => {
    const schemaWithDefault = schema.default('Guest');
    const result = schemaWithDefault.safeParse(undefined);
    expect(result.success).toBe(true);
    expect(result.data).toBe('Guest');
  });
});
